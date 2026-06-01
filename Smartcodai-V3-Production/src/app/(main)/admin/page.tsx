'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun, Moon, Globe, Menu, X, Shield, Users,
  Lock, Unlock, Search, LayoutDashboard, LogOut,
  Award, Settings, Home, FileText
} from 'lucide-react';
import { locales, localeNames } from '@/i18n';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  unlockedCourses: { courseId: string; course: { slug: string; titleFr: string; titleEn: string; titleAr: string } }[];
}

const COURSES = [
  { slug: 'php', label: 'PHP' },
  { slug: 'python', label: 'Python' },
  { slug: 'n8n', label: 'n8n' },
  { slug: 'openclaw', label: 'OpenClaw' },
];

export default function AdminPage() {
  const { t, locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [usersRes] = await Promise.all([
          fetch('/api/admin/users'),
        ]);

        if (!usersRes.ok) {
          router.push('/dashboard');
          return;
        }

        const data = await usersRes.json();
        setUsers(data.users || []);
      } catch {
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [router]);

  const handleToggle = async (userId: string, courseSlug: string, action: 'unlock' | 'lock') => {
    await fetch('/api/admin/unlock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, courseSlug, action }),
    });

    // Refresh
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setUsers(data.users || []);
  };

  const handleToggleAll = async (userId: string, action: 'unlock' | 'lock') => {
    for (const course of COURSES) {
      await handleToggle(userId, course.slug, action);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    users: users.length,
    php: users.filter((u) => u.unlockedCourses.some((uc) => uc.course.slug === 'php')).length,
    python: users.filter((u) => u.unlockedCourses.some((uc) => uc.course.slug === 'python')).length,
    n8n: users.filter((u) => u.unlockedCourses.some((uc) => uc.course.slug === 'n8n')).length,
    openclaw: users.filter((u) => u.unlockedCourses.some((uc) => uc.course.slug === 'openclaw')).length,
  };

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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px]" />
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
        className={`fixed md:sticky top-0 left-0 h-screen w-64 bg-[var(--bg-panel)] border-r border-border flex flex-col z-50 transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 font-display font-extrabold text-lg">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 font-bold text-sm">
                SC
              </div>
              Smartcodai
            </Link>
            <button className="md:hidden w-9 h-9 rounded-xl border border-border flex items-center justify-center" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-colors">
            <LayoutDashboard className="w-4 h-4" />
            {t('nav.dashboard')}
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-primary/10 text-primary">
            <Shield className="w-4 h-4" />
            {t('nav.admin')}
          </Link>
          <Link href="/admin/blog" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-colors">
            <FileText className="w-4 h-4" />
            {locale === 'ar' ? 'إدارة المدونة' : locale === 'en' ? 'Blog Management' : 'Gestion du Blog'}
          </Link>
          <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-white/5 transition-colors mt-4">
            <Home className="w-4 h-4" />
            {t('nav.home')}
          </Link>
        </nav>

        <div className="p-4 border-t border-border">
          <button onClick={() => { fetch('/api/auth/logout', { method: 'POST' }); router.push('/'); }} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[var(--text-muted)] hover:text-red-400 transition-colors w-full">
            <LogOut className="w-4 h-4" />
            {t('nav.logout')}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 md:ml-64">
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
          <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="md:hidden w-10 h-10 rounded-xl border border-border flex items-center justify-center" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold">{t('nav.admin')}</h1>
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

        <div className="px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h2 className="text-2xl font-display font-extrabold">{t('admin.title')}</h2>
            <p className="text-sm text-[var(--text-muted)] mt-1">{t('admin.subtitle')}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
            <div className="card text-center py-4">
              <div className="text-2xl font-display font-extrabold text-gradient">{stats.users}</div>
              <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-1">{t('admin.stats.users')}</div>
            </div>
            {['php', 'python', 'n8n', 'openclaw'].map((slug) => (
              <div key={slug} className="card text-center py-4">
                <div className="text-2xl font-display font-extrabold text-gradient">{(stats as any)[slug]}</div>
                <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider mt-1">{(t(`admin.stats.${slug}Unlocked`) as string)}</div>
              </div>
            ))}
          </div>

          {/* Users table */}
          <div className="card overflow-hidden p-0">
            <div className="px-5 py-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
              <h3 className="font-semibold">{t('admin.table.title')}</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('admin.table.search')}
                  className="input pl-10 w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">{t('admin.table.user')}</th>
                    <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">{t('admin.table.date')}</th>
                    <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">{t('admin.table.courses')}</th>
                    <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">{t('admin.table.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-[var(--text-muted)]">
                        {users.length === 0 ? t('admin.table.empty') : t('admin.table.noResults')}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const unlockedSlugs = user.unlockedCourses.map((uc) => uc.course.slug);
                      return (
                        <tr key={user.id} className="border-b border-border hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-4">
                            <div className="font-semibold text-sm">{user.name}</div>
                            <div className="text-xs text-[var(--text-muted)]">{user.email}</div>
                          </td>
                          <td className="px-5 py-4 text-xs text-[var(--text-muted)]">
                            {new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap gap-1.5">
                              {COURSES.map((course) => {
                                const isUnlocked = unlockedSlugs.includes(course.slug);
                                return (
                                  <button
                                    key={course.slug}
                                    onClick={() => handleToggle(user.id, course.slug, isUnlocked ? 'lock' : 'unlock')}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all hover:scale-105 ${
                                      isUnlocked
                                        ? 'bg-primary/12 border border-primary/25 text-primary'
                                        : 'bg-red-500/8 border border-red-500/20 text-red-400'
                                    }`}
                                  >
                                    {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                                    {course.label}
                                  </button>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex gap-2">
                              <button onClick={() => handleToggleAll(user.id, 'unlock')} className="btn btn-sm bg-primary/12 border border-primary/25 text-primary hover:bg-primary/20">
                                {t('admin.table.unlockAll')}
                              </button>
                              <button onClick={() => handleToggleAll(user.id, 'lock')} className="btn btn-sm bg-red-500/8 border border-red-500/20 text-red-400 hover:bg-red-500/15">
                                {t('admin.table.lockAll')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
