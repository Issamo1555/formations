'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Globe } from 'lucide-react';
import { locales, localeNames } from '@/i18n';
import { useState, Suspense } from 'react';

function LoginPageInner() {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';
  const oauthError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(oauthError ? (
    oauthError === 'config_missing' ? 'Configuration Google OAuth manquante.' :
    oauthError === 'token_exchange_failed' ? 'Échec de l\'authentification Google.' :
    oauthError === 'userinfo_failed' ? 'Impossible de récupérer votre profil Google.' :
    oauthError === 'email_missing' ? 'Votre compte Google ne fournit pas d\'email.' :
    'Une erreur est survenue lors de la connexion Google.'
  ) : '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('auth.login.error'));
        return;
      }

      router.refresh();
      // Small delay to let cookie propagate
      setTimeout(() => {
        router.push(redirect);
      }, 300);
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir={locale === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,109,248,0.14),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.10),transparent_40%)]" />
      </div>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 w-10 h-10 rounded-xl border border-border bg-[var(--bg-panel)] flex items-center justify-center hover:border-primary/30 transition-all"
      >
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      {/* Language selector */}
      <div className="fixed top-5 left-5 flex gap-2">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => setLocale(l)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              l === locale ? 'bg-primary/15 text-primary' : 'text-[var(--text-muted)] hover:bg-white/5'
            }`}
          >
            {localeNames[l]}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-extrabold text-2xl mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 font-bold text-sm">
              SC
            </div>
            Smartcodai
          </Link>
          <h1 className="text-2xl font-display font-extrabold">{t('auth.login.title')}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{t('auth.login.subtitle')}</p>
        </div>

        {/* Card */}
        <div className="bg-[var(--bg-panel)] border border-border rounded-2xl p-6 sm:p-8 shadow-card">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {t('auth.login.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input"
                placeholder="vous@exemple.com"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {t('auth.login.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? t('auth.login.loading') : t('auth.login.submit')}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg-panel)] px-2 text-[var(--text-muted)]">
                {t('auth.login.orContinueWith') || 'Ou continuer avec'}
              </span>
            </div>
          </div>

          <a
            href="/api/auth/google"
            className="btn btn-ghost w-full flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </a>
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-[var(--text-muted)]">
            {t('auth.login.noAccount')}{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              {t('auth.login.createAccount')}
            </Link>
          </p>
          <p>
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
              {t('auth.login.backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginPageInner />
    </Suspense>
  );
}
