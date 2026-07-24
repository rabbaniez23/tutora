import { prisma } from '@/config/database';
import type { ListTeachersInput } from './teacher.schema';
import { haversineDistance } from '@/shared/utils/geo';
import { MATCHING_RADIUS_METERS } from '@/config/constants';

export async function listTeachers(filters: ListTeachersInput) {
  const { subject, level, lat, lng, radius, minRating, sort, page, limit } = filters;
  const offset = (page - 1) * limit;

  const where: Record<string, unknown> = {
    onboardStatus: 'APPROVED',
    kycStatus: 'VERIFIED',
    availability: {
      isOnline: true,
    },
  };

  if (subject) {
    where.subjects = { has: subject };
  }

  if (minRating) {
    where.averageRating = { gte: minRating };
  }

  let orderBy: Record<string, string>;

  if (lat && lng && sort === 'distance') {
    // PostGIS raw query for distance sorting
    const teachers = await prisma.$queryRaw<
      Array<{
        id: string;
        name: string;
        email: string;
        phone: string;
        avatar_url: string | null;
        subjects: string[];
        bio: string | null;
        profile_photo: string | null;
        average_rating: number;
        total_reviews: number;
        total_sessions: number;
        latitude: number;
        longitude: number;
        distance_m: number;
      }>
    >`
      SELECT
        u.id,
        u.name,
        u.email,
        u.phone,
        u.avatar_url,
        tp.subjects,
        tp.bio,
        tp.profile_photo as profile_photo,
        tp.average_rating,
        tp.total_reviews,
        tp.total_sessions,
        tp.latitude,
        tp.longitude,
        ST_Distance(
          ST_SetSRID(ST_MakePoint(tp.longitude, tp.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(${lng}::float, ${lat}::float), 4326)::geography
        ) AS distance_m
      FROM users u
      INNER JOIN teacher_profiles tp ON tp.id = u.id
      INNER JOIN teacher_availability ta ON ta.teacher_id = u.id
      WHERE u.deleted_at IS NULL
        AND tp.onboard_status = 'APPROVED'
        AND tp.kyc_status = 'VERIFIED'
        AND ta.is_online = true
        ${subject ? prisma.$queryRaw`AND ${subject} = ANY(tp.subjects)` : prisma.$queryRaw``}
        ${minRating ? prisma.$queryRaw`AND tp.average_rating >= ${minRating}` : prisma.$queryRaw``}
        AND ST_DWithin(
          ST_SetSRID(ST_MakePoint(tp.longitude, tp.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(${lng}::float, ${lat}::float), 4326)::geography,
          ${radius}
        )
      ORDER BY distance_m ASC
      LIMIT ${limit} OFFSET ${offset}
    `;

    const total = teachers.length;

    return {
      data: teachers.map((t) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        phone: t.phone,
        avatarUrl: t.avatar_url,
        subjects: t.subjects,
        bio: t.bio,
        profilePhoto: t.profile_photo,
        averageRating: Number(t.average_rating),
        totalReviews: t.total_reviews,
        totalSessions: t.total_sessions,
        latitude: t.latitude,
        longitude: t.longitude,
        distanceM: Number(t.distance_m),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // Fallback: no geo sorting, use Prisma ORM
  orderBy = sort === 'rating'
    ? { averageRating: 'desc' }
    : sort === 'sessions'
      ? { totalSessions: 'desc' }
      : { averageRating: 'desc' };

  const [teachers, total] = await Promise.all([
    prisma.teacherProfile.findMany({
      where: where as never,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatarUrl: true,
          },
        },
      },
      orderBy,
      skip: offset,
      take: limit,
    }),
    prisma.teacherProfile.count({ where: where as never }),
  ]);

  return {
    data: teachers.map((t) => {
      let distanceM: number | null = null;

      if (lat && lng && t.latitude && t.longitude) {
        distanceM = haversineDistance(lat, lng, t.latitude, t.longitude);
      }

      return {
        id: t.user.id,
        name: t.user.name,
        email: t.user.email,
        phone: t.user.phone,
        avatarUrl: t.user.avatarUrl,
        subjects: t.subjects,
        bio: t.bio,
        profilePhoto: t.profilePhoto,
        averageRating: t.averageRating,
        totalReviews: t.totalReviews,
        totalSessions: t.totalSessions,
        latitude: t.latitude,
        longitude: t.longitude,
        distanceM,
      };
    }),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getTeacherDetail(teacherId: string) {
  const profile = await prisma.teacherProfile.findUnique({
    where: { id: teacherId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          avatarUrl: true,
          createdAt: true,
        },
      },
      availability: {
        select: {
          isOnline: true,
          lastOnlineAt: true,
        },
      },
      reviews: {
        include: {
          reviewer: {
            select: {
              id: true,
              name: true,
              avatarUrl: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });

  if (!profile) {
    throw Object.assign(new Error('Teacher not found'), { statusCode: 404 });
  }

  return profile;
}

export async function toggleOnline(teacherId: string, isOnline: boolean) {
  const profile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });

  if (!profile) {
    throw Object.assign(new Error('Teacher profile not found'), { statusCode: 404 });
  }

  const updated = await prisma.teacherAvailability.upsert({
    where: { teacherId },
    update: {
      isOnline,
      lastOnlineAt: isOnline ? new Date() : undefined,
    },
    create: {
      teacherId,
      isOnline,
      lastOnlineAt: isOnline ? new Date() : undefined,
    },
  });

  return updated;
}

export async function updateLocation(teacherId: string, latitude: number, longitude: number) {
  const profile = await prisma.teacherProfile.findUnique({ where: { id: teacherId } });

  if (!profile) {
    throw Object.assign(new Error('Teacher profile not found'), { statusCode: 404 });
  }

  const updated = await prisma.teacherProfile.update({
    where: { id: teacherId },
    data: { latitude, longitude },
    select: {
      id: true,
      latitude: true,
      longitude: true,
      updatedAt: true,
    },
  });

  return updated;
}
