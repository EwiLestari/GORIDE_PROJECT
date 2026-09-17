# GoRide - Sistem Informasi Penyewaan Motor Premium 🛵

GoRide adalah platform penyewaan sepeda motor *premium* berbasis web yang dikembangkan menggunakan **React (Vite)** di sisi klien dan **Node.js (Express)** di sisi server. Sistem ini mendukung dua hak akses utama (Role): **Pelanggan (Customer)** dan **Administrator**, lengkap dengan fitur manajemen katalog, sistem *booking*, *favorites*, ulasan, hingga pengelolaan data dan status transaksi secara *real-time*.

## 🌟 Fitur Utama

### 👤 Pelanggan (Customer)
- **Autentikasi Aman**: Registrasi dan Login dengan enkripsi JWT & Bcrypt.
- **Katalog & Filter**: Pencarian motor berdasarkan nama, kategori (Sport, Matic, Manual), dan opsi pengurutan harga/abjad.
- **Sistem Booking Lengkap**: Penyewaan berdasarkan tanggal mulai dan selesai, perhitungan total harga secara otomatis, dan pilihan metode pembayaran.
- **Fitur Interaktif**: 
  - *Add to Favorites* (Menyimpan motor idaman).
  - Memberikan ulasan (Rating 1-5 & Komentar) untuk pesanan yang telah berstatus *Completed*.
- **Profil Pengguna**: Mengubah data diri dan mengunggah *Avatar* kustom (disimpan secara lokal menggunakan sistem *Multer*).
- **Riwayat Transaksi**: Pantau status pesanan terkini (*Pending, Confirmed, Cancelled, Completed*).

### 👨‍💻 Administrator
- **Dashboard Analitik**: Ringkasan data (Total Pendapatan, Total Pengguna, Motor Aktif, dan Pesanan yang Sedang Berjalan).
- **Manajemen Data Motor (CRUD)**: Menambah, mengedit, dan menghapus motor beserta detail CC, harga, gambar, dan ketersediaan stok.
- **Manajemen Kategori**: Mengatur jenis-jenis motor yang disewakan di platform.
- **Manajemen Transaksi**: Menyetujui pesanan baru (*Confirm*), menyelesaikan penyewaan (*Complete*), atau membatalkan pesanan (*Cancel*).

---

## 🛠️ Teknologi yang Digunakan

### Frontend (Client-Side)
- **React 18** (Dikonfigurasi via Vite untuk performa maksimal)
- **Tailwind CSS** & **Framer Motion** (Desain UI berkonsep *Glassmorphism* dan Animasi Transisi)
- **React Router DOM** (Routing halaman yang terlindungi / *Protected Routes*)
- **Axios** (Penanganan *HTTP Requests* & *Interceptors* untuk Token)

### Backend (Server-Side)
- **Node.js** & **Express.js** (Arsitektur REST API)
- **Supabase (PostgreSQL)** (Database Relasional Tangguh berbasis Cloud)
- **Multer** (Penanganan *Upload File/Image* ke *Local Storage*)
- **JSON Web Token (JWT)** & **Bcrypt** (Sistem Autentikasi & Keamanan Enkripsi Password)

---

## 🗺️ Alur Sistem (Flowchart)

Alur logika dari sistem ini (baik untuk sisi Admin maupun Customer) telah didokumentasikan di dalam file `flowchart.md` (menggunakan sintaks **Mermaid.js**). 

Untuk memvisualisasikan diagram tersebut secara grafis dan rapi:
1. Buka [Draw.io](https://app.diagrams.net/) di browser.
2. Pilih menu **Arrange / Tanda Plus (+)** -> **Insert** -> **Advanced** -> **Mermaid...**
3. *Copy-Paste* isi dari file `flowchart.md` ke dalam kotak yang disediakan, lalu klik **Insert**.

---

## 🚀 Panduan Instalasi & Menjalankan Proyek Secara Lokal

Pastikan **Node.js** (v18+) dan package manager seperti **pnpm** / **npm** sudah terinstal di perangkat Anda sebelum memulai.

### 1. Konfigurasi Database (Supabase)
1. Buat *Project* baru di [Supabase](https://supabase.com/).
2. Buat tabel-tabel sesuai relasi (Users, Motorcycles, Categories, Bookings, Likes, Reviews). 
3. Dapatkan kredensial **URL** dan **Anon Key** dari menu `Project Settings > API`.

### 2. Konfigurasi Backend
1. Buka terminal dan arahkan ke direktori backend:
   ```bash
   cd backend
   ```
2. Instal semua dependensi:
   ```bash
   pnpm install
   ```
3. Buat file `.env` (bisa meng-copy dari `.env.example`) di dalam folder `backend/` dan masukkan variabel berikut:
   ```env
   PORT=5000
   SUPABASE_URL=masukkan_url_supabase_anda_disini
   SUPABASE_KEY=masukkan_anon_key_supabase_anda_disini
   JWT_SECRET=masukkan_kunci_rahasia_jwt_bebas_disini
   ```
4. Jalankan *server* backend:
   ```bash
   pnpm run dev
   ```
   *(Server akan berjalan pada alamat `http://localhost:5000`)*

### 3. Konfigurasi Frontend
1. Buka tab terminal baru dan arahkan ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi UI:
   ```bash
   pnpm install
   ```
3. Jalankan aplikasi web:
   ```bash
   pnpm run dev
   ```
   *(Frontend akan dapat diakses secara lokal di `http://localhost:5173`)*

---

## 🔑 Kredensial Akun Pengujian (Demo/Testing)

Untuk memudahkan dosen atau penguji dalam mencoba aplikasi tanpa harus melakukan registrasi dari awal, gunakan akun berikut untuk *login*:

**1. Akun Administrator (Admin Role)**
- **Email:** `admin@goride.com`
- **Password:** `admin123`
> *(Gunakan akun ini untuk melihat Dashboard Admin, menambah data motor, dan mengelola pesanan pelanggan).*

**2. Akun Pelanggan (Customer Role)**
- **Email:** `user@goride.com`
- **Password:** `user123`
> *(Gunakan akun ini untuk melakukan penyewaan motor, menyukai motor (favorit), dan memberikan ulasan/rating).*

---

## 🗃️ Pengujian & Inisialisasi Data (Seeding)

Di dalam direktori `backend/`, terdapat beberapa *script* tambahan yang bisa dijalankan di terminal untuk mempercepat pengisian data saat pengujian (testing) dan penilaian:
- `node seed_categories.js` : Mengisi daftar kategori secara otomatis ke dalam database.
- `node seed_motorcycles.js` : Membuat puluhan data motor dummy secara acak untuk mengisi halaman katalog.
- `node make_admin.js` : Menjadikan akun pengguna biasa menjadi Administrator. (Wajib dijalankan agar pengguna bisa masuk ke halaman Dashboard Admin).

---
*Proyek ini disusun dan dirancang sebagai bentuk implementasi komprehensif Sistem Informasi (SI) dan Rekayasa Perangkat Lunak (RPL). Meliputi implementasi CRUD kompleks, State Management, Autentikasi Berbasis Token (JWT), Multi-Role Access, Relasi Database yang utuh, dan Antarmuka Responsif berstandar industri modern.*
