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
        Schema::create('document_kekayaan_intelektuals', function (Blueprint $t) {
            $t->id();
            $t->foreignId('document_id')
            ->constrained('documents')->onDelete('cascade');
            $t->string('status')->nullable(); 
            $t->string('inventors1')->nullable();
            $t->string('inventors2')->nullable();
            $t->string('inventors3')->nullable();
            $t->string('inventors4')->nullable();
            $t->string('inventors5')->nullable();
            $t->string('inventors6')->nullable();
            $t->string('inventors7')->nullable();
            $t->string('inventors8')->nullable();
            $t->string('nonprsdi_inventors')->nullable();   
            $t->string('jenis')->nullable();
            $t->string('no_pendaftaran')->nullable();
            $t->date('tanggal_daftar')->nullable();
            $t->string('no_sertifikat')->nullable();
            $t->date('tanggal_sertifikasi')->nullable();
            $t->string('link_upload')->nullable();
            $t->string('link_dokumen')->nullable();
            $t->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_kekayaan_intelektuals');
    }
};
