import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');

  const origin = process.env.NEXTAUTH_URL || req.nextUrl.origin;

  if (errorParam) {
    console.error('>>> [GOOGLE-AUTH] Google returned error:', errorParam);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorParam)}`, origin)
    );
  }

  if (!code) {
    console.error('>>> [GOOGLE-AUTH] No code parameter received from Google.');
    return NextResponse.redirect(
      new URL('/login?error=no_code_provided', origin)
    );
  }

  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!googleClientId || !googleClientSecret) {
    console.error('>>> [GOOGLE-AUTH] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is missing.');
    return NextResponse.redirect(
      new URL('/login?error=config_missing', origin)
    );
  }

  const redirectUri = `${origin}/api/auth/google/callback`;

  try {
    // 1. Échanger le code d'autorisation contre des jetons d'accès
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: googleClientId,
        client_secret: googleClientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      const errBody = await tokenResponse.text();
      console.error('>>> [GOOGLE-AUTH] Failed to exchange code for token:', errBody);
      return NextResponse.redirect(
        new URL('/login?error=token_exchange_failed', origin)
      );
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Récupérer les informations de profil utilisateur depuis l'API Google UserInfo
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      console.error('>>> [GOOGLE-AUTH] Failed to fetch Google userinfo.');
      return NextResponse.redirect(
        new URL('/login?error=userinfo_failed', origin)
      );
    }

    const googleUser = await userResponse.json();
    const email = googleUser.email?.trim().toLowerCase();
    const name = googleUser.name;
    const picture = googleUser.picture;

    if (!email) {
      console.error('>>> [GOOGLE-AUTH] No email address returned by Google.');
      return NextResponse.redirect(
        new URL('/login?error=email_missing', origin)
      );
    }

    // 3. Rechercher ou créer l'étudiant dans la base de données
    let user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Créer un nouvel étudiant
      const isAdmin = email === 'admin@smartcodai.com' || email === 'issamo1555@gmail.com';
      user = await prisma.user.create({
        data: {
          email,
          name: name || email.split('@')[0],
          role: isAdmin ? 'ADMIN' : 'USER',
          image: picture || null,
        },
      });
      console.log('>>> [GOOGLE-AUTH] New user created:', email);
    } else {
      // Mettre à jour l'image si elle n'est pas déjà présente
      if (!user.image && picture) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { image: picture },
        });
      }
      console.log('>>> [GOOGLE-AUTH] Existing user logged in:', email);
    }

    // 4. Connecter en définissant le cookie de session
    const response = NextResponse.redirect(new URL('/dashboard', origin));
    response.cookies.set('smartcodai-user-id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // Session de 30 jours
      path: '/',
    });

    return response;
  } catch (err: any) {
    console.error('>>> [GOOGLE-AUTH] Internal error during Google sign-in:', err);
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(err.message || 'unknown_error')}`, origin)
    );
  }
}
