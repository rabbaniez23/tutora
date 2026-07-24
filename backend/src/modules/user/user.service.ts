import { prisma } from '@/config/database';
import type { UpdateProfileInput } from './user.schema';

export async function getProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      phone: true,
      phoneVerified: true,
      avatarUrl: true,
      createdAt: true,
      teacherProfile: {
        select: {
          university: true,
          major: true,
          yearEnrolled: true,
          gpa: true,
          subjects: true,
          bio: true,
          profilePhoto: true,
          kycStatus: true,
          onboardStatus: true,
          membershipTier: true,
          averageRating: true,
          totalReviews: true,
          totalSessions: true,
          latitude: true,
          longitude: true,
        },
      },
      wallet: {
        select: {
          balance: true,
        },
      },
      parentChildren: {
        select: {
          id: true,
          childName: true,
          childGrade: true,
        },
      },
    },
  });

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  return user;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) {
    throw Object.assign(new Error('User not found'), { statusCode: 404 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      role: true,
      name: true,
      email: true,
      phone: true,
      avatarUrl: true,
      updatedAt: true,
    },
  });

  return updated;
}
