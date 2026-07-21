# Tutora App — Flowchart Lengkap Per Pengguna

Dokumen ini menggambarkan seluruh alur user journey per peran pengguna dalam Tutora App.

---

## 1. STUDENT — Alur Pemesanan & Belajar

```mermaid
flowchart TD
    A([Buka App]) --> B{Sudah Login?}
    B -- Tidak --> C[Welcome Screen]
    C --> D{Pilih Mode}
    D -- Daftar --> E[Register Student\nNama, Email, No HP, Password]
    D -- Login --> F[Login Screen\nEmail + Password]
    E --> G[OTP Verifikasi WhatsApp]
    G --> H{OTP Valid?}
    H -- Ya --> I[Dashboard Student]
    H -- Tidak --> G
    F --> I
    B -- Ya --> I

    I --> J[Home: Cari Tutor]
    J --> K[Form Pemesanan\nMata Pelajaran, Tingkat]
    K --> K1[Pilih Durasi:\n1 Jam atau 1.5 Jam]
    K1 --> K2[Pilih Paket:\n1 atau 4 atau 8 Sesi]
    K2 --> K3[Preferensi Gender Tutor]
    K3 --> K4{Tipe Booking?}
    K4 -- Sekarang --> K5[Lanjut]
    K4 -- Terjadwal --> K6[Pilih Time Slot]
    K6 --> K7{Slot 19.00-21.00?}
    K7 -- Ya --> K8[Flash Deal Malam\nDiskon 20% Otomatis]
    K7 -- Tidak --> K5
    K8 --> K5
    K5 --> L[Pilih Lokasi Penjemputan\nMaps + Cari Alamat]
    L --> M[Gunakan Promo/Voucher - Opsional]
    M --> N[Konfirmasi Harga\nSubtotal, Diskon, Grand Total]
    N --> O[Bayar via TutorPay atau QRIS]
    O --> P{Saldo Cukup?}
    P -- Tidak --> Q[Top Up TutorPay\nMinimarket atau Transfer]
    Q --> O
    P -- Ya --> R[Sedang Mencari Tutor\nAnimasi Radar]
    R --> S{Tutor Ditemukan?}
    S -- Timeout --> T[Tidak ada Tutor\nCoba Kembali]
    S -- Ya --> U[Tutor Menuju Lokasi\nLive Tracking Map + ETA]
    U --> V[Tutor Tiba\nNotifikasi Push]
    V --> W[Sesi Belajar Aktif\nTimer Countdown]
    W --> X{Emergency?}
    X -- SOS --> Y[Tombol SOS Merah:\nKirim GPS + Rekam Audio\nNotif ke Orang Tua]
    X -- Lanjut --> Z[Sesi Selesai]
    Z --> AA[Beri Ulasan dan Rating\n1-5 Bintang + Tag]
    AA --> AB([Selesai])
```

---

## 2. PARENT — Alur Dashboard Keluarga

```mermaid
flowchart TD
    A([Buka App]) --> B{Sudah Login?}
    B -- Tidak --> C[Login atau Register Parent\nRole: Orang Tua]
    C --> D[OTP Verifikasi WA]
    D --> E[Dashboard Keluarga]
    B -- Ya --> E

    E --> F[Lihat Daftar Profil Anak]
    F --> G{Pilih Aksi}

    G -- Tambah Anak --> H[Input Data Anak\nNama, Kelas atau Grade]
    H --> I[Sub-Profil Anak Dibuat]
    I --> F

    G -- Lihat Detail Anak --> J[Profil Anak Detail]
    J --> J1[Saldo TutorPay Anak]
    J --> J2[Riwayat Guru Pengajar]
    J --> J3[Histori Transaksi Sesi]
    J --> J4[Laporan Pembelajaran dari Tutor]

    G -- Pantau Sesi Aktif --> K{Ada Sesi Berjalan?}
    K -- Tidak --> L[Belum ada sesi aktif]
    K -- Ya --> M[Live Tracking Dashboard]
    M --> M1[Map Posisi Tutor Real-time]
    M --> M2[Timer Sesi yang Berjalan]
    M --> M3[Info Tutor dan Mata Pelajaran]
    M --> N{Darurat?}
    N -- SOS Diterima --> O[Notif SOS Muncul:\nLokasi + Audio tersedia]

    G -- Pesankan Guru untuk Anak --> P[Pilih Profil Anak Dulu]
    P --> Q[Masuk ke Form Pemesanan\natas nama anak tersebut]
    Q --> R[Alur Order Sama dengan Student]
    R --> S([Tutor Dipesan])

    G -- Isi Saldo Anak --> T[Top Up TutorPay Anak\nvia Transfer atau QR]
    T --> F
```

---

## 3. TUTOR — Alur Registrasi, Onboarding & Mengajar

```mermaid
flowchart TD
    A([Buka App]) --> B{Sudah punya akun?}
    B -- Daftar Tutor --> C[Step 1: Biodata\nNama, Email, WA, Univ, Jurusan\nIPK, Mata Pelajaran, Foto Profil]
    C --> D[Step 2: KYC via Privy.id\nFoto KTP + Liveness Detection]
    D --> E{KYC Valid?}
    E -- Gagal --> F[Ulangi Verifikasi]
    E -- Berhasil --> G[Step 3: Upload Dokumen\nKTM atau Ijazah, Transkrip, Portofolio]
    G --> H[Step 4: Rekam Video Perkenalan\n1 Menit di dalam App]
    H --> I[Submit Pendaftaran]
    I --> J[Ruang Tunggu]

    J --> K{Status Review?}
    K -- Video Direview --> L[Menunggu Tim Tutora\nMaks 1x24 Jam]
    L --> M{Lolos?}
    M -- Tidak --> N[Notifikasi Ditolak]
    M -- Ya --> O[Undangan Interview Zoom\nJadwal via Email atau WA]
    O --> P[Interview Berlangsung]
    P --> Q{Diterima?}
    Q -- Tidak --> N
    Q -- Ya --> R([Akun Aktif\nMasuk Dashboard Tutor])

    B -- Login --> R

    R --> S[Dashboard Tutor\nStatus Online atau Offline]
    S --> T{Toggle Status}
    T -- Online --> U[Menunggu Order Masuk]
    T -- Offline --> S

    U --> V[Notifikasi Order Masuk]
    V --> W{Terima dalam 15 Detik?}
    W -- Timeout --> X[Order Ditolak Otomatis]
    X --> U
    W -- Terima --> Y[Navigasi ke Lokasi Siswa\nMaps Aktif]
    Y --> Z[Tiba di Sekitar Lokasi]

    Z --> AA{Radius dari Lokasi Siswa?}
    AA -- Lebih dari 100 Meter --> AB[Tombol Mulai Sesi DISABLE]
    AB --> AC[Tutor Gerak Lebih Dekat]
    AC --> AA
    AA -- Kurang dari 100 Meter --> AD[Tombol Mulai Sesi AKTIF]

    AD --> AE[Sesi Belajar Dimulai\nTimer Berjalan]
    AE --> AF[Sesi Selesai]
    AF --> AG[Form Laporan Wajib\nRingkasan Materi\nKarakter Anak\nFoto Bersama Siswa]
    AG --> AH[Submit Laporan\nDikirim ke Parent]
    AH --> AI[Pendapatan Masuk TutorPay]
    AI --> S
```

---

## 4. Alur Pembayaran & Escrow

```mermaid
sequenceDiagram
    participant Student
    participant TutorApp
    participant Midtrans
    participant Escrow
    participant Tutor
    participant Xendit

    Student->>TutorApp: Konfirmasi Order
    TutorApp->>Midtrans: Request Charge QRIS atau VA
    Midtrans-->>Student: Tampilkan QR atau Kode Bayar
    Student->>Midtrans: Membayar
    Midtrans-->>TutorApp: Webhook Pembayaran Sukses
    TutorApp->>Escrow: Dana Masuk ke Escrow
    Note over Escrow: Dana ditahan sampai sesi selesai
    TutorApp->>Tutor: Notif Order Baru
    Tutor-->>TutorApp: Terima Order
    Note over TutorApp,Tutor: Sesi Berlangsung
    TutorApp->>Escrow: Release Dana setelah laporan disubmit
    Escrow->>Tutor: Saldo TutorPay Tutor Bertambah
    Tutor->>Xendit: Request Withdraw ke Rekening
    Xendit-->>Tutor: Dana Cair dikurangi biaya Rp 2.500
```
