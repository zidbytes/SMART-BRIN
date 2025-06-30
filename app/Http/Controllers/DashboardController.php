<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\DocumentPublication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        // --- KPI Data ---
        $totalPublications = Document::where('document_type', 'publication')->count();
        $scopusIndexedCount = DocumentPublication::where('scopus_indexed', true)->count();
        $totalDocuments = Document::count();

        // Hitung jumlah author berdasarkan kolom authors1-authors6
        $publicationAuthorsCount = DocumentPublication::select(
            DB::raw("
                COUNT(authors1) + COUNT(authors2) + COUNT(authors3) +
                COUNT(authors4) + COUNT(authors5) + COUNT(authors6)
                as total_authors
            ")
        )->first()->total_authors ?? 0;

        // Hitung jumlah periset aktif (distinct user_id)
        $activeResearchers = Document::distinct('user_id')->count('user_id');

        // --- Chart: Perkembangan Publikasi per Bulan ---
        $publicationsTrend = Document::where('document_type', 'publication')
        ->select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as count')
        )
        ->groupBy(DB::raw('MONTH(created_at)'))
        ->orderBy(DB::raw('MONTH(created_at)'))
        ->get()
        ->map(function ($item) {
            return [
                'name' => date("F", mktime(0, 0, 0, $item->month, 1)),
                'total' => $item->count
            ];
        });


        // --- Chart: Jenis Publikasi (Pie) ---
        $publicationTypes = DocumentPublication::select('jenis', DB::raw('COUNT(*) as count'))
            ->groupBy('jenis')
            ->get();

        // --- Chart: Scopus vs Non-Scopus (Bar) ---
        $scopusData = [
            ['name' => 'Scopus', 'count' => $scopusIndexedCount],
            ['name' => 'Non-Scopus', 'count' => DocumentPublication::where('scopus_indexed', false)->count()],
        ];

        // --- Table: Publikasi dengan Catatan ---
        $publicationsWithNotes = Document::where('document_type', 'publication')
            ->whereNotNull('notes')
            ->with('user', 'publication')
            ->latest()
            ->limit(3)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'periset' => $document->user->name ?? 'N/A',
                    'judul' => $document->title,
                    'catatan' => $document->notes,
                    'tahun' => $document->created_at->year,
                    'jenis' => $document->publication->jenis ?? 'N/A',
                    'status' => $document->publication->scopus_indexed ? 'Scopus' : 'Non-Scopus',
                ];
            });

        // --- Table: Detail Publikasi Terbaru ---
        $detailPublications = Document::where('document_type', 'publication')
            ->with('user', 'publication')
            ->latest()
            ->limit(2)
            ->get()
            ->map(function ($document) {
                return [
                    'id' => $document->id,
                    'periset' => $document->user->name ?? 'N/A',
                    'judul_publikasi' => $document->title,
                    'tahun' => $document->created_at->year,
                    'jenis' => $document->publication->jenis ?? 'N/A',
                    'status' => $document->publication->scopus_indexed ? 'Scopus' : 'Non-Scopus',
                ];
            });

        return Inertia::render('dashboard', [
            'kpi' => [
                'totalPublications' => $totalPublications,
                'scopusIndexedCount' => $scopusIndexedCount,
                'publicationAuthorsCount' => $publicationAuthorsCount,
                'activeResearchers' => $activeResearchers,
            ],
            'charts' => [
                'publicationsTrend' => $publicationsTrend,
                'publicationTypes' => $publicationTypes,
                'scopusData' => $scopusData,
            ],
            'tables' => [
                'publicationsWithNotes' => $publicationsWithNotes,
                'detailPublications' => $detailPublications,
            ],
        ]);
    }
}
