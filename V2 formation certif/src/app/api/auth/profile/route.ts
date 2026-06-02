import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('smartcodai-user-id')?.value;

    if (!userId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { institution, subject } = await req.json();

    if (!institution || !subject) {
      return NextResponse.json({ error: 'Tous les champs sont requis.' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        institution,
        subject,
      },
    });

    return NextResponse.json({ 
      success: true, 
      user: {
        id: updatedUser.id,
        institution: updatedUser.institution,
        subject: updatedUser.subject
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Erreur lors de la mise à jour du profil' }, { status: 500 });
  }
}
