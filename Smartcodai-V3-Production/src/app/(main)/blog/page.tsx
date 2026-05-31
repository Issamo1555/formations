'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Globe, ArrowLeft, Calendar, Tag, ExternalLink, Loader2 } from 'lucide-react';
import { locales, localeNames } from '@/i18n';

const CATEGORIES = [
  { value: '', label: { fr: 'Tous', en: 'All', ar: 'الكل' } },
  { value: 'news', label: { fr: 'Nouveautes', en: 'News', ar: 'اخبار' } },
  { value: 'tutorial', label: { fr: 'Tutoriels', en: 'Tutorials', ar: 'دروس' } },
  { value: 'update', label: { fr: 'Mises a jour', en: 'Updates', ar: 'تحديثات' } },
];

export default function BlogPage() {
  const { locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), limit: '10' });
        if (category) params.set('category', category);
        const res = await fetch(`/api/blog?${params}`);
        const data = await res.json();
        setPosts(data.posts || []);
        setTotalPages(data.totalPages || 1);
      } catch {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, [category, page]);

  const getTitle = (post: any) => {
    if (locale === 'ar') return post.titleAr || post.titleFr;
    if (locale === 'en') return post.titleEn || post.titleFr;
    return post.titleFr;
  };

  const getExcerpt = (post: any) => {
    if (locale === 'ar') return post.excerptAr || post.contentAr?.substring(0, 150) || post.contentFr?.substring(0, 150);
    if (locale === 'en') return post.excerptEn || post.contentEn?.substring(0, 150) || post.contentFr?.substring(0, 150);
    return post.excerptFr || post.contentFr?.substring(0, 150);
  };

  const getCategoryLabel = (cat: string) => {
    const c = CATEGORIES.find((c) => c.value === cat);
    return c ? c.label[locale as keyof typeof c.label] || c.label.fr : cat;
  };

  return (
    <div className="min-h-screen" dir={dir}>
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-extrabold mb-2">
            {locale === 'ar' ? 'المدونة' : locale === 'en' ? 'Blog' : 'Blog'}
          </h1>
          <p className="text-[var(--text-muted)]">
            {locale === 'ar'
              ? 'اكتشف آخر الأخبار والدروس والتحديثات التكنولوجية'
              : locale === 'en'
              ? 'Discover the latest tech news, tutorials and updates'
              : 'Decouvrez les dernieres nouvelles, tutoriels et mises a jour technologiques'}
          </p>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => { setCategory(cat.value); setPage(1); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                category === cat.value
                  ? 'bg-primary/15 text-primary border border-primary/25'
                  : 'bg-white/5 text-[var(--text-muted)] border border-border hover:bg-white/10'
              }`}
            >
              {cat.label[locale as keyof typeof cat.label] || cat.label.fr}
            </button>
          ))}
        </div>

        {/* Posts */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : posts.length === 0 ? (
          <div className="card text-center py-12">
            <Tag className="w-12 h-12 text-[var(--text-muted)] mx-auto mb-3 opacity-40" />
            <h3 className="font-semibold mb-1">
              {locale === 'ar' ? 'لا توجد مقالات بعد' : locale === 'en' ? 'No articles yet' : 'Aucun article pour le moment'}
            </h3>
            <p className="text-sm text-[var(--text-muted)]">
              {locale === 'ar' ? 'ترقبوا مقالات جديدة قريباً' : locale === 'en' ? 'Stay tuned for new articles soon' : 'Restez a l\'ecoute pour de nouveaux articles'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="card group hover:border-primary/25 transition-all"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {post.imageUrl && (
                    <div className="w-full sm:w-48 h-32 rounded-xl bg-[var(--bg-elevated)] overflow-hidden flex-shrink-0">
                      <img src={post.imageUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {getCategoryLabel(post.category)}
                      </span>
                      <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR')}
                      </span>
                    </div>
                    <h2 className="text-lg font-display font-bold mb-2 group-hover:text-primary transition-colors">
                      {getTitle(post)}
                    </h2>
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                      {getExcerpt(post)}
                    </p>
                    <div className="mt-3 text-xs text-primary font-medium flex items-center gap-1">
                      {locale === 'ar' ? 'اقرأ المزيد' : locale === 'en' ? 'Read more' : 'Lire la suite'}
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn btn-ghost btn-sm disabled:opacity-30"
            >
              {locale === 'ar' ? 'السابق' : locale === 'en' ? 'Previous' : 'Precedent'}
            </button>
            <span className="text-sm text-[var(--text-muted)]">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn btn-ghost btn-sm disabled:opacity-30"
            >
              {locale === 'ar' ? 'التالي' : locale === 'en' ? 'Next' : 'Suivant'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
