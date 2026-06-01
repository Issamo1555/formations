import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get user's progress for a specific course
export async function GET(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseSlug = searchParams.get('course');

  if (!courseSlug) {
    return NextResponse.json({ error: 'Parametre course requis.' }, { status: 400 });
  }

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    select: { id: true, modulesCount: true },
  });

  if (!course) {
    return NextResponse.json({ error: 'Cours introuvable.' }, { status: 404 });
  }

  // Get all lessons for this course
  const lessons = await prisma.lesson.findMany({
    where: { courseId: course.id },
    select: { id: true, order: true },
    orderBy: { order: 'asc' },
  });

  // Get user's progress for these lessons
  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessons.map((l) => l.id) },
      completed: true,
    },
    select: { lessonId: true, completedAt: true, quizScore: true, quizAnswer: true },
  });

  const completedLessonIds = new Set(progress.map((p) => p.lessonId));
  const completedCount = completedLessonIds.size;
  const totalLessons = lessons.length;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  // Calculate quiz stats
  const quizzesAnswered = progress.filter((p) => p.quizScore !== null).length;
  const quizzesCorrect = progress.filter((p) => p.quizScore === 1).length;
  const quizScorePct = quizzesAnswered > 0 ? Math.round((quizzesCorrect / quizzesAnswered) * 100) : 0;

  return NextResponse.json({
    totalLessons,
    completedCount,
    progressPct,
    completedLessonIds: [...completedLessonIds],
    quizStats: {
      total: quizzesAnswered,
      correct: quizzesCorrect,
      scorePct: quizScorePct,
    },
  });
}

// POST - Mark a lesson as completed
export async function POST(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const { lessonId, courseId, quizAnswer, quizCorrect } = await req.json();

  if (!lessonId || !courseId) {
    return NextResponse.json({ error: 'lessonId et courseId requis.' }, { status: 400 });
  }

  const quizScore = quizAnswer !== undefined && quizCorrect !== undefined
    ? (quizAnswer === quizCorrect ? 1 : 0)
    : undefined;

  // Upsert lesson progress
  await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId },
    },
    update: {
      completed: true,
      completedAt: new Date(),
      ...(quizScore !== undefined && { quizScore, quizAnswer }),
    },
    create: {
      userId,
      courseId,
      lessonId,
      completed: true,
      completedAt: new Date(),
      ...(quizScore !== undefined && { quizScore, quizAnswer }),
    },
  });

  // Update overall course progress
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    select: { id: true },
  });

  const completed = await prisma.lessonProgress.count({
    where: { userId, courseId, completed: true },
  });

  const progressPct = lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0;

  // Update UserCourse progress
  await prisma.userCourse.upsert({
    where: {
      userId_courseId: { userId, courseId },
    },
    update: {
      progressPct,
      completedAt: progressPct === 100 ? new Date() : undefined,
    },
    create: {
      userId,
      courseId,
      progressPct,
      completedAt: progressPct === 100 ? new Date() : null,
    },
  });

  return NextResponse.json({ success: true, progressPct, completedCount: completed, totalLessons: lessons.length });
}
