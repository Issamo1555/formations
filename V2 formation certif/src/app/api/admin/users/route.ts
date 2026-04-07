import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function requireAdmin(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (user?.role !== 'ADMIN') return null;
  return user;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    where: { role: 'USER' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      unlockedCourses: {
        select: {
          courseId: true,
          course: {
            select: {
              slug: true,
              titleFr: true,
              titleEn: true,
              titleAr: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ users });
}
