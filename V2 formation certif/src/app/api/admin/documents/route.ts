import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('smartcodai-user-id')?.value;

    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const adminUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string | null;
    const description = formData.get('description') as string | null;
    const rawInstitution = formData.get('institution') as string | null;
    
    let institution = null;
    if (rawInstitution && rawInstitution.trim() !== '' && rawInstitution !== 'GLOBAL') {
      institution = rawInstitution.trim();
    }

    if (!file || !title) {
      return NextResponse.json({ error: 'Le fichier et le titre sont requis.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save the file
    const uploadDir = path.join(process.cwd(), 'public/uploads/documents');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}-${file.name.replace(/\\s+/g, '-')}`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, buffer);

    const fileUrl = `/uploads/documents/${fileName}`;

    const document = await prisma.document.create({
      data: {
        title: title.trim(),
        description: description?.trim(),
        fileName: file.name,
        fileUrl,
        size: file.size,
        institution,
      }
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error('Error uploading document:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('smartcodai-user-id')?.value;

    if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

    const adminUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!adminUser || adminUser.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
    }

    const documents = await prisma.document.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const uniqueUsers = await prisma.user.findMany({
      select: { institution: true },
      distinct: ['institution']
    });

    const institutions = uniqueUsers
      .map(u => u.institution)
      .filter(i => i && i.trim() !== '')
      .sort();

    return NextResponse.json({ success: true, documents, institutions });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
