import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  console.log(">>> [DEBUG] Login attempt started");
  try {
    const { email, password } = await req.json();
    console.log(">>> [AUTH-STEP-1] Tentative de login pour :", email);

    if (!email || !password) {
      console.log(">>> [DEBUG] Missing email or password");
      return NextResponse.json(
        { error: 'Email et mot de passe requis.' },
        { status: 400 }
      );
    }

    const emailLower = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: emailLower },
      select: {
        id: true,
        name: true,
        email: true,
        passwordHash: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email ou mot de passe incorrect.' },
        { status: 401 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);

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

    return response;
  } catch (error: any) {
    console.error('>>> [DEBUG] Login error DETAILED:', error);
    return NextResponse.json(
      { error: `Une erreur est survenue: ${error?.message || 'Unknown'}` },
      { status: 500 }
    );
  }
}
