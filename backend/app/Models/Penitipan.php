<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Penitipan extends Model
{
    protected $fillable = [
        'nomor_penitipan',
        'jenis_hewan',
        'nama_hewan',
        'nama_pemilik',
        'telepon_pemilik',
        'email_pemilik',
        'waktu_penitipan',
        'waktu_pengambilan',
        'biaya_penitipan',
        'foto_path'
    ];
}
