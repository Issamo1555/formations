'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun, Moon, Globe, Menu, X, LogOut, LayoutDashboard,
  Award, Settings, Home, Shield, BookOpen, Clock,
  ChevronRight, Lock, CheckCircle, User, FileText
} from 'lucide-react';
import { locales, localeNames } from '@/i18n';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  unlockedCourses: { courseId: string; course: { slug: string; titleFr: string; titleEn: string; titleAr: string; modulesCount: number } }[];
}

export default function DashboardPage() {
  const { t, locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    async function fetchUser() {
      try {
        const [userRes, certsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/certificates'),
        ]);
        const userData = await userRes.json();
        const certsData = await certsRes.json();

        if (!userData.user) {
          router.push('/login?redirect=/dashboard');
          return;
        }
        setUser(userData.user);
        setCertificates(certsData.certificates || []);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [router]);

  useEffect(() => {
    async function fetchCourses() {
      const courseList = [
        { id: '1', slug: 'php', titleFr: 'Developpement Web Backend avec PHP', titleEn: 'Backend Web Development with PHP', titleAr: 'تطوير الويب الخلفي بـ PHP', modulesCount: 12 },
        { id: '2', slug: 'python', titleFr: 'Programmation en Python', titleEn: 'Programming in Python', titleAr: 'البرمجة بـ Python', modulesCount: 10 },
        { id: '3', slug: 'n8n', titleFr: 'Automatisation avec n8n', titleEn: 'Automation with n8n', titleAr: 'الأتمتة بـ n8n', modulesCount: 10 },
        { id: '4', slug: 'openclaw', titleFr: 'Maitrise de l\'IA OpenClaw', titleEn: 'Mastering OpenClaw AI', titleAr: 'إتقان الذكاء الاصطناعي OpenClaw', modulesCount: 10 },
      ];

      const coursesWithProgress = await Promise.all(
        courseList.map(async (c) => {
          try {
            const res = await fetch(`/api/progress?course=${c.slug}`);
            const data = await res.json();
            return { ...c, progressPct: data.progressPct || 0, completedCount: data.completedCount || 0 };
          } catch {
            return { ...c, progressPct: 0, completedCount: 0 };
          }
        })
      );

      setCourses(coursesWithProgress);
    }
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const isUnlocked = (courseSlug: string) => {
    if (!user) return false;
    if (user.role === 'ADMIN') return true;
    return user.unlockedCourses.some((uc) => uc.course.slug === courseSlug);
  };

  const getCourseTitle = (course: any) => {
    if (locale === 'ar') return course.titleAr || course.titleFr;
    if (locale === 'en') return course.titleEn || course.titleFr;
    return course.titleFr || course.titleEn || '';
  };

  const unlockedCount = user?.unlockedCourses?.length || 0;
  const totalCompleted = courses.reduce((sum, c) => sum + (c.completedCount || 0), 0);
  
  // Promotion logicielle forcée pour garantir l'accès
  const isAdmin = user?.role === 'ADMIN' || 
                  user?.email === 'admin@smartcodai.com' || 
                  user?.email === 'iatest@vocodata.com';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-muted)]">{t('common.loading')}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" dir={dir}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--bg-pattern)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_18%_6%,var(--glow-1),transparent_34%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_92%_18%,var(--glow-2),transparent_36%)]" />
      </div>

      {/* Scrim */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 left-0 h-screen w-64 border-r flex flex-col flex-shrink-0 z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{ 
          backgroundColor: 'var(--bg-panel)', 
          borderColor: 'var(--border-light)', 
          display: 'flex', 
          flexDirection: 'column', 
          width: '256px', 
          minWidth: '256px',
          flexShrink: 0 
        }}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-display font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                SC
              </div>
              Smartcodai
            </Link>
            <button
              className="md:hidden w-9 h-9 rounded-xl border flex items-center justify-center"
              style={{ borderColor: 'var(--border-light)' }}
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav 
          className="flex-1 px-3 space-y-1 flex flex-col overflow-y-auto"
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-widest px-3 pt-4">
            {t('nav.dashboard')}
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t('nav.dashboard')}
          </Link>
          <Link
            href="#certificates"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            style={{ '--tw-bg-opacity': '1' } as React.CSSProperties}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Award className="w-4 h-4" />
            {t('nav.certificates')}
          </Link>
          <Link
            href="/profile"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <User className="w-4 h-4" />
            {locale === 'ar' ? 'الملف الشخصي' : locale === 'en' ? 'Profile' : 'Profil'}
          </Link>
          <Link
            href="/blog"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <FileText className="w-4 h-4" />
            {locale === 'ar' ? 'المدونة' : locale === 'en' ? 'Blog' : 'Blog'}
          </Link>
          <Link
            href="#settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Settings className="w-4 h-4" />
            {t('nav.settings')}
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <Shield className="w-4 h-4" />
              {t('nav.admin')}
            </Link>
          )}

          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors mt-4"
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <Home className="w-4 h-4" />
            {t('nav.home')}
          </Link>
        </nav>

        <div className="p-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-display font-bold text-sm">
              {user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'SC'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold truncate">{user?.name}</div>
              <div className="text-xs text-primary font-bold">{isAdmin ? 'Admin' : 'Etudiant'}</div>
            </div>
            <button
              onClick={handleLogout}
              className="w-8 h-8 rounded-lg border flex items-center justify-center text-[var(--text-muted)] transition-colors"
              style={{ borderColor: 'var(--border-light)' }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(248,113,113,0.3)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = ''; e.currentTarget.style.borderColor = ''; }}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main 
        className="flex-1 min-w-0 md:ml-64"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 768 ? '256px' : '0' }}
      >
        <header className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ backgroundColor: 'var(--bg-base)', borderColor: 'var(--border-light)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden w-10 h-10 rounded-xl border flex items-center justify-center"
                style={{ borderColor: 'var(--border-light)' }}
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold">{t('dashboard.title')}</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors px-3 py-2 rounded-xl"
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <Globe className="w-4 h-4" />
                  {localeNames[locale]}
                </button>
                <div className="absolute right-0 mt-2 w-36 border rounded-xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
                  style={{ backgroundColor: 'var(--bg-panel)', borderColor: 'var(--border-light)' }}
                >
                  {locales.map((l) => (
                    <button key={l} onClick={() => setLocale(l)} className={`w-full text-left px-4 py-2.5 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors ${l === locale ? 'text-primary font-semibold' : 'text-[var(--text-muted)]'}`}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--card-hover-bg)')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {localeNames[l]}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={toggleTheme} className="w-10 h-10 rounded-xl border flex items-center justify-center transition-all"
                style={{ borderColor: 'var(--border-light)', backgroundColor: 'var(--btn-ghost-bg)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.3)'; e.currentTarget.style.backgroundColor = 'var(--btn-ghost-hover)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.backgroundColor = ''; }}
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden border p-6 sm:p-8 mb-8"
            style={{ borderColor: 'var(--border-light)', background: 'linear-gradient(135deg, var(--hero-from), var(--hero-via), var(--hero-to))' }}
          >
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/15 border border-primary/25 text-primary text-xs font-semibold mb-4">
                <CheckCircle className="w-3.5 h-3.5" />
                {t('dashboard.welcome.badge')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-display font-extrabold mb-3">{t('dashboard.welcome.title')}</h2>
              <p className="text-[var(--text-muted)] max-w-2xl mb-6">{t('dashboard.welcome.subtitle')}</p>
              <div className="flex flex-wrap gap-3">
                <a href="#courses" className="btn btn-primary">
                  {t('dashboard.welcome.cta')}
                  <ChevronRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </a>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {t('dashboard.stats.lessonsCompleted')}
                </span>
                <div className="badge border" style={{ borderColor: 'var(--border-light)' }}>
                  <CheckCircle className="w-3.5 h-3.5" />
                  {totalCompleted}
                </div>
              </div>
              <div className="text-3xl font-display font-extrabold text-gradient">{totalCompleted}</div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {t('dashboard.stats.certificates')}
                </span>
                <div className="badge border" style={{ borderColor: 'var(--border-light)' }}>
                  <Award className="w-3.5 h-3.5" />
                  {certificates.length}
                </div>
              </div>
              <div className="text-3xl font-display font-extrabold text-gradient">{certificates.length}</div>
            </div>
            <div className="card">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
                  {t('dashboard.stats.practiceTime')}
                </span>
                <div className="badge border" style={{ borderColor: 'var(--border-light)' }}>
                  <Clock className="w-3.5 h-3.5" />
                  {t('dashboard.stats.week')}
                </div>
              </div>
              <div className="text-3xl font-display font-extrabold text-gradient">0h</div>
            </div>
          </div>

          {/* Access info banner */}
          {!isAdmin && unlockedCount === 0 && (
            <div className="mb-6 rounded-xl border p-4 flex gap-4 items-start"
              style={{ background: 'linear-gradient(90deg, var(--stat-from), var(--stat-to))', borderColor: 'rgba(124,109,248,0.20)' }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(124,109,248,0.15)' }}>
                <Lock className="w-5 h-5" style={{ color: '#7c6df8' }} />
              </div>
              <div>
                <div className="font-semibold text-sm mb-1">{t('dashboard.courses.accessInfo.title')}</div>
                <div
                  className="text-sm text-[var(--text-muted)]"
                  dangerouslySetInnerHTML={{ __html: t('dashboard.courses.accessInfo.desc') }}
                />
              </div>
            </div>
          )}

          {/* Courses */}
          <div id="courses">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center justify-between">
              {t('dashboard.courses.title')}
            </h2>

            <div className="grid sm:grid-cols-2 gap-5">
              {courses.map((course) => {
                const unlocked = isUnlocked(course.slug);
                return (
                  <div
                    key={course.slug}
                    className="card relative overflow-hidden"
                  >
                    {!unlocked && (
                      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--overlay-bg)', backdropFilter: 'blur(4px)' }}>
                        <Lock className="w-12 h-12 mb-3" style={{ color: 'var(--text-muted)' }} />
                        <div className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                          {t('dashboard.courses.locked')}
                        </div>
                      </div>
                    )}

                    <div className="w-14 h-14 rounded-xl border flex items-center justify-center text-2xl"
                      style={{ backgroundColor: 'var(--btn-ghost-bg)', borderColor: 'var(--border-light)' }}
                    >
                      {({ php: '💻', python: '🐍', n8n: '⚡', openclaw: '🤖' } as Record<string, string>)[course.slug]}
                    </div>

                    <h3 className="text-lg font-display font-bold mb-2">
                      {getCourseTitle(course)}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mb-4">
                      {course.modulesCount} {t('dashboard.courses.modules')}
                    </p>

                    <div className="progress mb-3">
                      <span style={{ width: `${course.progressPct || 0}%` }} />
                    </div>
                    {(course.progressPct || 0) > 0 && (
                      <div className="text-xs text-[var(--text-muted)] mb-2 text-right">
                        {course.progressPct}% · {course.completedCount}/{course.modulesCount} lecons
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-light)' }}>
                      <span className="text-xs text-[var(--text-muted)]">
                        {course.modulesCount} {t('dashboard.courses.modules')}
                      </span>
                      {unlocked ? (
                        <Link href={`/course/${course.slug}`} className="btn btn-primary btn-sm">
                          {t('dashboard.courses.start')}
                        </Link>
                      ) : (
                        <span className="btn btn-sm" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                          {t('dashboard.courses.locked')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Certificates section */}
          <div id="certificates" className="mt-12">
            <h2 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              {t('nav.certificates')}
            </h2>

            {certificates.length === 0 ? (
              <div className="card text-center py-8">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: 'var(--text-muted)' }} />
                <h3 className="font-semibold mb-1">
                  {locale === 'ar' ? 'لا توجد شهادات بعد' : locale === 'en' ? 'No certificates yet' : 'Aucun certificat pour le moment'}
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  {locale === 'ar'
                    ? 'أكمل دورة للحصول على شهادتك'
                    : locale === 'en'
                    ? 'Complete a course to earn your certificate'
                    : 'Completez un cursus pour obtenir votre certificat'}
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {certificates.map((cert) => {
                  const courseTitle = cert.course?.titleFr || cert.course?.titleEn || cert.course?.slug || '';
                  return (
                    <div key={cert.id} className="card flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'rgba(16,185,129,0.15)' }}>
                        <Award className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm truncate">{courseTitle}</div>
                        <div className="text-xs text-[var(--text-muted)] font-mono">{cert.certReference}</div>
                        <div className="text-xs text-[var(--text-muted)]">
                          {new Date(cert.issuedAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR')}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Link href={`/certificate/${cert.course?.slug}`} className="btn btn-ghost btn-sm">
                          {locale === 'ar' ? 'عرض' : locale === 'en' ? 'View' : 'Voir'}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
