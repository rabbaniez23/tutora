import { PrismaClient, Role, KycStatus, OnboardStatus, MembershipTier, DiscountType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // ─── Admin ────────────────────────────────────────────────────────────────
  const admin = await prisma.user.upsert({
    where: { email: 'admin@tutora.id' },
    update: {},
    create: {
      role: Role.ADMIN,
      name: 'Admin Tutora',
      email: 'admin@tutora.id',
      phone: '+628120000001',
      passwordHash,
      phoneVerified: true,
    },
  });

  // ─── Students ─────────────────────────────────────────────────────────────
  const students = await Promise.all(
    [
      { name: 'Andi Pratama', email: 'andi@student.com', phone: '+628120000002' },
      { name: 'Siti Nurhaliza', email: 'siti@student.com', phone: '+628120000003' },
      { name: 'Budi Santoso', email: 'budi@student.com', phone: '+628120000004' },
    ].map((s) =>
      prisma.user.upsert({
        where: { email: s.email },
        update: {},
        create: {
          role: Role.STUDENT,
          name: s.name,
          email: s.email,
          phone: s.phone,
          passwordHash,
          phoneVerified: true,
        },
      })
    )
  );

  // ─── Teachers ─────────────────────────────────────────────────────────────
  const teacherUsers = await Promise.all(
    [
      { name: 'Rina Wulandari', email: 'rina@teacher.com', phone: '+628120000005' },
      { name: 'Dewi Kartika', email: 'dewi@teacher.com', phone: '+628120000006' },
      { name: 'Agus Setiawan', email: 'agus@teacher.com', phone: '+628120000007' },
    ].map((t) =>
      prisma.user.upsert({
        where: { email: t.email },
        update: {},
        create: {
          role: Role.TEACHER,
          name: t.name,
          email: t.email,
          phone: t.phone,
          passwordHash,
          phoneVerified: true,
        },
      })
    )
  );

  const teacherProfiles = [
    {
      userId: teacherUsers[0].id,
      subjects: ['Matematika', 'Fisika'],
      university: 'Universitas Indonesia',
      major: 'Pendidikan Matematika',
      bio: 'Guru les Matematika dan Fisika dengan pengalaman 3 tahun',
      kycStatus: KycStatus.VERIFIED,
      onboardStatus: OnboardStatus.APPROVED,
      membershipTier: MembershipTier.PROFESSIONAL,
      latitude: -6.2088,
      longitude: 106.8456,
    },
    {
      userId: teacherUsers[1].id,
      subjects: ['Bahasa Inggris', 'Bahasa Indonesia'],
      university: 'Universitas Padjadjaran',
      major: 'Sastra Inggris',
      bio: 'Guru les Bahasa Inggris dan Indonesia, sertifikasi TOEFL',
      kycStatus: KycStatus.VERIFIED,
      onboardStatus: OnboardStatus.APPROVED,
      membershipTier: MembershipTier.JUNIOR,
      latitude: -6.9175,
      longitude: 107.6191,
    },
    {
      userId: teacherUsers[2].id,
      subjects: ['IPA', 'Biologi'],
      university: 'Institut Teknologi Bandung',
      major: 'Biologi',
      bio: 'Guru les IPA dan Biologi, fokus pendekatan sains modern',
      kycStatus: KycStatus.VERIFIED,
      onboardStatus: OnboardStatus.APPROVED,
      membershipTier: MembershipTier.JUNIOR,
      latitude: -6.8913,
      longitude: 107.6055,
    },
  ];

  for (const profile of teacherProfiles) {
    await prisma.teacherProfile.upsert({
      where: { id: profile.userId },
      update: {},
      create: {
        id: profile.userId,
        subjects: profile.subjects,
        university: profile.university,
        major: profile.major,
        bio: profile.bio,
        kycStatus: profile.kycStatus,
        onboardStatus: profile.onboardStatus,
        membershipTier: profile.membershipTier,
        latitude: profile.latitude,
        longitude: profile.longitude,
      },
    });

    await prisma.teacherAvailability.upsert({
      where: { teacherId: profile.userId },
      update: {},
      create: {
        teacherId: profile.userId,
        isOnline: true,
        lastOnlineAt: new Date(),
      },
    });
  }

  // ─── Parent with children ─────────────────────────────────────────────────
  const parent = await prisma.user.upsert({
    where: { email: 'parent@tutora.id' },
    update: {},
    create: {
      role: Role.PARENT,
      name: 'Maya Sari',
      email: 'parent@tutora.id',
      phone: '+628120000008',
      passwordHash,
      phoneVerified: true,
    },
  });

  await prisma.parentChild.createMany({
    data: [
      { parentId: parent.id, childName: 'Raka Sari', childGrade: '8B' },
      { parentId: parent.id, childName: 'Luna Sari', childGrade: '5A' },
    ],
    skipDuplicates: true,
  });

  // ─── Wallets ──────────────────────────────────────────────────────────────
  const allUsers = [admin, ...students, ...teacherUsers, parent];
  for (const user of allUsers) {
    await prisma.wallet.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        balance: BigInt(500000),
      },
    });
  }

  // ─── Promotions ───────────────────────────────────────────────────────────
  const now = new Date();
  const threeMonthsLater = new Date(now);
  threeMonthsLater.setMonth(threeMonthsLater.getMonth() + 3);

  const promotions = [
    {
      title: 'Promo Pelajar Baru',
      description: 'Diskon 20% untuk pemesanan pertama',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 20,
      minOrderAmount: BigInt(50000),
      maxDiscount: BigInt(20000),
      startDate: now,
      endDate: threeMonthsLater,
    },
    {
      title: 'Cashback Top Up',
      description: 'Cashback Rp10.000 untuk top up minimal Rp200.000',
      discountType: DiscountType.FIXED,
      discountValue: 10000,
      minOrderAmount: BigInt(200000),
      maxDiscount: BigInt(10000),
      startDate: now,
      endDate: threeMonthsLater,
    },
    {
      title: 'Promo Referral',
      description: 'Diskon 15% untuk pesanan menggunakan kode referral',
      discountType: DiscountType.PERCENTAGE,
      discountValue: 15,
      minOrderAmount: BigInt(30000),
      maxDiscount: BigInt(15000),
      startDate: now,
      endDate: threeMonthsLater,
    },
  ];

  for (const promo of promotions) {
    await prisma.promotion.create({ data: promo });
  }

  console.log('✅ Seed complete!');
  console.log(`   - 1 Admin: admin@tutora.id`);
  console.log(`   - 3 Students: andi@siti.budi@student.com`);
  console.log(`   - 3 Teachers: rina.dewi.agus@teacher.com`);
  console.log(`   - 1 Parent: parent@tutora.id (2 children)`);
  console.log(`   - 5 Wallets with Rp500,000 balance`);
  console.log(`   - 3 Promotions`);
  console.log(`   - Password for all: Password123!`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
