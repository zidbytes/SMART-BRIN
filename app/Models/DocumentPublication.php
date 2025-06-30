<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentPublication extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_id', 
        'periode_input', 
        'judul_publikasi', 
        'authors',
        'jenis', 
        'status', 
        'nama_jurnal', 
        'scopus_indexed', 
        'reputasi',
        'file_drive_link', 
        'url', 
        'doi',
    ];

    protected $casts = [
        'authors' => 'array', 
        'scopus_indexed' => 'boolean', 
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}