<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentKekayaanIntelektual extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id', 
        'inventors', 
        'status',
        'jenis', 
        'no_pendaftaran', 
        'tanggal_daftar',
        'no_sertifikat', 
        'tanggal_sertifikasi', 
        'link_upload', 
        'link_dokumen',
    ];

    protected $casts = [
        'inventors' => 'array',
        'tanggal_daftar' => 'date',
        'tanggal_sertifikasi' => 'date',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}