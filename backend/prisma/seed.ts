import { PrismaClient, Role, KycStatus, OnboardStatus, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Clearing database...');
  await prisma.message.deleteMany();
  await prisma.chatRoomMember.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.sosAlert.deleteMany();
  await prisma.learningReport.deleteMany();
  await prisma.review.deleteMany();
  await prisma.session.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.order.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.fcmToken.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.parentChild.deleteMany();
  await prisma.teacherAvailability.deleteMany();
  await prisma.teacherProfile.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash('Password123!', 10);

  console.log('🌱 Seeding data...');

  // ═══════════════════════════════════════════════════════════════════
  // ADMIN
  // ═══════════════════════════════════════════════════════════════════
  const admin = await prisma.user.create({
    data: {
      role: Role.ADMIN, name: 'Admin Tutora', email: 'admin@tutora.id',
      phone: '08110000001', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 0 } },
    },
  });

  // ═══════════════════════════════════════════════════════════════════
  // 10 STUDENTS (anak-anak yang punya akun sendiri — batch 1)
  // ═══════════════════════════════════════════════════════════════════
  const delia = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Delia Puspitasari', email: 'delia@gmail.com',
      phone: '081234567001', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 250000 } },
    },
  });
  const rizky = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Rizky Firmansyah', email: 'rizky.f@gmail.com',
      phone: '081234567002', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 300000 } },
    },
  });
  const anisa = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Anisa Rahmawati', email: 'anisa.r@gmail.com',
      phone: '081234567003', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 150000 } },
    },
  });
  const farhan = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Farhan Dwi Cahyo', email: 'farhan.dc@gmail.com',
      phone: '081234567004', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 500000 } },
    },
  });
  const siti = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Siti Nurhaliza', email: 'siti.nur@gmail.com',
      phone: '081234567005', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 200000 } },
    },
  });
  const aldi = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Aldi Pratama', email: 'aldi.p@gmail.com',
      phone: '081234567006', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 350000 } },
    },
  });
  const nabila = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Nabila Azzahra', email: 'nabila.az@gmail.com',
      phone: '081234567007', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 100000 } },
    },
  });
  const bayu = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Bayu Aditya', email: 'bayu.adit@gmail.com',
      phone: '081234567008', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 400000 } },
    },
  });
  const putri = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Putri Wulandari', email: 'putri.w@gmail.com',
      phone: '081234567009', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 275000 } },
    },
  });
  const kevin = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Kevin Saputra', email: 'kevin.s@gmail.com',
      phone: '081234567010', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 180000 } },
    },
  });

  // ═══════════════════════════════════════════════════════════════════
  // 7 EXTRA STUDENTS (batch 2 — supaya total 20)
  // ═══════════════════════════════════════════════════════════════════
  // Angga = anak ke-2 Pak Hendra
  const angga = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Angga Firmansyah', email: 'angga.f@gmail.com',
      phone: '081234567011', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 50000 } },
    },
  });
  // Gita & Dwi = anak ke-3 & ke-4 Pak Agus (supaya Pak Agus punya 4 anak)
  const gita = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Gita Putri Ramadhani', email: 'gita.p@gmail.com',
      phone: '081234567012', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 75000 } },
    },
  });
  const dwi = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Dwi Saputra Ramadhan', email: 'dwi.s@gmail.com',
      phone: '081234567013', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 120000 } },
    },
  });
  // Lestari = anak ke-2 Bu Megawati
  const lestari = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Lestari Putri Handayani', email: 'lestari.p@gmail.com',
      phone: '081234567014', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 90000 } },
    },
  });
  // Raka = anak ke-2 Bu Dewi Lestari
  const raka = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Raka Aditya Wicaksono', email: 'raka.a@gmail.com',
      phone: '081234567015', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 60000 } },
    },
  });
  // Salsa = anak ke-2 Bu Ningsih
  const salsa = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Salsa Nurhaliza', email: 'salsa.n@gmail.com',
      phone: '081234567016', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 80000 } },
    },
  });
  // Rangga, Citra = anak Pak Surya
  const rangga = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Rangga Darma', email: 'rangga.d@gmail.com',
      phone: '081234567017', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 0 } },
    },
  });
  const citra = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Citra Darma', email: 'citra.d@gmail.com',
      phone: '081234567018', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 0 } },
    },
  });
  // Fajar, Yoga = anak Bu Sri Ningsih
  const fajar = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Fajar Nugroho', email: 'fajar.n@gmail.com',
      phone: '081234567019', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 0 } },
    },
  });
  const yoga = await prisma.user.create({
    data: {
      role: Role.STUDENT, name: 'Yoga Permadi', email: 'yoga.p@gmail.com',
      phone: '081234567020', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 40000 } },
    },
  });

  // ═══════════════════════════════════════════════════════════════════
  // 10 PARENTS — masing-masing terhubung ke anak (student) via childUserId
  // Total: 20 parentChild records
  // ═══════════════════════════════════════════════════════════════════
  // Pak Hendra = ayah Delia & Angga (2 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Hendra Puspito', email: 'hendra.puspito@gmail.com',
      phone: '081298760001', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 1000000 } },
      parentChildren: { create: [
        { childUserId: delia.id, childGrade: 'SMA 11' },
        { childUserId: angga.id, childGrade: 'SMP 7' },
      ]},
    },
  });
  // Bu Ratna = ibu Rizky (1 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Ratna Sari Dewi', email: 'ratna.dewi@gmail.com',
      phone: '081298760002', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 750000 } },
      parentChildren: { create: [
        { childUserId: rizky.id, childGrade: 'SMA 10' },
      ]},
    },
  });
  // Pak Agus = ayah Anisa, Farhan, Gita, Dwi (4 anak — test case!)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Agus Cahyono', email: 'agus.cahyono@gmail.com',
      phone: '081298760003', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 1200000 } },
      parentChildren: { create: [
        { childUserId: anisa.id, childGrade: 'SMP 9' },
        { childUserId: farhan.id, childGrade: 'SMA 12' },
        { childUserId: gita.id, childGrade: 'SMP 7' },
        { childUserId: dwi.id, childGrade: 'SD 4' },
      ]},
    },
  });
  // Bu Megawati = ibu Siti & Lestari (2 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Megawati Handayani', email: 'mega.handa@gmail.com',
      phone: '081298760004', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 600000 } },
      parentChildren: { create: [
        { childUserId: siti.id, childGrade: 'SMP 8' },
        { childUserId: lestari.id, childGrade: 'SD 6' },
      ]},
    },
  });
  // Pak Bambang = ayah Aldi & Nabila (2 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Bambang Suryanto', email: 'bambang.s@gmail.com',
      phone: '081298760005', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 900000 } },
      parentChildren: { create: [
        { childUserId: aldi.id, childGrade: 'SMA 11' },
        { childUserId: nabila.id, childGrade: 'SMP 7' },
      ]},
    },
  });
  // Bu Dewi Lestari = ibu Bayu & Raka (2 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Dewi Lestari', email: 'dewi.les@gmail.com',
      phone: '081298760006', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 800000 } },
      parentChildren: { create: [
        { childUserId: bayu.id, childGrade: 'SMA 10' },
        { childUserId: raka.id, childGrade: 'SMP 8' },
      ]},
    },
  });
  // Bu Ningsih = ibu Putri & Salsa (2 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Ningsih Sulastri', email: 'ningsih.s@gmail.com',
      phone: '081298760007', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 500000 } },
      parentChildren: { create: [
        { childUserId: putri.id, childGrade: 'SMA 12' },
        { childUserId: salsa.id, childGrade: 'SD 5' },
      ]},
    },
  });
  // Bu Dewi Kartika = ibu Kevin (1 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Dewi Kartika', email: 'dewi.k@gmail.com',
      phone: '081298760008', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 650000 } },
      parentChildren: { create: [
        { childUserId: kevin.id, childGrade: 'SD 6' },
      ]},
    },
  });
  // Pak Surya = ayah Rangga & Citra (2 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Surya Darma', email: 'surya.darma@gmail.com',
      phone: '081298760009', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 1500000 } },
      parentChildren: { create: [
        { childUserId: rangga.id, childGrade: 'SMP 8' },
        { childUserId: citra.id, childGrade: 'SD 5' },
      ]},
    },
  });
  // Bu Sri Ningsih = ibu Fajar & Yoga (2 anak)
  await prisma.user.create({
    data: {
      role: Role.PARENT, name: 'Sri Ningsih', email: 'sri.ningsih@gmail.com',
      phone: '081298760010', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 450000 } },
      parentChildren: { create: [
        { childUserId: fajar.id, childGrade: 'SMA 10' },
        { childUserId: yoga.id, childGrade: 'SMP 9' },
      ]},
    },
  });

  // ═══════════════════════════════════════════════════════════════════
  // 10 TEACHERS — semua sudah APPROVED dan online, lokasi Jakarta
  // ═══════════════════════════════════════════════════════════════════
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Budi Santoso, S.Pd', email: 'budi.santoso@gmail.com',
      phone: '081377700001', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 750000 } },
      teacherProfile: { create: {
        nik: '3201010101010001', ktpPhotoUrl: 'https://storage.tutora.id/ktp/budi.jpg',
        university: 'Universitas Pendidikan Indonesia', major: 'Pendidikan Matematika',
        yearEnrolled: 2019, gpa: 3.85, subjects: ['Matematika', 'Fisika'],
        bio: 'Pengajar berpengalaman 5 tahun, spesialis Olimpiade Matematika SMA.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.9, totalReviews: 127, totalSessions: 342,
        latitude: -6.2088, longitude: 106.8456,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Rina Marlina, S.Si', email: 'rina.marlina@gmail.com',
      phone: '081377700002', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 420000 } },
      teacherProfile: { create: {
        nik: '3201010101010002', ktpPhotoUrl: 'https://storage.tutora.id/ktp/rina.jpg',
        university: 'Institut Teknologi Bandung', major: 'Kimia',
        yearEnrolled: 2020, gpa: 3.72, subjects: ['Kimia', 'Biologi'],
        bio: 'Lulusan ITB, mengajar Kimia dan Biologi dengan pendekatan eksperimen seru.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.8, totalReviews: 89, totalSessions: 210,
        latitude: -6.2150, longitude: 106.8300,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Ahmad Fauzi, S.Pd', email: 'ahmad.fauzi@gmail.com',
      phone: '081377700003', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 300000 } },
      teacherProfile: { create: {
        nik: '3201010101010003', ktpPhotoUrl: 'https://storage.tutora.id/ktp/ahmad.jpg',
        university: 'Universitas Negeri Jakarta', major: 'Pendidikan Bahasa Inggris',
        yearEnrolled: 2018, gpa: 3.65, subjects: ['Bahasa Inggris'],
        bio: 'TOEFL score 620, berpengalaman mengajar conversation dan grammar.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.7, totalReviews: 65, totalSessions: 180,
        latitude: -6.1950, longitude: 106.8500,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Nurul Hidayah, S.Pd', email: 'nurul.h@gmail.com',
      phone: '081377700004', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 550000 } },
      teacherProfile: { create: {
        nik: '3201010101010004', ktpPhotoUrl: 'https://storage.tutora.id/ktp/nurul.jpg',
        university: 'Universitas Gadjah Mada', major: 'Pendidikan Fisika',
        yearEnrolled: 2019, gpa: 3.90, subjects: ['Fisika', 'Matematika'],
        bio: 'Juara 1 OSN Fisika 2018, sabar mengajar dari dasar sampai paham.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.9, totalReviews: 103, totalSessions: 275,
        latitude: -6.2200, longitude: 106.8100,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Yoga Pratama', email: 'yoga.pratama@gmail.com',
      phone: '081377700005', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 200000 } },
      teacherProfile: { create: {
        nik: '3201010101010005', ktpPhotoUrl: 'https://storage.tutora.id/ktp/yoga.jpg',
        university: 'Universitas Indonesia', major: 'Matematika',
        yearEnrolled: 2021, gpa: 3.55, subjects: ['Matematika'],
        bio: 'Mahasiswa UI semester akhir, mengajar Matematika SD dan SMP.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.5, totalReviews: 32, totalSessions: 78,
        latitude: -6.1900, longitude: 106.8200,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Fitri Amelia, S.Pd', email: 'fitri.amelia@gmail.com',
      phone: '081377700006', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 680000 } },
      teacherProfile: { create: {
        nik: '3201010101010006', ktpPhotoUrl: 'https://storage.tutora.id/ktp/fitri.jpg',
        university: 'Universitas Negeri Yogyakarta', major: 'Pendidikan Biologi',
        yearEnrolled: 2017, gpa: 3.78, subjects: ['Biologi', 'Kimia'],
        bio: 'Guru biologi profesional, spesialis persiapan UTBK dan SBMPTN.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.8, totalReviews: 95, totalSessions: 310,
        latitude: -6.2050, longitude: 106.8600,
        availability: { create: { isOnline: false } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Dimas Arya Putra', email: 'dimas.arya@gmail.com',
      phone: '081377700007', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 150000 } },
      teacherProfile: { create: {
        nik: '3201010101010007', ktpPhotoUrl: 'https://storage.tutora.id/ktp/dimas.jpg',
        university: 'Institut Teknologi Sepuluh Nopember', major: 'Teknik Informatika',
        yearEnrolled: 2022, gpa: 3.60, subjects: ['Matematika', 'Fisika'],
        bio: 'Mahasiswa ITS, mengajar dengan metode visual dan analogi sehari-hari.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.6, totalReviews: 18, totalSessions: 45,
        latitude: -6.2300, longitude: 106.8350,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Wulan Dari, S.Hum', email: 'wulan.dari@gmail.com',
      phone: '081377700008', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 320000 } },
      teacherProfile: { create: {
        nik: '3201010101010008', ktpPhotoUrl: 'https://storage.tutora.id/ktp/wulan.jpg',
        university: 'Universitas Padjadjaran', major: 'Sastra Inggris',
        yearEnrolled: 2018, gpa: 3.82, subjects: ['Bahasa Inggris', 'Bahasa Indonesia'],
        bio: 'IELTS 7.5, mengajar Bahasa Inggris dan Indonesia untuk semua jenjang.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.7, totalReviews: 72, totalSessions: 195,
        latitude: -6.2000, longitude: 106.8450,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Reza Mahardika', email: 'reza.mahardika@gmail.com',
      phone: '081377700009', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 90000 } },
      teacherProfile: { create: {
        nik: '3201010101010009', ktpPhotoUrl: 'https://storage.tutora.id/ktp/reza.jpg',
        university: 'Universitas Brawijaya', major: 'Pendidikan Matematika',
        yearEnrolled: 2023, gpa: 3.45, subjects: ['Matematika'],
        bio: 'Mahasiswa baru tapi sudah mengajar les privat sejak SMA. Sabar dan telaten.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 4.4, totalReviews: 8, totalSessions: 22,
        latitude: -6.2250, longitude: 106.8550,
        availability: { create: { isOnline: false } },
      }},
    },
  });
  await prisma.user.create({
    data: {
      role: Role.TEACHER, name: 'Laras Sekar Ayu, S.Pd', email: 'laras.sekar@gmail.com',
      phone: '081377700010', passwordHash: hash, phoneVerified: true,
      wallet: { create: { balance: 880000 } },
      teacherProfile: { create: {
        nik: '3201010101010010', ktpPhotoUrl: 'https://storage.tutora.id/ktp/laras.jpg',
        university: 'Universitas Negeri Semarang', major: 'Pendidikan Kimia',
        yearEnrolled: 2016, gpa: 3.92, subjects: ['Kimia', 'Fisika', 'Matematika'],
        bio: 'Guru senior 8 tahun pengalaman, spesialis 3 mapel IPA sekaligus.',
        kycStatus: KycStatus.VERIFIED, onboardStatus: OnboardStatus.APPROVED,
        averageRating: 5.0, totalReviews: 156, totalSessions: 520,
        latitude: -6.1980, longitude: 106.8250,
        availability: { create: { isOnline: true, lastOnlineAt: new Date() } },
      }},
    },
  });

  // ═══════════════════════════════════════════════════════════════════
  // PROMOTIONS & VOUCHERS
  // ═══════════════════════════════════════════════════════════════════
  const promoMerdeka = await prisma.promotion.create({
    data: {
      title: 'Promo Kemerdekaan 🇮🇩', description: 'Diskon 20% untuk semua sesi les, max Rp 50.000',
      discountType: DiscountType.PERCENTAGE, discountValue: 20,
      minOrderAmount: 100000, maxDiscount: 50000,
      startDate: new Date('2026-08-01'), endDate: new Date('2026-08-31'), isActive: true,
      vouchers: { create: [
        { code: 'MERDEKA2026', maxUsage: 500, expiresAt: new Date('2026-08-31') },
        { code: 'MERDEKA17', maxUsage: 100, expiresAt: new Date('2026-08-17') },
      ]},
    },
  });
  const promoNewUser = await prisma.promotion.create({
    data: {
      title: 'Selamat Datang! 🎉', description: 'Diskon Rp 25.000 untuk sesi pertama kamu',
      discountType: DiscountType.FIXED, discountValue: 25000,
      minOrderAmount: 50000, startDate: new Date('2026-01-01'), endDate: new Date('2026-12-31'),
      isActive: true,
      vouchers: { create: [
        { code: 'WELCOME25K', maxUsage: 10000, expiresAt: new Date('2026-12-31') },
      ]},
    },
  });
  await prisma.promotion.create({
    data: {
      title: 'Flash Deal Malam 🌙', description: 'Diskon 15% untuk booking jam 19:00-21:00',
      discountType: DiscountType.PERCENTAGE, discountValue: 15,
      minOrderAmount: 70000, maxDiscount: 30000,
      startDate: new Date('2026-07-01'), endDate: new Date('2026-09-30'), isActive: true,
      vouchers: { create: [
        { code: 'MALAM15', maxUsage: 1000, expiresAt: new Date('2026-09-30') },
      ]},
    },
  });

  console.log('');
  console.log('✅ Seeding berhasil!');
  console.log('══════════════════════════════════════════');
  console.log('📊 Data yang ter-seed:');
  console.log('   👑 1  Admin         → admin@tutora.id');
  console.log('   🎒 20 Students      → delia@gmail.com, rizky.f@gmail.com, ...');
  console.log('   👪 10 Parents       → hendra.puspito@gmail.com, ...');
  console.log('   👶 20 Children      → terhubung ke parent via childUserId (Pak Agus punya 4)');
  console.log('   🎓 10 Teachers      → budi.santoso@gmail.com, ...');
  console.log('   🎫 3  Promotions    → dengan 4 voucher codes');
  console.log('   💰 Semua user punya wallet dengan saldo awal');
  console.log('══════════════════════════════════════════');
  console.log('🔑 Password semua akun: Password123!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
