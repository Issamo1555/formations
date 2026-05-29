import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  
  if (!googleClientId) {
    console.error('>>> [GOOGLE-AUTH] GOOGLE_CLIENT_ID is not configured in environment variables.');
    return NextResponse.json(
      { error: 'Google Client ID non configuré.' },
      { status: 500 }
    );
  }

  // Utilise NEXTAUTH_URL si configuré (production/staging), sinon l'origine de la requête
  const origin = process.env.NEXTAUTH_URL || req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${googleClientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=openid%20email%20profile` +
    `&prompt=consent`;

  return NextResponse.redirect(googleAuthUrl);
}
