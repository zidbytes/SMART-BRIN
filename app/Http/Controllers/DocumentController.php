<?php

namespace App\Http\Controllers;

use App\Models\Document;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class DocumentController extends Controller
{

    use AuthorizesRequests;
    public function index()
    {
        $user = Auth::user();

        $documents = $user->role === 'researcher'
            ? Document::where('user_id', $user->id)->get()
            : Document::all();

        return response()->json($documents);
    }

    public function show(Document $document)
    {
        $this->authorize('view', $document);

        return response()->json($document);
    }

    public function store(Request $request)
    {
        $this->authorize('create', Document::class);

        $validated = $request->validate([
            'document_type' => 'required|string',
            'title' => 'required|string',
            'kelompok_riset' => 'required|string',
        ]);

        $document = Document::create([
            'user_id' => Auth::id(),
            'document_type' => $validated['document_type'],
            'title' => $validated['title'],
            'kelompok_riset' => $validated['kelompok_riset'],
        ]);

        return response()->json($document, 201);
    }

    public function update(Request $request, Document $document)
    {
        $this->authorize('update', $document);

        $user = Auth::user();

        if ($user->role === 'monev') {
            $validated = $request->validate([
                'status' => 'required|in:submitted,revised,approved,rejected',
                'notes' => 'nullable|string',
                'monev_stamp' => 'nullable|date',
            ]);

            $document->update($validated);
        }

        if (in_array($user->role, ['head', 'researcher'])) {
            $validated = $request->validate([
                'title' => 'sometimes|required|string',
                'kelompok_riset' => 'sometimes|required|string',
                'status' => 'sometimes|in:submitted,revised,approved,rejected',
                'notes' => 'nullable|string',
                // Tidak mengizinkan `monev_stamp` dan `bulan` (bulan diambil dari created_at)
            ]);

            // Filter field yang tidak boleh diubah
            unset($validated['monev_stamp']);

            $document->update($validated);
        }

        return response()->json($document);
    }

    public function destroy(Document $document)
    {
        $this->authorize('delete', $document);

        $document->delete();

        return response()->json(['message' => 'Document deleted successfully']);
    }
}
