# Penitipan Hewan By Nusirwan Eka Putra (Laravel + React + Docker)

Aplikasi CRUD sederhana untuk penitipan hewan — backend Laravel API, frontend React, MySQL, berjalan dengan Docker.

## Fitur
- Tambah penitipan (foto upload, validasi)
- List data dengan filter & pagination
- Update pengambilan (hitung biaya otomatis)
- Delete data
- Validasi frontend & backend (email, waktu, foto <= 2MB)
- Nomor penitipan auto: `YYMMDD/JENIS/NoUrut`
- Dockerized

## Informasi Set Up
1. Pastikan `docker` & `docker-compose` terinstall.
2. Clone repo atau extract zip, lalu di folder project jalankan:
   ```bash
   docker-compose up --build
   ```
3. Backend berjalan di `http://localhost:8000` (API di `/api/penitipans`).
4. Frontend di `http://localhost:3000`.

## Notes
- Backend menggunakan Laravel. Composer install & migration akan dijalankan otomatis oleh container command.
- Jika butuh menyesuaikan APP_KEY atau DB credentials, edit `backend/.env.example` dan file environment di container.
- Format waktu: frontend mengirim `DD/MM/YYYY HH:MM:SS`.
