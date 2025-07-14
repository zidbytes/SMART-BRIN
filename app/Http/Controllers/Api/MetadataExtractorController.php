<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Partitech\PhpMistral\MistralClient;
use Partitech\PhpMistral\Messages;
use Spatie\PdfToText\Pdf;
use Exception;
use App\Services\PromptService; 
use Illuminate\Support\Facades\Log;

class MetadataExtractorController extends Controller
{
    /**
     * Handle the metadata extraction request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Services\PromptService  $promptService
     * @return \Illuminate\Http\JsonResponse
     */
    public function extract(Request $request, PromptService $promptService) 
    {
        set_time_limit(180);
        ini_set('memory_limit', '512M');

        try {
            $request->validate([
                'file' => 'required|file|mimes:pdf|max:10240',
                'documentKey' => 'required|string',
            ]);

            $file = $request->file('file');
            $documentKey = $request->input('documentKey');

            $pdfToTextPath = 'C:/poppler/bin/pdftotext.exe';

            $textFromPdf = (new Pdf($pdfToTextPath))
                ->setPdf($file->getRealPath())
                ->text();
            
            $textFromPdf = mb_substr($textFromPdf, 0, 20000);

            // Memanggil prompt dari service, bukan dari controller ini
            $prompt = $promptService->createPromptForDocument($documentKey, $textFromPdf);

            if (!$prompt) {
                return response()->json(['error' => 'Invalid document key provided.'], 400);
            }

            $apiKey = env('MISTRAL_API_KEY');
            if (empty($apiKey)) {
                return response()->json(['error' => 'MISTRAL_API_KEY is not set in the .env file.'], 500);
            }

            $client = new MistralClient($apiKey);
            $messages = (new Messages())->addUserMessage($prompt);
            $params = [
                'model' => 'mistral-large-latest',
                'response_format' => ['type' => 'json_object'],
            ];

            $startTime = microtime(true);

            $response = $client->chat($messages, $params);

            $endTime = microtime(true);
            $duration = round($endTime - $startTime, 2);

            if (isset($response->error)) {
                $errorMessage = "Mistral API Error: " . ($response->error->message ?? 'Unknown error');
                throw new Exception($errorMessage);
            }
            
            Log::info("Ekstraksi metadata (Mistral) berhasil untuk '{$documentKey}'. Durasi: {$duration} detik.");

            $choices = $response->getChoices();

            if (empty($choices[0]->getContent())) {
                 throw new Exception('Invalid response structure from Mistral API. The response might not contain the expected content.');
            }

            $jsonOutput = $choices[0]->getContent();
            $metadata = json_decode($jsonOutput, true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new Exception('Failed to decode JSON from Mistral response. Raw content: ' . $jsonOutput);
            }

            return response()->json([
                'metadata' => $metadata
            ]);

        } catch (Exception $e) {
            return response()->json([
                'error' => 'An exception occurred on the server.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

}