'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun, Moon, Globe, User, Lock, Save, Loader2, CheckCircle,
  XCircle, ArrowLeft, Award, BookOpen, Clock, BarChart3
} from 'lucide-react';
import { locales, localeNames } from '@/i18n';

export default function ProfilePage() {
  const { locale, setLocale, dir, t } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  // Password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const [userRes, progressRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/certificates'),
        ]);
        const userData = await userRes.json();
        const certsData = await progressRes.json();

        if (!userData.user) {
          router.push('/login?redirect=/profile');
          return;
        }
        setUser(userData.user);

        // Calculate stats
        const courses = ['php', 'python', 'n8n', 'openclaw'];
        let totalLessons = 0;
        let completedLessons = 0;
        let totalQuizzes = 0;
        let correctQuizzes = 0;

        await Promise.all(
          courses.map(async (slug) => {
            try {
              const res = await fetch(`/api/progress?course=${slug}`);
              const data = await res.json();
              totalLessons += data.totalLessons || 0;
              completedLessons += data.completedCount || 0;
              totalQuizzes += data.quizStats?.total || 0;
              correctQuizzes += data.quizStats?.correct || 0;
            } catch {}
          })
        );

        setStats({
          totalLessons,
          completedLessons,
          certificates: certsData.certificates?.length || 0,
          coursesUnlocked: userData.user.unlockedCourses?.length || 0,
          quizTotal: totalQuizzes,
          quizCorrect: correctQuizzes,
          quizScorePct: totalQuizzes > 0 ? Math.round((correctQuizzes / totalQuizzes) * 100) : 0,
        });
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (newPassword.length < 6) {
      setPasswordError(locale === 'ar' ? 'كلمة المرور يجب ان تكون 6 احرف على الاقل' : locale === 'en' ? 'Password must be at least 6 characters' : 'Le mot de passe doit contenir au moins 6 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(locale === 'ar' ? 'كلمتا المرور غير متطابقتين' : locale === 'en' ? 'Passwords do not match' : 'Les mots de passe ne correspondent pas');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await fetch('/api/auth/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || (locale === 'ar' ? 'خطأ في تغيير كلمة المرور' : locale === 'en' ? 'Error changing password' : 'Erreur lors du changement de mot de passe'));
        return;
      }

      setPasswordSuccess(locale === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : locale === 'en' ? 'Password changed successfully' : 'Mot de passe modifie avec succes');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError(locale === 'ar' ? 'خطأ في الاتصال' : locale === 'en' ? 'Connection error' : 'Erreur de connexion');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const getInitials = (name: string) => name.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen" dir={dir}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
              <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {locale === 'ar' ? 'العودة للوحة التحكم' : locale === 'en' ? 'Back to Dashboard' : 'Retour au tableau de bord'}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative group hidden sm:block">
              <button className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors px-3 py-2 rounded-xl hover:bg-white/5">
                <Globe className="w-4 h-4" />
                {localeNames[locale]}
              </button>
              <div className="absolute right-0 mt-2 w-36 bg-[var(--bg-panel)] border border-border rounded-xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {locales.map((l) => (
                  <button key={l} onClick={() => setLocale(l)} className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl transition-colors ${l === locale ? 'text-primary font-semibold' : 'text-[var(--text-muted)]'}`}>
                    {localeNames[l]}
                  </button>
                ))}
              </div>
            </div>
            <button onClick={toggleTheme} className="w-10 h-10 rounded-xl border border-border bg-white/5 flex items-center justify-center hover:border-primary/30 hover:bg-primary/10 transition-all">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile header */}
        <div className="card mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-display font-bold text-2xl flex-shrink-0">
            {getInitials(user?.name || '')}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-2xl font-display font-extrabold">{user?.name}</h1>
            <p className="text-[var(--text-muted)]">{user?.email}</p>
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
              {user?.role === 'ADMIN'
                ? (locale === 'ar' ? 'مدير' : locale === 'en' ? 'Admin' : 'Administrateur')
                : (locale === 'ar' ? 'طالب' : locale === 'en' ? 'Student' : 'Etudiant')}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">
              {locale === 'ar' ? 'تاريخ التسجيل' : locale === 'en' ? 'Member since' : 'Membre depuis'}{' '}
              {new Date(user?.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          <div className="card text-center py-5">
            <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-2xl font-display font-extrabold text-gradient">{stats?.completedLessons || 0}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {locale === 'ar' ? 'دروس مكتملة' : locale === 'en' ? 'Lessons done' : 'Lecons terminees'}
            </div>
          </div>
          <div className="card text-center py-5">
            <BarChart3 className="w-6 h-6 text-secondary mx-auto mb-2" />
            <div className="text-2xl font-display font-extrabold text-gradient">{stats?.coursesUnlocked || 0}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {locale === 'ar' ? 'دورات مفتوحة' : locale === 'en' ? 'Courses unlocked' : 'Cours debloques'}
            </div>
          </div>
          <div className="card text-center py-5">
            <Award className="w-6 h-6 text-amber-500 mx-auto mb-2" />
            <div className="text-2xl font-display font-extrabold text-gradient">{stats?.certificates || 0}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {locale === 'ar' ? 'شهادات' : locale === 'en' ? 'Certificates' : 'Certificats'}
            </div>
          </div>
          <div className="card text-center py-5">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-display font-extrabold text-gradient">{stats?.quizCorrect || 0}/{stats?.quizTotal || 0}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {locale === 'ar' ? 'اختبارات صحيحة' : locale === 'en' ? 'Quizzes correct' : 'Quiz reussis'}
            </div>
          </div>
          <div className="card text-center py-5">
            <Clock className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-display font-extrabold text-gradient">{stats?.totalLessons || 0}</div>
            <div className="text-xs text-[var(--text-muted)] mt-1">
              {locale === 'ar' ? 'إجمالي الدروس' : locale === 'en' ? 'Total lessons' : 'Total lecons'}
            </div>
          </div>
        </div>

        {/* Password change */}
        <div className="card max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-display font-bold">
                {locale === 'ar' ? 'تغيير كلمة المرور' : locale === 'en' ? 'Change Password' : 'Changer le mot de passe'}
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                {locale === 'ar' ? 'أدخل كلمة المرور الحالية والجديدة' : locale === 'en' ? 'Enter your current and new password' : 'Entrez votre mot de passe actuel et le nouveau'}
              </p>
            </div>
          </div>

          {passwordError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 flex-shrink-0" />
              {passwordError}
            </div>
          )}
          {passwordSuccess && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              {passwordSuccess}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {locale === 'ar' ? 'كلمة المرور الحالية' : locale === 'en' ? 'Current Password' : 'Mot de passe actuel'}
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input"
                required
                autoComplete="current-password"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {locale === 'ar' ? 'كلمة المرور الجديدة' : locale === 'en' ? 'New Password' : 'Nouveau mot de passe'}
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                {locale === 'ar' ? 'تأكيد كلمة المرور' : locale === 'en' ? 'Confirm Password' : 'Confirmer le mot de passe'}
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input"
                required
                autoComplete="new-password"
                minLength={6}
              />
            </div>
            <button type="submit" className="btn btn-primary w-full" disabled={changingPassword}>
              {changingPassword ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {locale === 'ar' ? 'حفظ كلمة المرور' : locale === 'en' ? 'Save Password' : 'Enregistrer'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
