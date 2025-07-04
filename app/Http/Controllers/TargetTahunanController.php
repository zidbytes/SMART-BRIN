<?php

namespace App\Http\Controllers;

use App\Models\TargetTahunan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class TargetTahunanController extends Controller
{
    public function index(): Response
    {
        $targets = TargetTahunan::orderBy('tahun', 'desc')->get();

        return Inertia::render('target-capaian', [
            'targets' => $targets,
            'auth' => [
                'user' => Auth::user(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $this->authorizeHead();

        $validated = $request->validate([
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

        TargetTahunan::updateOrCreate(
            ['tahun' => $validated['tahun']],
            $validated
        );

        return redirect()->route('target-tahunan.index')->with('success', 'Target tahunan berhasil disimpan.');
    }

    public function edit($id): Response
    {
        $this->authorizeHead();

        $target = TargetTahunan::findOrFail($id);
        return Inertia::render('target-edit', [
            'target' => $target,
        ]);
    }

    public function update(Request $request, $id)
    {
        $this->authorizeHead();

        $validated = $request->validate([
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

        $target = TargetTahunan::findOrFail($id);
        $target->update($validated);

        return redirect()->route('target-tahunan.index')->with('success', 'Target tahunan berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $this->authorizeHead();

        $target = TargetTahunan::findOrFail($id);
        $target->delete();

        return redirect()->route('target-tahunan.index')->with('success', 'Target tahunan berhasil dihapus.');
    }

    private function authorizeHead()
    {
        if (Auth::user()->role !== 'head') {
            abort(403, 'Unauthorized');
        }
    }
}
