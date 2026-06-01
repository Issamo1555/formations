import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('smartcodai-user-id')?.value;

    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    // For now, return all documents. Later we can filter by course if needed.
    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, documents });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
