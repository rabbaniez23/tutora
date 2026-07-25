import { Role, OnboardStatus } from '@prisma/client';
import { prisma } from '@/config/database';
import { hashPassword, comparePassword } from '@/shared/utils/hash';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '@/shared/utils/jwt';
import { generateOTP, isOTPExpired } from '@/shared/utils/otp';
import { OTP_EXPIRY_MINUTES } from '@/config/constants';
import type {
  RegisterInput,
  LoginInput,
  TeacherRegisterInput,
  TeacherKycInput,
  TeacherDocumentsInput,
  TeacherVideoInput,
} from './auth.schema';

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

function createTokenPair(user: { id: string; role: string }): TokenPair {
  const payload = { id: user.id, role: user.role };
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

export async function register(data: RegisterInput) {
  const user = await prisma.user.create({
    data: {
      role: data.role as Role,
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
    },
  });

  await prisma.wallet.create({
    data: { userId: user.id, balance: BigInt(0) },
  });

  const tokens = createTokenPair(user);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  if (user.deletedAt) {
    throw Object.assign(new Error('Account has been deleted'), { statusCode: 401 });
  }

  const isValid = await comparePassword(password, user.passwordHash);

  if (!isValid) {
    throw Object.assign(new Error('Invalid email or password'), { statusCode: 401 });
  }

  const tokens = createTokenPair(user);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function refreshToken(token: string) {
  let payload;

  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
  }

  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!storedToken) {
    throw Object.assign(new Error('Refresh token not found'), { statusCode: 401 });
  }

  if (storedToken.expiresAt < new Date()) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    throw Object.assign(new Error('Refresh token expired'), { statusCode: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } });

  if (!user || user.deletedAt) {
    throw Object.assign(new Error('User not found'), { statusCode: 401 });
  }

  const newTokens = createTokenPair(user);

  await prisma.refreshToken.delete({ where: { id: storedToken.id } });

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: newTokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return newTokens;
}

export async function logout(refreshToken: string) {
  await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
}

export async function sendOTP(phone: string) {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    throw Object.assign(new Error('Phone number not registered'), { statusCode: 404 });
  }

  const otpCode = generateOTP();
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otpCode, otpExpiresAt },
  });

  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEV OTP] Phone: ${phone}, Code: ${otpCode}`);
  }

  // TODO: Integrate with Fonnte WhatsApp API in production
  // await sendWhatsAppMessage(phone, `Kode verifikasi Tutora Anda: ${otpCode}`);

  return { message: 'OTP sent successfully' };
}

export async function verifyOTP(phone: string, code: string) {
  const user = await prisma.user.findUnique({ where: { phone } });

  if (!user) {
    throw Object.assign(new Error('Phone number not registered'), { statusCode: 404 });
  }

  if (!user.otpCode || !user.otpExpiresAt) {
    throw Object.assign(new Error('No OTP was sent to this number'), { statusCode: 400 });
  }

  if (isOTPExpired(user.otpExpiresAt)) {
    throw Object.assign(new Error('OTP has expired'), { statusCode: 400 });
  }

  if (user.otpCode !== code) {
    throw Object.assign(new Error('Invalid OTP code'), { statusCode: 400 });
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      phoneVerified: true,
      otpCode: null,
      otpExpiresAt: null,
    },
  });

  return { message: 'Phone verified successfully' };
}

export async function registerTeacher(data: TeacherRegisterInput) {
  const user = await prisma.user.create({
    data: {
      role: Role.TEACHER,
      name: data.name,
      email: data.email,
      phone: data.phone,
      passwordHash: await hashPassword(data.password),
    },
  });

  await prisma.teacherProfile.create({
    data: {
      id: user.id,
      university: data.university,
      major: data.major,
      yearEnrolled: data.yearEnrolled,
      gpa: data.gpa,
      subjects: data.subjects,
      bio: data.bio,
      onboardStatus: OnboardStatus.DRAFT,
    },
  });

  await prisma.teacherAvailability.create({
    data: { teacherId: user.id },
  });

  await prisma.wallet.create({
    data: { userId: user.id, balance: BigInt(0) },
  });

  const tokens = createTokenPair(user);

  await prisma.refreshToken.create({
    data: {
      userId: user.id,
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  const { passwordHash: _, ...userWithoutPassword } = user;

  return {
    user: userWithoutPassword,
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
  };
}

export async function submitKyc(teacherId: string, data: TeacherKycInput) {
  const profile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });

  if (!profile) {
    throw Object.assign(new Error('Teacher profile not found'), { statusCode: 404 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: {
      nik: data.nik,
      ktpPhotoUrl: data.ktpPhotoUrl,
      kycStatus: 'PENDING',
    },
  });

  return updated;
}

export async function submitDocuments(teacherId: string, urls: string[]) {
  const profile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });

  if (!profile) {
    throw Object.assign(new Error('Teacher profile not found'), { statusCode: 404 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: {
      profilePhoto: urls[0] || null,
    },
  });

  return updated;
}

export async function submitVideo(teacherId: string, videoUrl: string) {
  const profile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });

  if (!profile) {
    throw Object.assign(new Error('Teacher profile not found'), { statusCode: 404 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: {
      videoUrl,
      onboardStatus: OnboardStatus.REVIEW_VIDEO,
    },
  });

  return updated;
}
