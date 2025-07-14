<?php

namespace App\Http\Controllers;

use App\Models\TargetTahunan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TargetTahunanController extends Controller
{
    /**
     * Menampilkan halaman daftar target tahunan.
     * Dapat diakses oleh 'head' dan 'monev'.
     */
    public function index(): Response
    {
        // Menggunakan otorisasi baru yang mengizinkan 'monev' untuk melihat.
        $this->authorizeViewer();

        $targets = TargetTahunan::orderByDesc('tahun')->get();

        return Inertia::render('target-capaian', compact('targets'));
    }

    /**
     * Menyimpan target tahunan baru.
     * Hanya dapat diakses oleh 'head'.
     */
    public function store(Request $request)
    {
        $this->authorizeHead();

        $validated = $this->validateTarget($request);

        TargetTahunan::updateOrCreate(
            ['tahun' => $validated['tahun']],
            $validated
        );

        return redirect()
            ->route('target-tahunan.index')
            ->with('success', 'Target tahunan berhasil disimpan.');
    }

    /**
     * Menampilkan form edit target tahunan.
     * Hanya dapat diakses oleh 'head'.
     */
    public function edit($id): Response
    {
        $this->authorizeHead();

        $target = TargetTahunan::findOrFail($id);

        return Inertia::render('target-edit', compact('target'));
    }

    /**
     * Memperbarui target tahunan yang ada.
     * Hanya dapat diakses oleh 'head'.
     */
    public function update(Request $request, $id)
    {
        $this->authorizeHead();

        $validated = $this->validateTarget($request);

        $target = TargetTahunan::findOrFail($id);
        $target->update($validated);

        return redirect()
            ->route('target-tahunan.index')
            ->with('success', 'Target tahunan berhasil diperbarui.');
    }

    /**
     * Menghapus target tahunan.
     * Hanya dapat diakses oleh 'head'.
     */
    public function destroy($id)
    {
        $this->authorizeHead();

        TargetTahunan::findOrFail($id)->delete();

        return redirect()
            ->route('target-tahunan.index')
            ->with('success', 'Target tahunan berhasil dihapus.');
    }

    /**
     * Otorisasi aksi hanya untuk peran 'head'.
     */
    private function authorizeHead(): void
    {
        abort_if(Auth::user()?->role !== 'head', 403, 'Unauthorized Action');
    }

    /**
     * Otorisasi untuk melihat data, diizinkan untuk 'head' dan 'monev'.
     */
    private function authorizeViewer(): void
    {
        abort_if(
            !in_array(Auth::user()?->role, ['head', 'monev']),
            403,
            'Unauthorized'
        );
    }

    /**
     * Validasi data request untuk target tahunan.
     */
    private function validateTarget(Request $request): array
    {
        return $request->validate([
            'tahun' => 'required|integer|digits:4',
            'kekayaan_intelektual' => 'required|integer|min:0',
            'publikasi_ilmiah_global' => 'required|integer|min:0',
            'purwarupa' => 'required|integer|min:0',
            'kerjasama_internasional' => 'required|integer|min:0',
            'kerjasama_nasional' => 'required|integer|min:0',
            'dana_eksternal' => 'required|integer|min:0',
            'sdm_studi_lanjut' => 'required|integer|min:0',
            'postdoc_visiting' => 'required|integer|min:0',
            'pelatihan_internasional' => 'required|integer|min:0',
        ]);
    }
}
