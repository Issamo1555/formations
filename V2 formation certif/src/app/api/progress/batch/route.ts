import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/progress/batch?courses=php,python,n8n,openclaw,architecture
export async function GET(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const courseSlugs = searchParams.get('courses')?.split(',').filter(Boolean) || [];

  if (courseSlugs.length === 0) {
    return NextResponse.json({ error: 'Parametre courses requis.' }, { status: 400 });
  }

  // Fetch all courses in one query
  const courses = await prisma.course.findMany({
    where: { slug: { in: courseSlugs } },
    select: { id: true, slug: true, modulesCount: true },
  });

  if (courses.length === 0) {
    return NextResponse.json({ progress: {} });
  }

  const courseIds = courses.map(c => c.id);

  // Fetch all lessons for these courses in one query
  const lessons = await prisma.lesson.findMany({
    where: { courseId: { in: courseIds } },
    select: { id: true, courseId: true },
  });

  // Fetch all progress for these lessons in one query
  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessons.map(l => l.id) },
      completed: true,
    },
    select: { lessonId: true, courseId: true, quizScore: true },
  });

  // Group by course
  const lessonsByCourse = new Map<string, string[]>();
  for (const lesson of lessons) {
    const arr = lessonsByCourse.get(lesson.courseId) || [];
    arr.push(lesson.id);
    lessonsByCourse.set(lesson.courseId, arr);
  }

  const progressByLesson = new Set(progress.map(p => p.lessonId));

  const result: Record<string, {
    totalLessons: number;
    completedCount: number;
    progressPct: number;
    quizStats: { total: number; correct: number; scorePct: number };
  }> = {};

  for (const course of courses) {
    const courseLessons = lessonsByCourse.get(course.id) || [];
    const completedCount = courseLessons.filter(id => progressByLesson.has(id)).length;
    const totalLessons = courseLessons.length;
    const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

    // Quiz stats for this course
    const courseProgress = progress.filter(p => p.courseId === course.id);
    const quizzesAnswered = courseProgress.filter(p => p.quizScore !== null).length;
    const quizzesCorrect = courseProgress.filter(p => p.quizScore === 1).length;

    result[course.slug] = {
      totalLessons,
      completedCount,
      progressPct,
      quizStats: {
        total: quizzesAnswered,
        correct: quizzesCorrect,
        scorePct: quizzesAnswered > 0 ? Math.round((quizzesCorrect / quizzesAnswered) * 100) : 0,
      },
    };
  }

  return NextResponse.json({ progress: result });
}
