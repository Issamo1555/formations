'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun, Moon, Globe, ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff,
  Loader2, Save, X, FileText, Calendar, Tag
} from 'lucide-react';
import { locales, localeNames } from '@/i18n';

const CATEGORIES = [
  { value: 'news', label: { fr: 'Nouveautes', en: 'News', ar: 'اخبار' } },
  { value: 'tutorial', label: { fr: 'Tutoriels', en: 'Tutorials', ar: 'دروس' } },
  { value: 'update', label: { fr: 'Mises a jour', en: 'Updates', ar: 'تحديثات' } },
];

export default function AdminBlogPage() {
  const { locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Form state
  const [slug, setSlug] = useState('');
  const [titleFr, setTitleFr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [contentFr, setContentFr] = useState('');
  const [contentEn, setContentEn] = useState('');
  const [contentAr, setContentAr] = useState('');
  const [excerptFr, setExcerptFr] = useState('');
  const [category, setCategory] = useState('news');
  const [isPublished, setIsPublished] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user || data.user.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        fetchPosts();
      } catch {
        router.push('/login');
      }
    }
    init();
  }, [router]);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch('/api/blog?limit=100');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch {
      setPosts([]);
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setSlug('');
    setTitleFr('');
    setTitleEn('');
    setTitleAr('');
    setContentFr('');
    setContentEn('');
    setContentAr('');
    setExcerptFr('');
    setCategory('news');
    setIsPublished(false);
    setImageUrl('');
    setFormError('');
    setEditing(null);
  }

  function openCreate() {
    resetForm();
    setShowForm(true);
  }

  function openEdit(post: any) {
    setEditing(post);
    setSlug(post.slug);
    setTitleFr(post.titleFr);
    setTitleEn(post.titleEn || '');
    setTitleAr(post.titleAr || '');
    setContentFr(post.contentFr);
    setContentEn(post.contentEn || '');
    setContentAr(post.contentAr || '');
    setExcerptFr(post.excerptFr || '');
    setCategory(post.category);
    setIsPublished(post.isPublished);
    setImageUrl(post.imageUrl || '');
    setFormError('');
    setShowForm(true);
  }

  async function handleSave(publishOverride?: boolean) {
    setFormError('');
    if (!slug || !titleFr || !contentFr) {
      setFormError('Slug, titre FR et contenu FR sont requis.');
      return;
    }

    setSaving(true);
    try {
      const url = editing ? `/api/blog/${editing.slug}` : '/api/blog';
      const method = editing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          titleFr,
          titleEn: titleEn || titleFr,
          titleAr: titleAr || titleFr,
          contentFr,
          contentEn: contentEn || contentFr,
          contentAr: contentAr || contentFr,
          excerptFr,
          category,
          isPublished: publishOverride !== undefined ? publishOverride : isPublished,
          imageUrl,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setFormError(data.error || 'Erreur lors de la sauvegarde.');
        return;
      }

      setShowForm(false);
      resetForm();
      fetchPosts();
    } catch {
      setFormError('Erreur de connexion.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Supprimer cet article ?')) return;
    setDeleting(slug);
    try {
      await fetch(`/api/blog/${slug}`, { method: 'DELETE' });
      fetchPosts();
    } catch {
      alert('Erreur lors de la suppression.');
    } finally {
      setDeleting(null);
    }
  }

  async function togglePublish(post: any) {
    try {
      await fetch(`/api/blog/${post.slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !post.isPublished }),
      });
      fetchPosts();
    } catch {
      alert('Erreur lors de la mise a jour.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir={dir}>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
              <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {locale === 'ar' ? 'العودة للإدارة' : locale === 'en' ? 'Back to Admin' : 'Retour a l\'admin'}
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-extrabold">
              {locale === 'ar' ? 'إدارة المدونة' : locale === 'en' ? 'Blog Management' : 'Gestion du Blog'}
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              {posts.length} {locale === 'ar' ? 'مقال' : locale === 'en' ? 'articles' : 'articles'}
              {' · '}
              {posts.filter(p => p.isPublished).length} {locale === 'ar' ? 'منشور' : locale === 'en' ? 'published' : 'publies'}
            </p>
          </div>
          <button onClick={openCreate} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            {locale === 'ar' ? 'مقال جديد' : locale === 'en' ? 'New Article' : 'Nouvel article'}
          </button>
        </div>

        {/* Posts list */}
        <div className="card overflow-hidden p-0">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                  {locale === 'ar' ? 'المقال' : locale === 'en' ? 'Article' : 'Article'}
                </th>
                <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                  {locale === 'ar' ? 'الفئة' : locale === 'en' ? 'Category' : 'Categorie'}
                </th>
                <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                  {locale === 'ar' ? 'الحالة' : locale === 'en' ? 'Status' : 'Statut'}
                </th>
                <th className="text-left text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                  {locale === 'ar' ? 'التاريخ' : locale === 'en' ? 'Date' : 'Date'}
                </th>
                <th className="text-right text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-5 py-3">
                  {locale === 'ar' ? 'إجراءات' : locale === 'en' ? 'Actions' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-[var(--text-muted)]">
                    <FileText className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    {locale === 'ar' ? 'لا توجد مقالات بعد' : locale === 'en' ? 'No articles yet' : 'Aucun article pour le moment'}
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="border-b border-border hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-sm">{post.titleFr}</div>
                      <div className="text-xs text-[var(--text-muted)] font-mono">{post.slug}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                        {CATEGORIES.find(c => c.value === post.category)?.label[locale as keyof typeof CATEGORIES[0]['label']] || post.category}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => togglePublish(post)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all ${
                          post.isPublished
                            ? 'bg-green-500/15 text-green-500 border border-green-500/25'
                            : 'bg-amber-500/15 text-amber-500 border border-amber-500/25'
                        }`}
                      >
                        {post.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                        {post.isPublished
                          ? (locale === 'ar' ? 'منشور' : locale === 'en' ? 'Published' : 'Publie')
                          : (locale === 'ar' ? 'مسودة' : locale === 'en' ? 'Draft' : 'Brouillon')}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-xs text-[var(--text-muted)]">
                      {new Date(post.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR')}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/blog/${post.slug}`} target="_blank" className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-[var(--text-muted)] hover:text-primary hover:border-primary/30 transition-all">
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button onClick={() => openEdit(post)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-[var(--text-muted)] hover:text-blue-400 hover:border-blue-400/30 transition-all">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(post.slug)}
                          disabled={deleting === post.slug}
                          className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-[var(--text-muted)] hover:text-red-400 hover:border-red-400/30 transition-all disabled:opacity-50"
                        >
                          {deleting === post.slug ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create/Edit modal */}
        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <div className="relative bg-[var(--bg-panel)] border border-border rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-elevated">
              <div className="sticky top-0 bg-[var(--bg-panel)] border-b border-border px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
                <h2 className="text-lg font-display font-bold">
                  {editing
                    ? (locale === 'ar' ? 'تعديل المقال' : locale === 'en' ? 'Edit Article' : 'Modifier l\'article')
                    : (locale === 'ar' ? 'مقال جديد' : locale === 'en' ? 'New Article' : 'Nouvel article')}
                </h2>
                <button onClick={() => setShowForm(false)} className="w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-white/5 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                {formError && (
                  <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{formError}</div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Slug *</label>
                    <input value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} className="input" placeholder="mon-article" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      {locale === 'ar' ? 'الفئة' : locale === 'en' ? 'Category' : 'Categorie'}
                    </label>
                    <select value={category} onChange={e => setCategory(e.target.value)} className="input">
                      {CATEGORIES.map(c => (
                        <option key={c.value} value={c.value}>{c.label[locale as keyof typeof c.label] || c.label.fr}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Titre FR *</label>
                  <input value={titleFr} onChange={e => setTitleFr(e.target.value)} className="input" placeholder="Titre en francais" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Titre EN</label>
                    <input value={titleEn} onChange={e => setTitleEn(e.target.value)} className="input" placeholder="Title in English" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Titre AR</label>
                    <input value={titleAr} onChange={e => setTitleAr(e.target.value)} className="input" placeholder="العنوان بالعربية" dir="rtl" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Excerpt FR</label>
                  <input value={excerptFr} onChange={e => setExcerptFr(e.target.value)} className="input" placeholder="Court resume de l'article" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Image URL</label>
                  <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} className="input" placeholder="https://..." />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contenu FR *</label>
                  <textarea value={contentFr} onChange={e => setContentFr(e.target.value)} className="input min-h-[200px]" placeholder="Contenu de l'article (markdown simple)" rows={8} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contenu EN</label>
                    <textarea value={contentEn} onChange={e => setContentEn(e.target.value)} className="input min-h-[150px]" placeholder="Content in English" rows={6} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">Contenu AR</label>
                    <textarea value={contentAr} onChange={e => setContentAr(e.target.value)} className="input min-h-[150px]" placeholder="المحتوى بالعربية" rows={6} dir="rtl" />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="w-4 h-4 rounded" />
                    <span className="text-sm font-medium">
                      {locale === 'ar' ? 'نشر الآن' : locale === 'en' ? 'Publish now' : 'Publier maintenant'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="sticky bottom-0 bg-[var(--bg-panel)] border-t border-border px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setShowForm(false)} className="btn btn-ghost">
                  {locale === 'ar' ? 'إلغاء' : locale === 'en' ? 'Cancel' : 'Annuler'}
                </button>
                <button onClick={() => handleSave(false)} className="btn btn-ghost" disabled={saving}>
                  <Save className="w-4 h-4" />
                  {locale === 'ar' ? 'حفظ كمسودة' : locale === 'en' ? 'Save Draft' : 'Sauvegarder brouillon'}
                </button>
                <button onClick={() => handleSave(true)} className="btn btn-primary" disabled={saving}>
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {editing
                    ? (locale === 'ar' ? 'تحديث' : locale === 'en' ? 'Update' : 'Mettre a jour')
                    : (locale === 'ar' ? 'نشر' : locale === 'en' ? 'Publish' : 'Publier')}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
