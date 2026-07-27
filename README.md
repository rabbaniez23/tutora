# 📚 Tutora App — Product Requirements Document (PRD)

> **Versi:** 1.0.0  
> **Tanggal:** Juli 2026  
> **Platform:** React Native (Expo) — Android, iOS, Web & Node.js Backend  
> **Status:** In Development (MVP Frontend & Backend Selesai)

---

## 📌 Daftar Isi

1. [Ringkasan Produk](#1-ringkasan-produk)
2. [Tujuan & Sasaran](#2-tujuan--sasaran)
3. [Pengguna Target (User Personas)](#3-pengguna-target-user-personas)
4. [Arsitektur & Tech Stack](#4-arsitektur--tech-stack)
5. [Struktur Proyek](#5-struktur-proyek)
6. [Desain & Branding](#6-desain--branding)
7. [Fitur Modul: Autentikasi](#7-fitur-modul-autentikasi)
8. [Fitur Modul: Siswa (Customer)](#8-fitur-modul-siswa-customer)
9. [Fitur Modul: Tutor (Teacher)](#9-fitur-modul-tutor-teacher)
10. [Alur Pemesanan (Order Flow)](#10-alur-pemesanan-order-flow)
11. [State Management](#11-state-management)
12. [Komponen Reusable](#12-komponen-reusable)
13. [Navigasi & Routing](#13-navigasi--routing)
14. [Fitur Belum Diimplementasi (Backlog)](#14-fitur-belum-diimplementasi-backlog)
15. [Ketergantungan & Library](#15-ketergantungan--library)

---

## 1. Ringkasan Produk

**Tutora** adalah aplikasi mobile platform marketplace untuk menghubungkan **siswa** yang butuh bimbingan belajar dengan **tutor** (guru les) yang tersedia di sekitar lokasi mereka. Model bisnis mirip seperti ojek online (on-demand), di mana siswa dapat memesan tutor yang datang ke rumah kapan pun dibutuhkan.

### Nilai Utama:
- 🔍 **Temukan tutor terdekat** secara real-time dengan fitur radar berbasis lokasi
- 📱 **Pesan kapan saja** — fleksibel tanpa jadwal tetap
- 🎓 **Berbagai mata pelajaran** — Matematika, Fisika, Kimia, Biologi, Bahasa Inggris, dll.
- 💳 **Pembayaran digital** — melalui dompet digital bawaan "TutorPay"
- ⭐ **Sistem ulasan transparan** — bantu siswa memilih tutor terbaik

---

## 2. Tujuan & Sasaran

| Tujuan | Metrik Sukses |
|--------|---------------|
| Siswa bisa memesan tutor dalam < 5 menit | Time-to-book < 5 menit |
| Tutor bisa menerima job dari HP mereka | Acceptance rate > 70% |
| Transparansi penilaian tutor | Rating tersedia di profil tutor |
| Pembayaran aman & mudah | Zero-friction payment flow |
| Cross-platform (Android, iOS, Web) | Build berhasil pada 3 platform |

---

## 3. Pengguna Target (User Personas)

### 👩‍🎓 Persona 1: Siswa (Customer)
- **Nama Contoh:** Delia Puspitasari
- **Umur:** 15–22 tahun (SMP, SMA, Mahasiswa)
- **Kebutuhan:** Bimbingan belajar menjelang ujian, persiapan UN, remedial mata pelajaran tertentu
- **Pain Point:** Sulit menemukan guru les berkualitas yang tersedia saat dibutuhkan
- **Goal:** Pesan tutor dengan cepat, bayar mudah, dan mendapatkan tutor yang recommended

### 👨‍🏫 Persona 2: Tutor (Teacher)
- **Nama Contoh:** Budi Santoso, S.Pd
- **Umur:** 20–35 tahun (Mahasiswa, fresh graduate, guru profesional)
- **Kebutuhan:** Sumber penghasilan tambahan yang fleksibel sesuai waktu luang
- **Pain Point:** Tidak ada platform yang memudahkan mencari murid secara digital
- **Goal:** Terima job mengajar, kelola jadwal, dan tingkatkan reputasi melalui ulasan

---

## 4. Arsitektur & Tech Stack

```text
┌─────────────────────────────────────────────────────────────┐
│                       Sistem Tutora                         │
│                                                             │
│  ┌──────────────────────┐         ┌──────────────────────┐  │
│  │    Frontend App      │         │     Backend API      │  │
│  │ (React Native/Expo)  │ ◄─────► │  (Node.js/Fastify)   │  │
│  └──────────────────────┘  REST   └─────────┬────────────┘  │
│                                             │               │
│                                     ┌───────▼────────┐      │
│                                     │  PostgreSQL &  │      │
│                                     │     Redis      │      │
│                                     └────────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Stack Detail

| Teknologi | Versi | Kegunaan |
|-----------|-------|----------|
| **Expo** | ~54.0.33 | Framework utama cross-platform (Frontend) |
| **React Native** | 0.81.5 | Core UI framework |
| **Zustand** | ^5.0.12 | State management |
| **Fastify** | ^5.10.0 | Web framework backend berkinerja tinggi |
| **Prisma** | ^6.19.3 | ORM database backend |
| **PostgreSQL** | v16 | Database relasional utama |
| **Redis** | v7 | Caching & matching engine |
| **Vitest** | ^4.1.10 | Testing framework backend |
| **react-native-maps** | 1.20.1 | Komponen peta interaktif |
| **lucide-react-native** | ^0.577.0 | Icon library |
| **expo-linear-gradient** | ~15.0.8 | Efek gradien |
| **expo-blur** | ~15.0.8 | Efek blur/glassmorphism |
| **react-native-svg** | ^15.12.1 | Dukungan SVG |
| **react-native-web** | ^0.21.0 | Dukungan platform Web |

---

## 5. Struktur Proyek

```
tutora/
├── backend/                      # Backend API (Node.js/Fastify)
│   ├── src/
│   │   ├── modules/              # Modul fitur (auth, order, teacher, dll)
│   │   ├── config/               # Konfigurasi database & redis
│   │   ├── shared/               # Middleware & utils
│   │   └── __tests__/            # Unit & Integration tests
│   ├── prisma/                   # Schema database & migrations
│   └── package.json
│
├── frontend/                     # Frontend App (React Native/Expo)
│   ├── app/                      # Semua halaman (Expo Router)
│   │   ├── (auth)/               # Grup routing Autentikasi
│   │   ├── (customer)/           # Grup routing Siswa
│   │   └── (teacher)/            # Grup routing Tutor
│   ├── src/
│   │   ├── components/           # UI Components
│   │   ├── constants/            # Design tokens
│   │   └── store/                # Zustand stores
│   ├── assets/                   # Gambar & asset statis
│   ├── app.json                  # Konfigurasi Expo
│   └── package.json
└── README.md
```

---

## 6. Desain & Branding

### Palet Warna

| Token | Hex | Penggunaan |
|-------|-----|------------|
| `primary` | `#1f4e8c` | Warna biru utama (tombol, header, aksen) |
| `primaryDark` | `#133560` | Variasi gelap primary |
| `secondary` | `#2E8B57` | Warna hijau (CTA, status sukses) |
| `background` | `#FFFFFF` | Background halaman |
| `surface` | `#F4E9DB` | Background kartu (krem) |
| `surfaceLight` | `#FAFAFA` | Background ringan |
| `text` | `#1C1C1C` | Teks utama |
| `textMuted` | `#727272` | Teks sekunder/placeholder |
| `border` | `#E8E8E8` | Garis batas elemen |
| `orange` | `#F06400` | Voucher, badge promo |
| `purple` | `#93328E` | Mata pelajaran bahasa asing |

### Prinsip Desain

- **Glassmorphism** — Digunakan pada welcome screen (feature cards dengan `rgba` dan `borderColor` transparan)
- **Floating Cards** — Wallet card dan bottom sheet melakukan overlap dengan elemen di atasnya
- **Rounded Corners** — Border radius besar (16–32px) untuk tampilan modern dan soft
- **Animated Onboarding** — Spring & stagger animation pada welcome screen untuk kesan premium
- **Radar Animation** — Efek pulse lingkaran pada halaman `searching.tsx`
- **Bottom Sheet Pattern** — Informasi konfirmasi muncul dari bawah layar (map + bottom sheet)

---

## 7. Fitur Modul: Autentikasi

### 7.1 Welcome Screen (`/auth/welcome`)

**Fitur:**
- Background image fullscreen dengan dark overlay
- Animasi bertahap: logo spring-in → teks slide-up → feature cards stagger pop → tombol fade-in
- 3 Feature Cards glassmorphism: Tutor Pilihan, Waktu Fleksibel, Materi Lengkap
- Navigasi ke halaman Register atau Login

**Animasi:**
```
Logo: scale (0.3 → 1) + opacity (0 → 1) | spring
Teks: translateY (50 → 0) + opacity | timing 800ms
Cards: stagger 150ms | spring friction 5
Button: opacity (0 → 1) | timing 400ms
```

### 7.2 Login Screen (`/auth/login`)

**Fitur:**
- Hero image illustrasi belajar
- Input email/nomor HP dengan icon
- Input password dengan toggle show/hide
- **Role Selector** — Siswa atau Tutor (menentukan routing setelah login)
- Social login placeholder (Google, Facebook)
- Navigasi ke halaman Register

**Logika Login (Mock):**
```typescript
if (role === 'customer') → router.replace('/(customer)/(tabs)')
if (role === 'teacher')  → router.replace('/(teacher)/(tabs)')
```

### 7.3 Register Screen (`/auth/register`)

**Fitur:**
- Form registrasi nama, email, password, konfirmasi password
- Role selector (Siswa / Tutor)
- Validasi form client-side
- Navigasi ke Login

---

## 8. Fitur Modul: Siswa (Customer)

### 8.1 Beranda / Home (`/customer/(tabs)/index`)

**Fitur:**
- **Header biru** dengan avatar, greeting personal, tombol notifikasi & chat
- **Floating Wallet Card** — menampilkan saldo TutorPay (Rp 250.000), tombol Top Up & Riwayat. Card melakukan overlap dengan header biru
- **CTA Banner hijau** "Butuh Guru Segera?" dengan tombol langsung menuju pemesanan
- **Grid Mata Pelajaran** 4×2 — Matematika, Fisika, Biologi, English, Sejarah, Indo, Seni, Lainnya. Setiap item bisa diklik untuk memulai order
- **Promo Section** — horizontal scroll cards promo spesial

### 8.2 Aktivitas (`/customer/(tabs)/activity`)
- Riwayat semua sesi les yang sudah diselesaikan
- Informasi nama tutor, mata pelajaran, waktu, dan harga

### 8.3 Chat (`/customer/(tabs)/chat`)
- Daftar percakapan aktif dengan tutor
- Navigasi ke ruang chat 1-on-1 (`/customer/chat/room`)

### 8.4 Promo (`/customer/(tabs)/promo`)
- Daftar semua promo dan voucher yang tersedia
- Filter promo berdasarkan kategori

### 8.5 Profil Siswa (`/customer/(tabs)/profile`)
- Tampilan profil dengan avatar, nama, dan statistik
- Menu: Edit Profil, Pengaturan, Bantuan, Keluar
- Navigasi ke sub-halaman:
  - `/customer/profile/edit` — Form edit nama, foto, bio
  - `/customer/profile/settings` — Pengaturan notifikasi, bahasa, privasi
  - `/customer/profile/help` — FAQ dan kontak support

### 8.6 Notifikasi (`/customer/notifications`)
- Daftar semua notifikasi sistem
- Notifikasi pemesanan, pembayaran, promo

### 8.7 Profil Tutor (`/customer/teacher/[id]`)
- Foto cover + avatar tutor
- Nama, gelar, dan deskripsi profesi
- 3 Statistik: Rating (4.9/5 | 240 ulasan), Sesi Mengajar (350+), Jarak (5km)
- **Tentang Saya** — bio tutor
- **Pendidikan** — informasi gelar dan universitas
- **Review Terbaru** — daftar ulasan dari Zustand store (real-time setelah siswa mengulas)
- **Sticky Footer** — harga per sesi + tombol "Pesan Ajaran"

### 8.8 Ruang Chat (`/customer/chat/room`)
- Interface chat 1-on-1 antara siswa dan tutor
- Input pesan dan tombol kirim

### 8.9 Pembayaran (`/customer/payment/index`)
- Ringkasan biaya sesi
- Pilihan metode pembayaran (TutorPay, dll.)

---

## 9. Fitur Modul: Tutor (Teacher)

### 9.1 Dashboard Tutor (`/teacher/(tabs)/index`)

**Fitur:**
- **Header** dengan avatar, nama app "Tutura", badge "TUTOR PARTNER", dan tombol notifikasi
- **Online Toggle Card** — Switch ON/OFF untuk mengontrol visibilitas kepada siswa
  - Online: "Terlihat oleh murid di sekitarmu"
  - Offline: "Tidak terlihat oleh murid saat ini"
- **Ringkasan Hari Ini:**
  - Pendapatan hari ini (Rp 250.000, +12% dari kemarin)
  - Sesi selesai (6 selesai, 2 akan datang)
- **Peta Permintaan** — Blurred map image dengan badge "Zona Permintaan Tinggi" untuk menunjukkan area dengan banyak permintaan siswa
- **Daftar Sesi Selesai Terbaru** — Nama materi, siswa, penghasilan, waktu

### 9.2 Riwayat Mengajar (`/teacher/(tabs)/history`)
- Semua sesi mengajar yang telah selesai
- Filter berdasarkan tanggal / mata pelajaran

### 9.3 Penghasilan (`/teacher/(tabs)/earnings`)
- Laporan penghasilan harian/mingguan/bulanan
- Grafik penghasilan

### 9.4 Profil Tutor (Self) (`/teacher/(tabs)/profile`)
- Lihat dan edit profil diri sendiri sebagai tutor
- Navigasi ke: `/teacher/profile/reviews` — semua ulasan yang diterima

### 9.5 Pesanan Masuk (`/teacher/job/incoming`)

**Fitur kritis — Time-sensitive:**
- Modal bottom-sheet muncul saat ada pesanan baru
- **Progress Bar Timer 15 Detik** — animasi bar menyusut dari kanan ke kiri
- Detail pesanan: mata pelajaran, jarak, lokasi, harga (Rp 150.000)
- **Tombol "Abaikan"** — tolak pesanan + kembali ke dashboard
- **Tombol "Terima (2km)"** — setuju + navigasi ke halaman job aktif
- Auto-reject setelah 15 detik jika tidak direspons

### 9.6 Job Aktif (`/teacher/job/active`)
- Detail sesi yang sedang berlangsung
- Informasi siswa dan lokasi
- Navigasi menuju rumah siswa

### 9.7 Penarikan Dana (`/teacher/payment/withdraw`)
- Form penarikan saldo ke rekening bank / e-wallet

---

## 10. Alur Pemesanan (Order Flow)

Berikut adalah alur lengkap pemesanan dari sisi siswa:

```
[Beranda] 
    │
    ▼ (Klik "Pesan Guru" / Pilih Mata Pelajaran)
[1. Pilih Lokasi] ← app/order/location.tsx
    │   • Peta interaktif (react-native-maps)
    │   • Pencarian kota (mock: Bandung, Surabaya, Yogyakarta, Bali, Jakarta)
    │   • Konfirmasi alamat di bottom sheet
    │
    ▼ (Konfirmasi Lokasi)
[2. Pilih Mata Pelajaran] ← app/order/subject.tsx
    │   • Pilih tingkat (SD / SMP / SMA)
    │   • Pilih mata pelajaran (Matematika, Fisika, Kimia, dll.)
    │   • Gunakan promo / voucher (modal bottom-sheet)
    │   • Estimasi harga + diskon promo
    │
    ▼ (Cari Tutor Sekarang)
[3. Mencari Tutor] ← app/order/searching.tsx
    │   • Animasi radar pulse (lingkaran menyebar)
    │   • Auto-navigate ke Tracking setelah 4 detik (mock)
    │   • Radius pencarian 5km
    │
    ▼ (Tutor ditemukan — auto navigate)
[4. Tracking Tutor] ← app/order/tracking.tsx
    │   • Peta dengan 2 marker (Siswa & Tutor)
    │   • Polyline menunjukkan rute tutor
    │   • Estimasi tiba: 5 Menit
    │   • Kartu profil tutor + aksi Chat & Telepon
    │
    ▼ (Tutor Telah Tiba)
[5. Sesi Belajar] ← app/order/session.tsx
    │   • Timer 1 jam countdown (HH:MM:SS) real-time
    │   • Info tutor dan mata pelajaran
    │   • Safety box — pusat keamanan aktif
    │   • Konfirmasi akhiri sesi via Alert dialog
    │
    ▼ (Akhiri Kelas)
[6. Ulasan & Pembayaran] ← app/order/review.tsx
    │   • Ringkasan pembayaran (Rp 150.000 via TutorPay)
    │   • Rating bintang 1–5
    │   • Tag penilaian: Sabar, Jelas, Tepat Waktu, Ramah, Seru
    │   • Kotak komentar bebas
    │
    ▼ (Kirim Ulasan)
[Profil Tutor] ← app/teacher/[id].tsx
    • Ulasan baru langsung muncul (via Zustand store)
```

---

## 11. State Management

Menggunakan **Zustand** sebagai state manager ringan.

### 11.1 `useAuthStore`
```typescript
// src/store/useAuthStore.ts
interface AuthState {
  role: 'customer' | 'teacher' | null;
  isLoggedIn: boolean;
  login: (role: 'customer' | 'teacher') => void;
  logout: () => void;
}
```
**Digunakan di:**
- `login.tsx` — memanggil `login(role)` untuk autentikasi
- Komponen yang butuh info peran pengguna saat ini

### 11.2 `useReviewStore`
```typescript
// src/store/useReviewStore.ts
interface Review {
  id: string;
  teacherId: string;
  author: string;
  rating: number;
  content: string;
  tags: string[];
}

interface ReviewState {
  reviews: Review[];
  addReview: (review: Review) => void;
}
```
**Digunakan di:**
- `review.tsx` — `addReview()` setelah submit formulir
- `teacher/[id].tsx` — membaca reviews spesifik tutor via `teacherId`

---

## 12. Komponen Reusable

### 12.1 `Button` (`src/components/ui/Button.tsx`)
Tombol dengan dua varian:
- `variant="default"` — tombol solid biru primer
- `variant="outline"` — tombol dengan border, background transparan

**Props:**
```typescript
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'default' | 'outline';
  style?: ViewStyle;
  disabled?: boolean;
}
```

### 12.2 `Input` (`src/components/ui/Input.tsx`)
Input teks dengan label opsional:

**Props:**
```typescript
interface InputProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: TextStyle;
}
```

### 12.3 `MapComponent` (Platform-aware)
Abstraksi Map yang menangani perbedaan platform:
- **Mobile** (`MapComponent.tsx`) — Re-export dari `react-native-maps`
- **Web** (`MapComponent.web.tsx`) — Implementasi map alternatif berbasis iframe/div untuk browser

**Ekspor tersedia:**
```typescript
export { MapView, Marker, Polyline } from './MapComponent'
```

---

## 13. Navigasi & Routing

Menggunakan **Expo Router v6** dengan pendekatan file-based routing.

### Struktur Grup Routing

```
/ (root)
├── (auth)         → Stack: welcome → login / register
├── (customer)     → Stack dengan nested tabs
│   └── (tabs)     → Bottom Tab: Home, Activity, Chat, Promo, Profile
└── (teacher)      → Stack dengan nested tabs
    └── (tabs)     → Bottom Tab: Dashboard, History, Earnings, Profile
```

### Tab Bar Siswa (Customer)
| Tab | Icon | Route |
|-----|------|-------|
| Beranda | `Home` | `/(customer)/(tabs)/` |
| Aktivitas | `ClipboardList` | `/(customer)/(tabs)/activity` |
| Chat | `MessageCircle` | `/(customer)/(tabs)/chat` |
| Promo | `Tag` | `/(customer)/(tabs)/promo` |
| Profil | `User` | `/(customer)/(tabs)/profile` |

### Tab Bar Tutor (Teacher)
| Tab | Icon | Route |
|-----|------|-------|
| Dashboard | `LayoutDashboard` | `/(teacher)/(tabs)/` |
| Riwayat | `History` | `/(teacher)/(tabs)/history` |
| Penghasilan | `Wallet` | `/(teacher)/(tabs)/earnings` |
| Profil | `User` | `/(teacher)/(tabs)/profile` |

---

## 14. Fitur Belum Diimplementasi (Backlog Frontend)

Sebagian besar logika *core backend* (REST API, Database, Matching Engine, Payment) **sudah selesai dibangun**. Namun, integrasi sisi *frontend* (React Native) ke API tersebut masih perlu diimplementasikan:

### 🔴 Prioritas Tinggi

| Fitur | Keterangan |
|-------|------------|
| **Integrasi API Backend** | Menghubungkan semua halaman *frontend* (yang saat ini memakai mock data) ke *endpoint* REST API `Node.js` yang sudah jadi. |
| **Integrasi Auth** | Mengganti simulasi login/register *frontend* dengan token JWT sesungguhnya dari backend. |
| **Map Tracking & Geolocation** | Menghubungkan koordinat API `Order` dengan `expo-location` secara dinamis. |
| **Push Notifications** | Menerima payload Webhook/FCM dari backend dan menampilkan *alert/bottom-sheet* pesanan di UI. |

### 🟡 Prioritas Menengah

| Fitur | Keterangan |
|-------|------------|
| **Pencarian Tutor** | Belum ada fungsi filter tutor berdasarkan pelajaran, rating, harga |
| **Chat Real-time** | UI chat sudah ada, tapi belum ada WebSocket/Firebase Realtime DB |
| **Upload Dokumen Tutor** | Verifikasi tutor (sertifikat, KTP) belum ada |
| **Geolocation** | `expo-location` belum diintegrasikan untuk deteksi lokasi otomatis |
| **In-App Rating Filter** | Siswa belum bisa filter tutor berdasarkan rating |
| **History Lengkap** | Halaman aktivitas dan riwayat masih dengan data dummy |

### 🟢 Prioritas Rendah / Nice-to-have

| Fitur | Keterangan |
|-------|------------|
| **Dark Mode** | Belum ada theme toggler |
| **Multi-Language** | Semua teks dalam Bahasa Indonesia, belum ada i18n |
| **Referal System** | UI promo ada tapi sistem referral belum dibangun |
| **Report / Keluhan** | Belum ada mekanisme pelaporan perilaku tutor |
| **Gamifikasi** | Level, badge, atau pencapaian untuk siswa aktif |

---

## 15. Ketergantungan & Library

### Dependencies Produksi

```json
{
  "@react-native-masked-view/masked-view": "0.3.2",
  "expo": "~54.0.33",
  "expo-blur": "~15.0.8",
  "expo-constants": "~18.0.13",
  "expo-linear-gradient": "~15.0.8",
  "expo-linking": "~8.0.11",
  "expo-router": "~6.0.23",
  "expo-status-bar": "~3.0.9",
  "lucide-react-native": "^0.577.0",
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "react-native": "0.81.5",
  "react-native-maps": "1.20.1",
  "react-native-safe-area-context": "~5.6.0",
  "react-native-screens": "~4.16.0",
  "react-native-svg": "^15.12.1",
  "react-native-web": "^0.21.0",
  "zustand": "^5.0.12"
}
```

### Dev Dependencies

```json
{
  "@types/react": "~19.1.10",
  "typescript": "~5.9.2"
}
```

### Script Menjalankan Proyek

```bash
# Instalasi dependensi
npm install

# Jalankan di Android
npm run android

# Jalankan di iOS
npm run ios

# Jalankan di Web
npm run web

# Expo development server
npm start
```

---

## 📝 Catatan Pengembang

### Konvensi Penamaan
- Semua halaman menggunakan **PascalCase** sebagai nama function export default
- Semua style menggunakan **camelCase** di dalam `StyleSheet.create({})`
- Warna selalu menggunakan token dari `@/src/constants/Colors` — tidak boleh hardcode hex langsung

### Platform Compatibility
- **MapComponent** menggunakan sistem resolusi platform Expo (`.web.tsx` untuk browser)
- **SafeAreaView** diimport dari `react-native-safe-area-context`, bukan `react-native`
- **Platform.OS check** digunakan di header untuk handle iOS/Android padding difference

### Path Alias
Gunakan `@/` sebagai alias untuk root project (dikonfigurasi di `tsconfig.json`):
```typescript
import Colors from '@/src/constants/Colors';
import Button from '@/src/components/ui/Button';
```

---

*Dokumen ini dibuat berdasarkan analisis kode sumber yang ada pada tanggal Juli 2026. Perbarui dokumen ini setiap kali ada penambahan fitur baru.*
