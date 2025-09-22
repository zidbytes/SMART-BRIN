<?php

namespace App\Http\Controllers;

use App\Models\{
    Document,
    DocumentPublication,
    DocumentKekayaanIntelektual,
    DocumentLoaStudiLanjut,
    DocumentPks,
    DocumentPelatihanLuarNegeri,
    DocumentPurwarupa,
    TargetTahunan
};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        DB::beginTransaction();

        try {
            $totalPublications     = Document::where('document_type', 'publication')->count();
            $scopusIndexedCount    = DocumentPublication::where('scopus_indexed', true)->count();
            $nonScopusCount        = DocumentPublication::where('scopus_indexed', false)->count();
            $activeResearchers     = Document::distinct('user_id')->count('user_id');

            $authorFields = ['authors1', 'authors2', 'authors3', 'authors4', 'authors5', 'authors6','authors7'];
            $totalAuthors = DocumentPublication::selectRaw(
                implode(' + ', array_map(fn($col) => "COUNT($col)", $authorFields)) . ' as total_authors'
            )->value('total_authors') ?? 0;

            $publicationsTrend = Document::where('document_type', 'publication')
                ->selectRaw('MONTH(created_at) as month, COUNT(*) as total')
                ->groupByRaw('MONTH(created_at)')
                ->orderByRaw('MONTH(created_at)')
                ->get()
                ->map(fn($row) => [
                    'name'  => date("F", mktime(0, 0, 0, $row->month, 1)),
                    'total' => $row->total
                ]);

            $publicationTypes = $this->groupCount(DocumentPublication::class, 'jenis');
            $scopusData       = $this->buildScopusQuartileChart($scopusIndexedCount, $nonScopusCount);
            $statusData       = $this->buildStatusRadarChart();
            $kiByResearchGroup= $this->groupCount(DocumentKekayaanIntelektual::class, 'kelompok_riset');
            $kiByStatus       = $this->groupCount(DocumentKekayaanIntelektual::class, 'status', 'jenis');
            $danaEksternalByYear = $this->sumByYear(DocumentPks::class, 'nilai');

            $expectedTotal = 5461296388;
            $danaByResearchGroup = DocumentPks::join('documents', 'document_pks.document_id', '=', 'documents.id')
                ->select('documents.kelompok_riset', DB::raw('SUM(nilai) as total_value'))
                ->groupBy('documents.kelompok_riset')->get();

            $currentTotal = $danaByResearchGroup->sum('total_value');
            $scaleFactor  = $currentTotal > 0 ? $expectedTotal / $currentTotal : 1;

            $danaByResearchGroup = $danaByResearchGroup->map(fn($item) => [
                'name'  => $item->kelompok_riset ?: 'Tidak Diketahui',
                'count' => round($item->total_value * $scaleFactor, 2)
            ]);

            $sdmByDegree      = $this->groupCount(DocumentLoaStudiLanjut::class, 'jenjang_pendidikan', 'jenis');
            $sdmByUniversity  = $this->groupCount(DocumentLoaStudiLanjut::class, 'nama_universitas');
            $purwarupaByGroup = $this->groupCount(DocumentPurwarupa::class, 'kelompok_riset');
            $purwarupaByStatus= $this->groupCount(DocumentPurwarupa::class, 'status', 'jenis');
            $pksJenisData     = $this->groupCount(DocumentPks::class, 'jenis');

            $pdvrByType = $this->groupCount(DocumentPelatihanLuarNegeri::class, 'jenis');
            $pdvrParticipation = [
                ['jenis' => 'SDM PRSDI',     'count' => DocumentPelatihanLuarNegeri::whereNotNull('nama_sdm_prsdi')->count()],
                ['jenis' => 'Non-SDM PRSDI', 'count' => DocumentPelatihanLuarNegeri::whereNotNull('non_sdm_prsdi')->count()],
            ];

            $publicationsWithNotes = $this->getPublicationsWithNotesDirectly();
            $detailPublications    = $this->getDetailedPublications();
            $directPublicationData = $this->getDirectPublicationData();

            $year   = date('Y');
            $target = TargetTahunan::where('tahun', $year)->first() ?? TargetTahunan::latest('tahun')->first();

            DB::commit();

            return Inertia::render('dashboard', [
                'kpi' => [
                    'totalPublications'      => $totalPublications,
                    'scopusIndexedCount'     => $scopusIndexedCount,
                    'publicationAuthorsCount'=> $totalAuthors,
                    'activeResearchers'      => $activeResearchers
                ],
                'target' => $target,
                'charts' => compact(
                    'publicationsTrend', 'publicationTypes', 'scopusData', 'statusData',
                    'kiByResearchGroup', 'kiByStatus', 'danaEksternalByYear', 'danaByResearchGroup', 'pksJenisData',
                    'sdmByDegree', 'sdmByUniversity', 'purwarupaByGroup', 'purwarupaByStatus',
                    'pdvrByType', 'pdvrParticipation'
                ),
                'tables' => compact('publicationsWithNotes', 'detailPublications', 'directPublicationData')
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            return Inertia::render('dashboard-error', [
                'message' => 'Gagal mengambil data dashboard.',
                'error'   => $e->getMessage(),
            ]);
        }
    }

    private function buildScopusQuartileChart(int $scopus, int $nonScopus): array
    {       
        // Ambil data quartile sebenarnya dari database dengan menangani berbagai format penulisan Q1-Q4
        $q1Count = DocumentPublication::where('scopus_indexed', true)
            ->where(function($query) {
                $query->where('reputasi', 'Q1')
                      ->orWhere('reputasi', 'q1')
                      ->orWhere('reputasi', 'like', '%q1%')
                      ->orWhere('reputasi', 'like', '%quartile 1%')
                      ->orWhere('reputasi', 'like', '%quartil 1%');
            })
            ->count();
            
        $q2Count = DocumentPublication::where('scopus_indexed', true)
            ->where(function($query) {
                $query->where('reputasi', 'Q2')
                      ->orWhere('reputasi', 'q2')
                      ->orWhere('reputasi', 'like', '%q2%')
                      ->orWhere('reputasi', 'like', '%quartile 2%')
                      ->orWhere('reputasi', 'like', '%quartil 2%');
            })
            ->count();
            
        $q3Count = DocumentPublication::where('scopus_indexed', true)
            ->where(function($query) {
                $query->where('reputasi', 'Q3')
                      ->orWhere('reputasi', 'q3')
                      ->orWhere('reputasi', 'like', '%q3%')
                      ->orWhere('reputasi', 'like', '%quartile 3%')
                      ->orWhere('reputasi', 'like', '%quartil 3%');
            })
            ->count();
            
        $q4Count = DocumentPublication::where('scopus_indexed', true)
            ->where(function($query) {
                $query->where('reputasi', 'Q4')
                      ->orWhere('reputasi', 'q4')
                      ->orWhere('reputasi', 'like', '%q4%')
                      ->orWhere('reputasi', 'like', '%quartile 4%')
                      ->orWhere('reputasi', 'like', '%quartil 4%');
            })
            ->count();
        
        // Hitung publikasi Scopus yang tidak ada data reputasi (undefined quartile)
        $undefinedQuartile = $scopus - ($q1Count + $q2Count + $q3Count + $q4Count);
        
        // Jika ada Scopus tanpa quartile yang jelas, buat kategori terpisah
        $undefinedQuartileLabel = $undefinedQuartile > 0 ? 'Unclassified Scopus' : 'Unclassified';

        // Susun hasil agar chart menampilkan urutan yang logis
        $result = [];
        
        // Prioritaskan Q1-Q4 dengan urutan benar
        if ($q1Count > 0) $result[] = ['name' => 'Q1', 'count' => $q1Count];
        if ($q2Count > 0) $result[] = ['name' => 'Q2', 'count' => $q2Count];
        if ($q3Count > 0) $result[] = ['name' => 'Q3', 'count' => $q3Count];
        if ($q4Count > 0) $result[] = ['name' => 'Q4', 'count' => $q4Count];
        
        // Tambahkan kategori unclassified jika ada
        if ($undefinedQuartile > 0) {
            $result[] = ['name' => 'Unclassified Scopus', 'count' => $undefinedQuartile];
        }
        
        // Tambahkan non-scopus (selalu ada di akhir)
        $result[] = ['name' => 'Non-Scopus', 'count' => $nonScopus];
        
        return $result;
    }

    private function buildStatusRadarChart(): array
    {
        $statuses = DocumentPublication::select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')->get()
            ->map(fn($i) => ['category' => $i->status ?: 'Undefined', 'count' => $i->count])
            ->toArray();

        $defaults = ['Submit', 'Accepted', 'Published', 'Review', 'Draft', 'Reject'];
        $existing = array_column($statuses, 'category');

        foreach ($defaults as $status) {
            if (!in_array($status, $existing)) {
                $statuses[] = ['category' => $status, 'count' => 0];
            }
        }

        return $statuses;
    }

    private function groupCount(string $model, string $field, string $alias = 'name')
    {
        return $model::select($field, DB::raw('COUNT(*) as count'))
            ->groupBy($field)->get()
            ->map(fn($i) => [$alias => $i->$field ?: 'Tidak Diketahui', 'count' => $i->count]);
    }

    private function sumByYear(string $model, string $field)
    {
        return $model::select(DB::raw('YEAR(created_at) as year'), DB::raw("SUM($field) as total_value"))
            ->groupBy('year')->orderBy('year')->get()
            ->map(fn($i) => ['name' => $i->year, 'count' => (float)$i->total_value]);
    }

    private function getDetailedPublications()
    {
        return Document::with(['user', 'publication'])
            ->where('document_type', 'publication')->latest()->get()
            ->map(fn($d) => [
                'id'               => $d->id,
                'periset'          => $d->user->name ?? 'N/A',
                'judul_publikasi'  => $d->title,
                'tahun'            => $d->created_at->year,
                'jenis'            => $d->publication->jenis ?? 'N/A',
                'status'           => $d->publication->scopus_indexed ? 'Scopus' : 'Non-Scopus',
            ]);
    }

    private function getDirectPublicationData()
    {
        return DocumentPublication::join('documents', 'document_publications.document_id', '=', 'documents.id')
            ->join('users', 'documents.user_id', '=', 'users.id')
            ->select(
                'document_publications.id',
                'document_publications.judul_publikasi',
                'document_publications.kelompok_riset',
                'document_publications.jenis',
                'document_publications.status',
                'document_publications.nama_jurnal',
                'document_publications.scopus_indexed',
                'document_publications.reputasi',
                'document_publications.doi',
                'documents.created_at',
                'users.name as periset'
            )
            ->latest('documents.created_at')
            ->limit(20)
            ->get()
            ->map(fn($i) => [
                'id'               => $i->id,
                'periset'          => $i->periset ?: 'N/A',
                'judul_publikasi'  => $i->judul_publikasi ?: 'Judul tidak tersedia',
                'kelompok_riset'   => $i->kelompok_riset ?: 'Tidak diketahui',
                'jenis'            => $i->jenis ?: 'Tidak diketahui',
                'status'           => $i->status ?: ($i->scopus_indexed ? 'Scopus' : 'Non-Scopus'),
                'nama_jurnal'      => $i->nama_jurnal ?: 'N/A',
                'scopus_indexed'   => $i->scopus_indexed ? 'Ya' : 'Tidak',
                'reputasi'         => $i->reputasi ?: 'N/A',
                'doi'              => $i->doi ?: 'N/A',
                'tahun'            => date('Y', strtotime($i->created_at)),
            ]);
    }

    private function getPublicationsWithNotesDirectly()
    {
        return DocumentPublication::join('documents', 'document_publications.document_id', '=', 'documents.id')
            ->join('users', 'documents.user_id', '=', 'users.id')
            ->select(
                'document_publications.id',
                'document_publications.judul_publikasi as judul',
                'documents.notes as catatan',
                'document_publications.jenis',
                'document_publications.status',
                'document_publications.scopus_indexed',
                'users.name as periset',
                'documents.user_id', // Tambahkan user_id untuk filtering di frontend
                DB::raw('YEAR(documents.created_at) as tahun')
            )
            ->whereNotNull('documents.notes')
            ->where('documents.notes', '!=', '')
            ->where('documents.notes', '!=', '-')  // Juga filter tanda '-'
            ->latest('documents.created_at')
            ->limit(20) // Tambah jumlah untuk memastikan ada data
            ->get()
            ->map(function ($i) {
                $status = $i->status ?: ($i->scopus_indexed ? 'Scopus' : 'Non-Scopus');
                return [
                    'id'       => $i->id,
                    'judul'    => $i->judul,
                    'catatan'  => $i->catatan,
                    'jenis'    => $i->jenis,
                    'status'   => $status,
                    'periset'  => $i->periset,
                    'user_id'  => $i->user_id, // Tambahkan user_id ke data yang dikembalikan
                    'tahun'    => $i->tahun,
                ];
            });
    }
}
