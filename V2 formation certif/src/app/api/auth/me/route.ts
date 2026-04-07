import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;

  if (!userId) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      unlockedCourses: {
        include: {
          course: {
            select: {
              id: true,
              slug: true,
              titleFr: true,
              titleEn: true,
              titleAr: true,
              modulesCount: true,
            },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }

  return NextResponse.json({ user });
}
