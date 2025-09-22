<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentPublication extends Model
{
    use HasFactory;

    protected $table = 'document_publications';

    protected $fillable = [
        'document_id',
        'judul_publikasi',
        'kelompok_riset',
        'authors1',
        'authors2',
        'authors3',
        'authors4',
        'authors5',
        'authors6',
        'authors7',
        'nonprsdi_authors',
        'jenis',
        'status',
        'status_upload',    
        'nama_jurnal',
        'scopus_indexed',
        'reputasi',
        'url',
        'doi',
    ];

    protected $casts = [
        'scopus_indexed' => 'boolean',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}