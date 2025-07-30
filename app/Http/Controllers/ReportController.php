<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ReportExport;
use Barryvdh\DomPDF\Facade\Pdf;
use App\Models\{
    Document,
    TargetTahunan,
    DocumentPublication,
    DocumentKekayaanIntelektual,
    DocumentPurwarupa,
    DocumentPks,
    DocumentLoaStudiLanjut,
    DocumentPelatihanLuarNegeri
};
use Carbon\Carbon;

class ReportController extends Controller
{
    use AuthorizesRequests;

    public function index(Request $request): Response
    {
        $this->authorize('viewReport', Document::class);

        return Inertia::render('report-capaian', $this->getReportData($request));
    }

    public function export(Request $request)
    {
        $this->authorize('viewReport', Document::class);

        DB::beginTransaction();
        try {
            $data = $this->getReportData($request);
            $format = $request->input('format', 'excel');
            $period = $this->getPeriodDisplay($data);
            
            // Format filename
            $filename = 'laporan-capaian_' . $period;
            
            // Calculate percentage and status for each row
            $rows = collect($data['capaian'])->map(
                function($value, $key) use ($data) {
                    $target = $data['target'][$key] ?? 0;
                    $percentage = $target > 0 ? min(100, round(($value / $target) * 100)) : 0;
                    
                    $status = 'Belum Tercapai';
                    if ($percentage >= 100) {
                        $status = 'Tercapai';
                    } elseif ($percentage >= 75) {
                        $status = 'Hampir Tercapai';
                    }
                    
                    // Format dana_eksternal as currency
                    $targetFormatted = $key === 'dana_eksternal' 
                        ? 'Rp ' . number_format($target, 0, ',', '.') 
                        : $target;
                        
                    $valueFormatted = $key === 'dana_eksternal'
                        ? 'Rp ' . number_format($value, 0, ',', '.')
                        : $value;
                    
                    return [
                        ucfirst(str_replace('_', ' ', $key)),
                        $targetFormatted,
                        $valueFormatted,
                        $percentage . '%',
                        $status
                    ];
                }
            )->values()->toArray();

            DB::commit();

            switch ($format) {
                case 'pdf':
                    return $this->exportPdf($rows, $period, $filename);
                
                case 'word':
                    return $this->exportWord($rows, $period, $filename);
                
                case 'excel':
                default:
                    return Excel::download(
                        new ReportExport($rows),
                        $filename . '.xlsx'
                    );
            }
        } catch (\Throwable $e) {
            DB::rollBack();
            report($e);
            return back()->with('error', 'Gagal mengekspor laporan: ' . $e->getMessage());
        }
    }
    
    /**
     * Export report data to PDF format
     */
    private function exportPdf(array $rows, string $period, string $filename)
    {
        // Define the indicators mapping (to match your template's expectations)
        $indicators = [
            'kekayaan_intelektual' => 'Kekayaan Intelektual',
            'publikasi_ilmiah_global' => 'Publikasi Ilmiah Global',
            'purwarupa' => 'Purwarupa',
            'kerjasama_internasional' => 'Kerjasama Internasional',
            'kerjasama_nasional' => 'Kerjasama Nasional',
            'dana_eksternal' => 'Dana Eksternal',
            'sdm_studi_lanjut' => 'SDM Studi Lanjut',
            'postdoc_visiting' => 'Postdoc / Visiting',
            'pelatihan_internasional' => 'Pelatihan Internasional',
        ];
        
        $data = [
            'rows' => $rows,
            'period' => $period,
            'date' => now()->translatedFormat('d F Y'),
            'indicators' => $indicators  // Add the indicators variable
        ];
        
        $pdf = Pdf::loadView('exports.report-pdf', $data)
            ->setPaper('a4')
            ->setOption('margin-top', 20)
            ->setOption('margin-right', 20)
            ->setOption('margin-bottom', 20)
            ->setOption('margin-left', 20);
        
        return $pdf->download($filename . '.pdf');
    }
    
    /**
     * Export report data to Word (DOCX) format
     */
    private function exportWord(array $rows, string $period, string $filename)
    {
        $data = [
            'rows' => $rows,
            'period' => $period,
            'date' => now()->translatedFormat('d F Y')
        ];
        
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Disposition' => 'attachment; filename="' . $filename . '.docx"'
        ];
        
        return response()->view('exports.report-word', $data, 200, $headers);
    }
    
    /**
     * Get formatted period display for the report
     */
    private function getPeriodDisplay(array $data): string
    {
        $tahun = $data['tahun'];
        $bulan = $data['bulan'];
        $triwulan = $data['triwulan'];
        
        if ($bulan) {
            $monthNames = [
                'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
            ];
            return $monthNames[$bulan - 1] . '_' . $tahun;
        } elseif ($triwulan) {
            return 'Triwulan' . $triwulan . '_' . $tahun;
        } else {
            return 'Tahun_' . $tahun;
        }
    }

    private function getReportData(Request $request): array
    {
        $tahun = (int) $request->input('tahun', Carbon::now()->year);
        $bulan = $request->input('bulan');
        $triwulan = $request->input('triwulan');

        $range = function ($query) use ($tahun, $bulan, $triwulan) {
            $query->where('status', 'approved')->whereYear('created_at', $tahun);

            if ($bulan) {
                $query->whereMonth('created_at', $bulan);
            } elseif ($triwulan) {
                $startMonth = ($triwulan - 1) * 3 + 1;
                $endMonth = $startMonth + 2;
                $query->whereBetween(DB::raw('MONTH(created_at)'), [$startMonth, $endMonth]);
            }
        };

        $capaian = [
            'kekayaan_intelektual'     => $this->countWithFilter(DocumentKekayaanIntelektual::class, $range),
            'publikasi_ilmiah_global'  => $this->countWithFilter(DocumentPublication::class, $range),
            'purwarupa'                => $this->countWithFilter(DocumentPurwarupa::class, $range),
            'kerjasama_internasional'  => $this->countWithFilter(DocumentPks::class, $range, ['jenis' => 'Luar Negeri']),
            'kerjasama_nasional'       => $this->countWithFilter(DocumentPks::class, $range, ['jenis' => 'Dalam Negeri']),
            'dana_eksternal'           => $this->sumDanaEksternal($range),
            'sdm_studi_lanjut'         => $this->countWithFilter(DocumentLoaStudiLanjut::class, $range),
            'postdoc_visiting'         => $this->countWithFilter(DocumentPelatihanLuarNegeri::class, $range, ['status' => ['POSTDOCTORAL', 'VISITING RESEARCH']]),
            'pelatihan_internasional'  => $this->countWithFilter(DocumentPelatihanLuarNegeri::class, $range, ['jenis' => 'Luar Negeri']),
        ];

        $target = TargetTahunan::where('tahun', $tahun)->first()?->toArray() ?? [];

        return [
            'tahun'    => $tahun,
            'bulan'    => $bulan      ? (int) $bulan : null,
            'triwulan' => $triwulan   ? (int) $triwulan : null,
            'capaian'  => $capaian,
            'target'   => $target,
        ];
    }

    /**
     * Hitung total berdasarkan relasi document dan kondisi tambahan (jika ada).
     */
    private function countWithFilter(string $modelClass, \Closure $range, array $extra = []): int
    {
        return $modelClass::whereHas('document', $range)
            ->when($extra, function($q) use ($extra) {
                foreach ($extra as $key => $value) {
                    if (is_array($value)) {
                        $q->whereIn($key, $value);
                    } else {
                        $q->where($key, $value);
                    }
                }
            })
            ->count();
    }

    /**
     * Hitung total nilai dana eksternal.
     */
    private function sumDanaEksternal(\Closure $range): float|int
    {
        return DocumentPks::whereHas('document', $range)
            ->sum('nilai');
    }
}
