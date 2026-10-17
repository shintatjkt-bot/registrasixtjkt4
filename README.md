# Ruang Kelas TJKT 4 · Pure GitHub Pages

Website kelas dengan warna pastel kuning dan pink, responsif untuk HP/laptop, dan tanpa Supabase, database eksternal, PHP, atau API key.

## Isi folder
- `index.html` — struktur halaman
- `style.css` — tampilan pastel dan responsif
- `app.js` — registrasi/login lokal dan fitur halaman
- `config.js` — keterangan konfigurasi (tidak wajib diubah)

## Jalankan di GitHub Pages
1. Ekstrak ZIP ini.
2. Buat repository GitHub baru, misalnya `ruang-kelas-tjkt4`.
3. Unggah **isi folder** ini ke root repository (pastikan `index.html` ada langsung di root).
4. Buka **Settings → Pages**.
5. Pada **Build and deployment**, pilih **Deploy from a branch**, branch `main`, folder `/(root)`, lalu Save.
6. Tunggu proses publikasi selesai, kemudian buka URL Pages yang diberikan GitHub.

## Penting tentang login lokal
Registrasi dan login menggunakan `localStorage` browser. Artinya:
- akun hanya tersedia di browser/perangkat yang membuatnya;
- membersihkan data browser bisa menghapus akun;
- akun tidak bisa dipakai lintas perangkat/browser;
- ini bukan autentikasi aman dan bukan pengganti backend/database;
- password disimpan di browser dan dapat dibaca dari perangkat yang sama, jadi gunakan password khusus untuk demo ini, bukan password penting.

GitHub Pages hanya menyajikan file statis. Tanpa backend, website ini tidak dapat menyediakan akun online yang aman atau menyinkronkan akun antarperangkat.

## Catatan isi kelas
Jadwal teori dan bengkel di dalam website merupakan contoh berdasarkan draft awal dan harus dicocokkan dengan jadwal terbaru sekolah. Jadwal piket masih contoh kelompok; ganti sesuai data resmi. Hindari mengunggah NIS, alamat rumah, nomor telepon, atau data pribadi siswa ke repository publik.

## Mengubah isi
- Warna, ukuran, layout: edit `style.css`.
- Teks halaman, jadwal, contoh piket: edit fungsi pada `app.js`.
- Struktur halaman login: edit `index.html`.
