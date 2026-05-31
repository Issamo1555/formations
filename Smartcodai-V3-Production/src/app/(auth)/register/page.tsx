'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Globe, Check } from 'lucide-react';
import { locales, localeNames } from '@/i18n';
import { useState } from 'react';

export default function RegisterPage() {
  const { t, locale, setLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordStrength = (): { level: number; label: string; color: string } => {
    if (password.length === 0) return { level: 0, label: t('auth.register.passwordMin'), color: '' };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: t('auth.register.passwordWeak'), color: 'bg-red-500' };
    if (score <= 3) return { level: 2, label: t('auth.register.passwordMedium'), color: 'bg-amber-500' };
    return { level: 3, label: t('auth.register.passwordStrong'), color: 'bg-primary' };
  };

  const strength = passwordStrength();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.register.passwordMismatch'));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || t('common.error'));
        return;
      }

      router.refresh();
      // Small delay to let cookie propagate
      setTimeout(() => {
        router.push('/dashboard');
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
          <h1 className="text-2xl font-display font-extrabold">{t('auth.register.title')}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{t('auth.register.subtitle')}</p>
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
                {t('auth.register.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder={t('auth.register.name')}
                required
                autoComplete="name"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {t('auth.register.email')}
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
                {t('auth.register.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="new-password"
                minLength={6}
              />
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-slate-500/20 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.level / 3) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{strength.label}</p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {t('auth.register.confirmPassword')}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                placeholder="••••••••"
                required
                autoComplete="new-password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={loading}>
              {loading ? t('auth.register.loading') : t('auth.register.submit')}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="mt-4 space-y-2">
          {[
            locale === 'ar' ? 'وصول مجاني لجميع الدورات الأساسية' : locale === 'en' ? 'Free access to all basic courses' : 'Acces gratuit a tous les cursus de base',
            locale === 'ar' ? 'تتبع تقدم مخصص' : locale === 'en' ? 'Personalized progress tracking' : 'Suivi de progression personnalise',
            locale === 'ar' ? 'شهادات قابلة للتنزيل عند الإتمام' : locale === 'en' ? 'Downloadable certificates upon completion' : 'Certificats telechargeables a la fin',
          ].map((item: string, i: number) => (
            <div key={i} className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              {item}
            </div>
          ))}
        </div>

        {/* Footer links */}
        <div className="text-center mt-6 space-y-2">
          <p className="text-sm text-[var(--text-muted)]">
            {t('auth.register.hasAccount')}{' '}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              {t('auth.register.login')}
            </Link>
          </p>
          <p>
            <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
              {t('auth.register.backHome')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
