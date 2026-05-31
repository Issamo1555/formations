import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Get a single blog post by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: { select: { id: true, name: true } },
    },
  });

  if (!post) {
    return NextResponse.json({ error: 'Article introuvable.' }, { status: 404 });
  }

  return NextResponse.json({ post });
}

// PUT - Update a blog post (admin only)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 403 });
  }

  const { slug } = await params;
  const data = await req.json();

  const post = await prisma.blogPost.update({
    where: { slug },
    data: {
      ...(data.titleFr && { titleFr: data.titleFr }),
      ...(data.titleEn && { titleEn: data.titleEn }),
      ...(data.titleAr && { titleAr: data.titleAr }),
      ...(data.contentFr && { contentFr: data.contentFr }),
      ...(data.contentEn && { contentEn: data.contentEn }),
      ...(data.contentAr && { contentAr: data.contentAr }),
      ...(data.excerptFr !== undefined && { excerptFr: data.excerptFr }),
      ...(data.excerptEn !== undefined && { excerptEn: data.excerptEn }),
      ...(data.excerptAr !== undefined && { excerptAr: data.excerptAr }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.category && { category: data.category }),
      ...(data.isPublished !== undefined && { isPublished: data.isPublished }),
    },
  });

  return NextResponse.json({ success: true, post });
}

// DELETE - Delete a blog post (admin only)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const userId = req.cookies.get('smartcodai-user-id')?.value;
  if (!userId) {
    return NextResponse.json({ error: 'Non authentifie.' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Non autorise.' }, { status: 403 });
  }

  const { slug } = await params;

  await prisma.blogPost.delete({ where: { slug } });

  return NextResponse.json({ success: true });
}
