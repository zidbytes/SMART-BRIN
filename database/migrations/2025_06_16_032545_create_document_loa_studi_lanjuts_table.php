<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('document_loa_studi_lanjuts', function (Blueprint $t) {
            $t->id();
            $t->foreignId('document_id')
            ->constrained('documents')->onDelete('cascade');
            $t->string('nama_sdm_iptek')->nullable();
            $t->string('kelompok_riset');
            $t->string('jenjang_pendidikan');
            $t->string('nama_universitas')->nullable();
            $t->string('status');
            $t->text('keterangan')->nullable();
            $t->string('upload_dakung')->nullable();
            $t->year('tahun_masuk')->nullable();
            $t->string('direct_evidence')->nullable();
            $t->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_loa_studi_lanjuts');
    }
};
