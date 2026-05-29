import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const cookieStore = req.cookies;
  const userId = cookieStore.get('smartcodai-user-id')?.value;

  console.log(">>> [ME-CHECK] Tous les cookies reçus :", cookieStore.getAll().map(c => c.name));
  console.log(">>> [ME-CHECK] smartcodai-user-id trouvé :", userId ? "OUI (" + userId.substring(0, 5) + "...)" : "NON");

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
