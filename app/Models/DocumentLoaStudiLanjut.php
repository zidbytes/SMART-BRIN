<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentLoaStudiLanjut extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id', 
        'nama_sdm_iptek', 
        'jenjang_pendidikan',
        'nama_universitas',
        'keterangan', 
        'upload_dakung',
        'tahun_masuk',
        'direct_evidence',
    ];
    
    protected $casts = [
        'tahun_masuk' => 'integer',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}