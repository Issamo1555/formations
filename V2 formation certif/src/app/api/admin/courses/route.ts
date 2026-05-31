import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        slug: true,
        titleFr: true,
        titleEn: true,
        titleAr: true,
        modulesCount: true,
      },
      orderBy: {
        titleFr: 'asc',
      },
    });
    return NextResponse.json({ courses });
  } catch (error: any) {
    console.error('Error fetching courses list:', error);
    return NextResponse.json(
      { error: `Erreur lors de la récupération des cursus: ${error.message || 'Unknown'}` },
      { status: 500 }
    );
  }
}
