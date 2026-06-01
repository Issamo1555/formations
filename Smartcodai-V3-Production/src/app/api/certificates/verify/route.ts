import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const certRef = searchParams.get('ref');

  if (!certRef) {
    return NextResponse.json({ error: 'Reference requise.' }, { status: 400 });
  }

  const cert = await prisma.certificate.findUnique({
    where: { certReference: certRef },
    include: {
      user: { select: { name: true, email: true } },
      course: {
        select: {
          slug: true,
          titleFr: true,
          titleEn: true,
          titleAr: true,
          modulesCount: true,
        },
      },
    },
  });

  if (!cert) {
    return NextResponse.json({ valid: false }, { status: 404 });
  }

  return NextResponse.json({
    valid: true,
    certificate: {
      reference: cert.certReference,
      studentName: cert.studentName,
      course: cert.course,
      score: cert.score,
      issuedAt: cert.issuedAt,
      isVerified: cert.isVerified,
    },
  });
}
