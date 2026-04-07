import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST - Create/save a certificate
export async function POST(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      unlockedCourses: {
        include: { course: { select: { slug: true, id: true } } },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: 'Utilisateur introuvable.' }, { status: 404 });
  }

  const { courseSlug, certReference, studentName, score } = await req.json();

  if (!courseSlug || !certReference) {
    return NextResponse.json({ error: 'Donnees invalides.' }, { status: 400 });
  }

  // Check if course is unlocked for this user
  const isUnlocked = user.role === 'ADMIN' ||
    user.unlockedCourses.some((uc) => uc.course.slug === courseSlug);

  if (!isUnlocked) {
    return NextResponse.json({ error: 'Cours non debloque.' }, { status: 403 });
  }

  // Find the course
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true },
  });

  if (!course) {
    return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
  }

  // Save certificate
  const certificate = await prisma.certificate.create({
    data: {
      certReference,
      userId: user.id,
      courseId: course.id,
      studentName: studentName || user.name,
      score: score || 100,
    },
  });

  return NextResponse.json({ success: true, certificate });
}

// GET - Get user's certificates
export async function GET(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: {
        select: {
          slug: true,
          titleFr: true,
          titleEn: true,
          titleAr: true,
        },
      },
    },
    orderBy: { issuedAt: 'desc' },
  });

  return NextResponse.json({ certificates });
}
