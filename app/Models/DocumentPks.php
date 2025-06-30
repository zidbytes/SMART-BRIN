<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DocumentPks extends Model
{
    use HasFactory;
    
    // Nama tabel berbeda dari konvensi, jadi kita definisikan secara eksplisit
    protected $table = 'document_pks';

    protected $fillable = [
        'document_id', 
        'judul', 
        'pic_prsdi1',
        'pic_prsdi2', 
        'pic_prsdi3', 
        'pic_nonprsdi',  
        'tipe', 
        'jenis', 
        'sumber', 
        'output',
        'pihak_k3', 
        'nilai', 
        'keterangan', 
        'no_kerjasama', 
        'tanggal_kerjasama',
        'no_perjanjian', 
        'tanggal_perjanjian', 
        'link_upload', 
        'status_upload',
        'tahun_pks',
        'link_bukti_dukung', 
        'catatan', 
        'jumlah_keuangan',
    ];

    protected $casts = [
        'pic_prsdi' => 'array',
        'nilai' => 'double',
        'jumlah_keuangan' => 'double',
        'tanggal_kerjasama' => 'date',
        'tanggal_perjanjian' => 'date',
    ];

    public function document(): BelongsTo
    {
        return $this->belongsTo(Document::class);
    }
}