# Tutora App — Perencanaan Backend & Arsitektur Teknologi

> Dokumen ini adalah **blueprint teknis** untuk pengembangan backend Tutora ke depan.
> Tidak ada kode yang diimplementasikan di sini — hanya rancangan, rekomendasi teknologi, dan penjelasan mengapa setiap pilihan dipilih.

---

## Ringkasan Visi Arsitektur

Tutora adalah platform **marketplace on-demand** yang mempertemukan Siswa/Orang Tua dengan Tutor secara real-time. Arsitektur yang dipilih harus mampu menangani:

1. **Real-time matching** — Tutor harus menerima notifikasi order dalam hitungan detik
2. **Geo-fencing & tracking** — Lokasi GPS diperbarui terus-menerus dengan latensi rendah
3. **Escrow payment** — Dana siswa ditahan, baru dilepas setelah laporan tersubmit
4. **Onboarding KYC** — Proses verifikasi dokumen multi-step yang harus dipersisten
5. **Skalabilitas** — Dirancang untuk bisa bertumbuh dari 50 sesi/hari ke 50.000 sesi/hari

---

## Stack Teknologi yang Direkomendasikan

### Perbandingan & Keputusan

| Lapisan | Pilihan Lama (Common) | Rekomendasi Tutora | Alasan |
|---|---|---|---|
| Backend Runtime | Express.js | **Fastify (Node.js)** | 2-3x lebih cepat dari Express karena schema-based JSON serialization. Cocok untuk API dengan payload JSON besar seperti order data |
| Database Utama | MySQL / MongoDB | **PostgreSQL + PostGIS** | PostgreSQL adalah gold standard untuk data relasional. PostGIS extension menambahkan kemampuan query geospasial native (jarak antar koordinat, radius matching) tanpa butuh library eksternal |
| ORM | Sequelize / Mongoose | **Prisma ORM** | Type-safe, auto-generate Typescript types dari schema DB. Developer experience sangat baik dan migrasi database lebih aman dibanding Sequelize |
| Real-time | Socket.io custom server | **Supabase Realtime** | WebSocket built-in, tidak perlu maintain server Socket.io sendiri. Terintegrasi dengan PostgreSQL via Change Data Capture (CDC). Saat row DB berubah, frontend langsung dapat update |
| Job Queue | Cron + setTimeout | **BullMQ + Redis (Upstash)** | Timer 15 detik untuk penerimaan order TIDAK BISA pakai setTimeout biasa (akan hilang saat server restart). BullMQ adalah job queue berbasis Redis yang persisten dan reliable |
| Pembayaran Masuk | Midtrans (standar) | **Midtrans SNAP** | Mendukung semua metode bayar Indonesia: QRIS, Virtual Account, GoPay, OVO, e-wallet dalam satu integrasi SDK |
| Pembayaran Keluar | Manual transfer | **Xendit Disbursement** | API otomatis untuk transfer ke 100+ bank dan e-wallet di Indonesia. Tutor bisa withdraw kapan saja, proses real-time |
| Verifikasi Identitas | Manual review | **Privy.id eKYC API** | Spesialis KYC Indonesia, harga terjangkau (Rp 2.000/verifikasi), mendukung KTP + liveness detection (bukan selfie biasa) |
| Push Notification | OneSignal | **FCM via expo-notifications** | Firebase Cloud Messaging adalah standar industri, gratis, dan terintegrasi mulus dengan Expo. Mendukung background notification untuk SOS dan order baru |
| Maps & Routing | Mapbox / Leaflet | **Google Maps Platform** | Distance Matrix API untuk menghitung jarak & ETA tutor ke siswa. Directions API untuk routing. Data jalan Indonesia paling akurat dan terupdate |
| File Storage | AWS S3 | **Supabase Storage** | Sudah satu ekosistem dengan database Supabase. Gratis hingga 1GB, mudah diintegrasikan dengan RLS (Row Level Security) agar hanya pemilik yang bisa akses file sendiri |
| OTP Verifikasi | Twilio | **Fonnte / Wablas** | WhatsApp OTP jauh lebih familiar di Indonesia daripada SMS. Fonnte harganya Rp 150-250/pesan vs Twilio yang mahal dalam kurs USD |
| Auth Token | Session Cookie | **JWT + Refresh Token** | Stateless, cocok untuk mobile app. Access token berumur pendek (15 menit), refresh token disimpan di database untuk bisa di-revoke |

---

## Arsitektur Sistem (Diagram Level Tinggi)

```
┌─────────────────────────────────────────┐
│          MOBILE CLIENT (Expo RN)        │
│  Student App / Tutor App / Parent App   │
└────────────────┬────────────────────────┘
                 │ HTTPS / WebSocket
┌────────────────▼────────────────────────┐
│            API GATEWAY                  │
│        Fastify (Node.js)                │
│   Autentikasi JWT | Rate Limiting       │
│   Routing ke Services                   │
└──┬───────┬──────────┬────────┬──────────┘
   │       │          │        │
   ▼       ▼          ▼        ▼
┌────┐  ┌──────┐  ┌──────┐  ┌──────────┐
│Auth│  │Order │  │User  │  │Payment   │
│SVC │  │SVC   │  │SVC   │  │SVC       │
└──┬─┘  └──┬───┘  └──┬───┘  └────┬─────┘
   │        │          │           │
   └──────┬─┴──────────┘           │
          ▼                        ▼
┌─────────────────┐      ┌─────────────────┐
│   PostgreSQL    │      │  Midtrans SNAP  │
│   + PostGIS     │      │  Xendit API     │
│   (Primary DB)  │      └─────────────────┘
└────────┬────────┘
         │ CDC
         ▼
┌─────────────────┐      ┌─────────────────┐
│Supabase Realtime│      │  BullMQ + Redis  │
│ (WebSocket Hub) │      │  (Job Queue)     │
│ - GPS tracking  │      │  - 15s timer     │
│ - Order status  │      │  - Escrow timer  │
└─────────────────┘      └─────────────────┘
```

---

## Rancangan Skema Database

### Tabel Inti

#### `users`
```
id              UUID        PRIMARY KEY
role            ENUM        ['student', 'teacher', 'parent']
name            VARCHAR
email           VARCHAR     UNIQUE
phone           VARCHAR     UNIQUE
password_hash   VARCHAR
otp_code        VARCHAR
otp_expires_at  TIMESTAMP
created_at      TIMESTAMP
```

#### `teacher_profiles`
```
id              UUID        PRIMARY KEY (ref users.id)
nik             VARCHAR     UNIQUE
ktp_photo_url   VARCHAR
university      VARCHAR
major           VARCHAR     (Jurusan)
year_enrolled   INTEGER
gpa             DECIMAL     (IPK)
subjects        TEXT[]      (Array: ['Matematika', 'Fisika'])
bio             TEXT
profile_photo   VARCHAR
kyc_status      ENUM        ['pending', 'verified', 'rejected']
onboard_status  ENUM        ['draft', 'review_video', 'interview', 'approved', 'rejected']
video_url       VARCHAR
membership_tier ENUM        ['junior', 'professional']
average_rating  DECIMAL
location        GEOMETRY(POINT, 4326)   -- PostGIS: koordinat real-time
```

#### `parent_children`
```
id              UUID        PRIMARY KEY
parent_id       UUID        (ref users.id)
child_name      VARCHAR
child_grade     VARCHAR     (SD, SMP 7, SMA 11, dsb)
tutorpay_balance BIGINT     (dalam satuan Rupiah)
```

#### `orders`
```
id              UUID        PRIMARY KEY
student_id      UUID        (ref users.id atau parent_children.id)
ordered_by      UUID        (ref users.id — bisa parent)
teacher_id      UUID        (ref users.id)
subject         VARCHAR
level           ENUM        ['SD', 'SMP', 'SMA']
duration_hours  DECIMAL     (1.0 atau 1.5)
sessions_total  INTEGER     (1, 4, 8)
session_number  INTEGER     (sesi ke-berapa dari total)
status          ENUM        ['searching', 'matched', 'on_the_way', 'arrived', 'active', 'done', 'cancelled']
location        GEOMETRY(POINT, 4326)
address_text    VARCHAR
schedule_type   ENUM        ['now', 'scheduled']
scheduled_at    TIMESTAMP
base_price      BIGINT
discount_amount BIGINT
final_price     BIGINT
created_at      TIMESTAMP
```

#### `sessions`
```
id              UUID        PRIMARY KEY
order_id        UUID        (ref orders.id)
started_at      TIMESTAMP
ended_at        TIMESTAMP
geo_confirmed   BOOLEAN     (apakah geo-fence dilalui saat mulai?)
geo_distance_m  INTEGER     (jarak saat tombol mulai ditekan, dalam meter)
```

#### `learning_reports`
```
id              UUID        PRIMARY KEY
session_id      UUID        (ref sessions.id)
teacher_id      UUID
student_id      UUID
summary         TEXT
characters      TEXT[]      (e.g. ['Fokus', 'Aktif Bertanya'])
photo_url       VARCHAR
submitted_at    TIMESTAMP
```

#### `transactions`
```
id              UUID        PRIMARY KEY
order_id        UUID
type            ENUM        ['charge', 'disbursement', 'topup', 'refund', 'platform_fee']
amount          BIGINT
gateway         VARCHAR     ('midtrans', 'xendit', 'internal')
gateway_ref_id  VARCHAR
status          ENUM        ['pending', 'success', 'failed']
created_at      TIMESTAMP
```

#### `reviews`
```
id              UUID        PRIMARY KEY
order_id        UUID
session_id      UUID
reviewer_id     UUID        (student / parent)
teacher_id      UUID
rating          SMALLINT    (1-5)
content         TEXT
tags            TEXT[]
created_at      TIMESTAMP
```

---

## Rancangan API Endpoints (REST)

### Auth Service
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/auth/register` | Daftar akun baru (student/parent) |
| POST | `/auth/teacher/register` | Step 1: Biodata tutor |
| POST | `/auth/teacher/kyc` | Step 2: Submit foto KTP ke Privy.id |
| POST | `/auth/teacher/documents` | Step 3: Upload dokumen |
| POST | `/auth/teacher/video` | Step 4: Upload video perkenalan |
| POST | `/auth/login` | Login, dapat JWT |
| POST | `/auth/otp/send` | Kirim OTP WhatsApp |
| POST | `/auth/otp/verify` | Verifikasi OTP |
| POST | `/auth/refresh` | Refresh JWT token |

### Order Service
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/orders` | Buat order baru |
| GET | `/orders/:id` | Detail order |
| PATCH | `/orders/:id/cancel` | Batalkan order |
| GET | `/orders/active` | Order aktif user saat ini |
| POST | `/orders/:id/accept` | Tutor terima order (15 detik window) |
| POST | `/orders/:id/reject` | Tutor tolak order |
| POST | `/sessions/:id/start` | Mulai sesi (setelah geo-fence valid) |
| POST | `/sessions/:id/end` | Akhiri sesi |
| POST | `/sessions/:id/report` | Submit laporan ajar |
| POST | `/sessions/:id/review` | Submit ulasan dari siswa |

### User & Family Service
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/users/me` | Profil saya |
| PATCH | `/users/me` | Update profil |
| GET | `/teachers` | Daftar tutor tersedia (filter by location, subject) |
| GET | `/teachers/:id` | Detail profil tutor + ulasan |
| POST | `/parent/children` | Tambah profil anak |
| GET | `/parent/children` | Daftar anak saya |
| GET | `/parent/children/:childId/orders` | Histori order anak tertentu |

### Payment Service
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| POST | `/payments/topup` | Buat transaksi top up (Midtrans) |
| POST | `/payments/withdraw` | Request disbursement tutor (Xendit) |
| GET | `/wallet/balance` | Saldo TutorPay saya |
| GET | `/wallet/transactions` | Riwayat transaksi |
| POST | `/webhooks/midtrans` | Webhook dari Midtrans saat bayar |
| POST | `/webhooks/xendit` | Webhook dari Xendit disbursement |

### Real-time Events (WebSocket via Supabase)
| Channel | Event | Payload |
|---------|-------|---------|
| `order:{orderId}` | `status_changed` | Status order baru |
| `teacher:{teacherId}` | `new_order` | Ada order masuk baru (15 detik) |
| `session:{sessionId}` | `teacher_location` | Koordinat GPS tutor terbaru |
| `parent:{parentId}` | `sos_alert` | Kirim data SOS dari anak |

---

## Rencana Deployment & Infrastruktur

### Fase 1 — MVP (Bisa pakai Free Tier saat lomba)

| Komponen | Platform | Biaya Estimasi |
|----------|----------|----------------|
| Backend API | **Railway.app** / Render.com | Gratis s.d. $5/bln |
| Database | **Supabase** (PostgreSQL) | Gratis s.d. 500MB |
| Redis | **Upstash** | Gratis 10.000 command/hari |
| File Storage | **Supabase Storage** | Gratis s.d. 1GB |
| Domain | Freenom / Namecheap | Rp 0 - Rp 100rb/thn |

### Fase 2 — Peluncuran Komersial

| Komponen | Platform | Biaya |
|----------|----------|-------|
| Backend + Queue | VPS **Vultr / DigitalOcean** 4 CPU | ~$48/bln |
| Database | Supabase Pro / self-hosted PostgreSQL | $25/bln |
| Redis | Upstash Pro (500rb command) | $10/bln |
| CDN & File | Cloudflare R2 | $0.015/GB |
| Monitoring | **Sentry** (error tracking) + **BetterUptime** | Gratis - $20/bln |

---

## Security Checklist

- [ ] **JWT dengan expiry pendek** (access token 15 menit)
- [ ] **Refresh token rotation** (token lama invalid setelah refresh)
- [ ] **Rate limiting** di semua endpoint publik (max 10 request/detik per IP)
- [ ] **Input validation** menggunakan Zod schema di setiap endpoint
- [ ] **SQL injection prevention** via Prisma (sudah parameterized secara default)
- [ ] **File upload validation** MIME type + max size (10MB foto, 50MB video)
- [ ] **Row Level Security (RLS)** di Supabase agar data user tidak cross-access
- [ ] **Webhook signature verification** untuk Midtrans dan Xendit
- [ ] **Enkripsi NIK** — data sensitif seperti NIK di-hash atau encrypt at rest
- [ ] **HTTPS only** di semua environment

---

## Strategi Komisi & Monetisasi (Implementasi di Backend)

### Perhitungan Otomatis saat Release Escrow

```
Saat sesi selesai dan laporan disubmit:

1. Final Price = Base Price x Duration x Sessions - Discounts
2. Platform Commission = Final Price x 12-15%
3. Teacher Payout = Final Price - Platform Commission
4. Platform Revenue = Commission + Top Up Fee (Rp 2.000) + Withdraw Fee (Rp 2.500/pencairan)
```

### TutorPass / TutorBoost (Subscription)

Tabel `subscriptions` menyimpan paket aktif user. Middleware API akan membaca tabel ini sebelum melakukan matching untuk menentukan:
- Apakah siswa dapat akses *priority matching* (TutorPass Plus)
- Apakah tutor dapat *visibility boost* dalam hasil pencarian (TutorBoost Pro)

---

## Estimasi Proyeksi Pendapatan

| Skenario | Sesi/Hari | Komisi Rata-rata | Pendapatan/Hari | Pendapatan/Bulan |
|----------|-----------|-----------------|-----------------|------------------|
| Early Adopter | 50 | Rp 9.000 - 12.000 | Rp 450rb - 600rb | **Rp 13,5 jt - 18 jt** |
| Growth Stage | 500 | Rp 10.000 | Rp 5 jt | **Rp 150 jt** |
| Scale Stage | 5.000 | Rp 10.000 | Rp 50 jt | **Rp 1,5 M** |

*Belum termasuk pendapatan pasif TutorPay (top up fee, withdraw fee) dan revenue langganan membership.*
