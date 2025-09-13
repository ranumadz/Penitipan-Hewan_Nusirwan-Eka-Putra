<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePenitipansTable extends Migration
{
    public function up()
    {
        Schema::create('penitipans', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_penitipan')->unique();
            $table->string('jenis_hewan');
            $table->string('nama_hewan')->nullable();
            $table->string('nama_pemilik');
            $table->string('telepon_pemilik')->nullable();
            $table->string('email_pemilik');
            $table->dateTime('waktu_penitipan');
            $table->dateTime('waktu_pengambilan')->nullable();
            $table->unsignedBigInteger('biaya_penitipan')->nullable();
            $table->string('foto_path')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('penitipans');
    }
}
