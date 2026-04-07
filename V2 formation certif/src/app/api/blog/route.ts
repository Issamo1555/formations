import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - List published blog posts
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');
  const skip = (page - 1) * limit;

  const where: any = { isPublished: true };
  if (category) where.category = category;

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        author: { select: { id: true, name: true } },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json({
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST - Create a new blog post (admin only)
export async function POST(req: NextRequest) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 403 });
  }

  const data = await req.json();
  const { slug, titleFr, titleEn, titleAr, contentFr, contentEn, contentAr, excerptFr, excerptEn, excerptAr, imageUrl, category, isPublished } = data;

  if (!slug || !titleFr || !contentFr) {
    return NextResponse.json({ error: 'slug, titleFr et contentFr requis.' }, { status: 400 });
  }

  // Check if slug exists
  const existing = await prisma.blogPost.findUnique({ where: { slug } });
  if (existing) {
    return NextResponse.json({ error: 'Ce slug existe deja.' }, { status: 409 });
  }

  const post = await prisma.blogPost.create({
    data: {
      slug,
      titleFr,
      titleEn: titleEn || titleFr,
      titleAr: titleAr || titleFr,
      contentFr,
      contentEn: contentEn || contentFr,
      contentAr: contentAr || contentFr,
      excerptFr,
      excerptEn,
      excerptAr,
      imageUrl,
      category: category || 'news',
      isPublished: isPublished || false,
      authorId: userId,
    },
  });

  return NextResponse.json({ success: true, post });
}
