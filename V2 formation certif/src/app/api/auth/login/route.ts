import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  console.log(">>> [DEBUG] Login attempt started");
  try {
    const { email, password } = await req.json();
    console.log(`>>> [PERF] Body parsed in ${Date.now() - t0}ms`);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();

    const t1 = Date.now();
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
    });
    console.log(`>>> [PERF] Prisma findUnique in ${Date.now() - t1}ms`);

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Votre compte a été désactivé par un administrateur.' },
        { status: 403 }
      );
    }

    const t2 = Date.now();
    const valid = await bcrypt.compare(password, user.passwordHash);
    console.log(`>>> [PERF] bcrypt.compare in ${Date.now() - t2}ms`);

    if (!valid) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const { passwordHash, ...safeUser } = user;

    const response = NextResponse.json({ success: true, user: safeUser });
    response.cookies.set('smartcodai-user-id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30,
      path: '/',
    });

    console.log(`>>> [PERF] Total login in ${Date.now() - t0}ms`);
    return response;
  } catch (error: any) {
    console.error('>>> [DEBUG] Login error DETAILED:', error);
    return NextResponse.json(
      { error: `Une erreur est survenue: ${error?.message || 'Unknown'}` },
      { status: 500 }
    );
  }
}
