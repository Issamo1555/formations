import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function requireAdmin(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });

  if (user?.role !== 'ADMIN') return null;
  return user;
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 403 });
  }

  const { userId, courseSlug, action } = await req.json();

  if (!userId || !courseSlug || !action) {
    return NextResponse.json(
      { error: 'Donnees invalides.' },
      { status: 400 }
    );
  }

  // Find course by slug
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true },
  });

  if (!course) {
    return NextResponse.json(
      { error: 'Cours introuvable.' },
      { status: 404 }
    );
  }

  if (action === 'unlock') {
    await prisma.userCourse.upsert({
      where: {
        userId_courseId: { userId, courseId: course.id },
      },
      update: {},
      create: {
        userId,
        courseId: course.id,
        unlockedBy: admin.id,
      },
    });
  } else if (action === 'lock') {
    await prisma.userCourse.deleteMany({
      where: { userId, courseId: course.id },
    });
  }

  return NextResponse.json({ success: true });
}
