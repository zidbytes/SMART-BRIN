<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentPelatihanLuarNegeri extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id', 
        'nama_sdm_prsdi', 
        'non_sdm_prsdi', 
        'jenis',
        'keterangan', 
        'upload_dakung',
        'direct_link',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}