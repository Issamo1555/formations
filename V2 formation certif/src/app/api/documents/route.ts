import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('smartcodai-user-id')?.value;

    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { institution: true }
    });

    if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

    const conditions: any[] = [{ institution: null }];
    if (user.institution && user.institution.trim() !== '') {
      conditions.push({ institution: user.institution });
    }

    const documents = await prisma.document.findMany({
      where: { OR: conditions },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
