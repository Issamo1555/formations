import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get('smartcodai-user-id')?.value;

    if (!adminId) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const adminUser = await prisma.user.findUnique({
      where: { id: adminId },
    });

    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const { id } = await params;
    
    // Check if user exists
    const student = await prisma.user.findUnique({
      where: { id }
    });

    if (!student) {
      return NextResponse.json({ error: 'Étudiant introuvable' }, { status: 404 });
    }

    // Toggle isActive
    const updatedStudent = await prisma.user.update({
      where: { id },
      data: { isActive: !student.isActive },
    });

    return NextResponse.json({ 
      success: true, 
      isActive: updatedStudent.isActive 
    });
  } catch (error) {
    console.error('Error toggling active state:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
