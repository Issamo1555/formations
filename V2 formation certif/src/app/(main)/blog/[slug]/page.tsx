'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Globe, ArrowLeft, Calendar, Tag, Share2, Loader2 } from 'lucide-react';
import { locales, localeNames } from '@/i18n';

export default function BlogPostPage() {
  const { locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog/${slug}`);
        const data = await res.json();
        if (!data.post) {
          router.push('/blog');
          return;
        }
        setPost(data.post);
      } catch {
        router.push('/blog');
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug, router]);

  const getContent = () => {
    if (!post) return '';
    if (locale === 'ar') return post.contentAr || post.contentFr;
    if (locale === 'en') return post.contentEn || post.contentFr;
    return post.contentFr;
  };

  const getTitle = () => {
    if (!post) return '';
    if (locale === 'ar') return post.titleAr || post.titleFr;
    if (locale === 'en') return post.titleEn || post.titleFr;
    return post.titleFr;
  };

  const handleShare = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${slug}`;
    if (navigator.share) {
      navigator.share({ title: getTitle(), url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  // Simple markdown-like rendering
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, i) => {
      if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold mt-6 mb-3">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-display font-bold mt-8 mb-4">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-display font-bold mt-8 mb-4">{line.slice(2)}</h1>;
      if (line.startsWith('- ')) return <li key={i} className="ml-4 text-[var(--text-muted)]">{line.slice(2)}</li>;
      if (line.startsWith('```')) return null;
      if (line.trim() === '') return <br key={i} />;
      if (line.startsWith('**') && line.endsWith('**')) return <p key={i} className="font-bold text-[var(--text-main)] my-2">{line.slice(2, -2)}</p>;
      return <p key={i} className="text-[var(--text-muted)] leading-relaxed">{line}</p>;
    });
  };

  return (
    <div className="min-h-screen" dir={dir}>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/blog" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
            <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            {locale === 'ar' ? 'العودة للمدونة' : locale === 'en' ? 'Back to Blog' : 'Retour au blog'}
          </Link>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="w-10 h-10 rounded-xl border border-border bg-white/5 flex items-center justify-center hover:border-primary/30 hover:bg-primary/10 transition-all">
              <Share2 className="w-4 h-4" />
            </button>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
              {post.category}
            </span>
            <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-extrabold mb-4">
            {getTitle()}
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white font-display font-bold text-sm">
              {post.author?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) || 'SC'}
            </div>
            <div>
              <div className="text-sm font-semibold">{post.author?.name || 'Smartcodai'}</div>
              <div className="text-xs text-[var(--text-muted)]">
                {locale === 'ar' ? 'فريق Smartcodai' : locale === 'en' ? 'Smartcodai Team' : 'Equipe Smartcodai'}
              </div>
            </div>
          </div>
        </div>

        {/* Featured image */}
        {post.imageUrl && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={post.imageUrl} alt={getTitle()} className="w-full h-64 sm:h-80 object-cover" />
          </div>
        )}

        {/* Article content */}
        <article className="prose prose-invert max-w-none">
          {renderContent(getContent())}
        </article>

        {/* Share */}
        <div className="mt-12 pt-6 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-muted)]">
              {locale === 'ar' ? 'مشاركة هذا المقال' : locale === 'en' ? 'Share this article' : 'Partager cet article'}
            </span>
            <button onClick={handleShare} className="btn btn-ghost btn-sm">
              <Share2 className="w-4 h-4" />
              {locale === 'ar' ? 'مشاركة' : locale === 'en' ? 'Share' : 'Partager'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
