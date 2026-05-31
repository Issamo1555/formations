'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun, Moon, Globe, ArrowLeft, Loader2, Upload, FileText, CheckCircle, AlertCircle, HelpCircle, ChevronRight
} from 'lucide-react';
import { locales, localeNames } from '@/i18n';

interface Course {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  titleAr: string;
  modulesCount: number;
}

export default function AdminImportPage() {
  const { t, locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form states
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('fr');
  const [category, setCategory] = useState('');
  const [splittingStrategy, setSplittingStrategy] = useState('single');
  const [marker, setMarker] = useState('---');
  const [file, setFile] = useState<File | null>(null);

  // Status & Results
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [importedLessons, setImportedLessons] = useState<any[]>([]);

  // Preview state (client-side preview for text files)
  const [previewChunks, setPreviewChunks] = useState<string[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        
        // Casing and role safety check
        const isUserAdmin = meData.user?.role === 'ADMIN' || 
                            meData.user?.email === 'admin@smartcodai.com' || 
                            meData.user?.email === 'issamo1555@gmail.com';
                            
        if (!meData.user || !isUserAdmin) {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);

        const coursesRes = await fetch('/api/admin/courses');
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses || []);
        if (coursesData.courses && coursesData.courses.length > 0) {
          setSelectedCourse(coursesData.courses[0].slug);
        }
      } catch (err) {
        console.error('Failed to init page:', err);
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  // Generate preview when file, strategy, or marker changes
  useEffect(() => {
    if (!file) {
      setPreviewChunks([]);
      return;
    }

    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    const isTextFile = ['.txt', '.md', '.html', '.htm'].includes(extension);

    if (!isTextFile) {
      setPreviewChunks([]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      if (splittingStrategy === 'single') {
        setPreviewChunks([text.slice(0, 1000) + (text.length > 1000 ? '\n...' : '')]);
      } else if (splittingStrategy === 'marker' && marker) {
        const parts = text.split(marker);
        setPreviewChunks(parts.map(p => p.trim()).filter(Boolean).slice(0, 5));
      } else if (splittingStrategy === 'heading') {
        if (['.html', '.htm'].includes(extension)) {
          const headingRegex = /<h[1-3][^>]*>(.*?)<\/h[1-3]>/gi;
          const matches = [...text.matchAll(headingRegex)];
          if (matches.length > 0) {
            setPreviewChunks(matches.map(m => `Titre : ${m[1].replace(/<[^>]*>/g, '').trim()}`).slice(0, 5));
          } else {
            setPreviewChunks(['Aucun titre HTML <h1>/<h2>/<h3> trouvé pour le découpage. Le fichier sera traité en bloc unique.']);
          }
        } else {
          // Markdown headers
          const matches = text.match(/^#{1,3}\s+(.+)$/gm);
          if (matches) {
            setPreviewChunks(matches.map(m => m.trim()).slice(0, 5));
          } else {
            setPreviewChunks(['Aucun en-tête Markdown (#/##/###) trouvé pour le découpage. Le fichier sera traité en bloc unique.']);
          }
        }
      }
    };
    reader.readAsText(file);
  }, [file, splittingStrategy, marker]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setError('');
      setSuccessMessage('');
      setImportedLessons([]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Veuillez sélectionner un fichier.');
      return;
    }
    if (!selectedCourse) {
      setError('Veuillez sélectionner un cursus.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMessage('');
    setImportedLessons([]);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('courseSlug', selectedCourse);
    formData.append('language', selectedLanguage);
    formData.append('category', category.trim() || 'Général');
    formData.append('splittingStrategy', splittingStrategy);
    formData.append('marker', marker);

    try {
      const res = await fetch('/api/admin/courses/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de l'importation.");
        return;
      }

      setSuccessMessage(data.message);
      setImportedLessons(data.lessons || []);
      setFile(null);
      // Reset input element
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (err: any) {
      setError("Erreur de connexion lors de l'envoi du fichier.");
    } finally {
      setSubmitting(false);
    }
  };

  const getCourseTitle = (course: Course) => {
    if (locale === 'ar') return course.titleAr || course.titleFr;
    if (locale === 'en') return course.titleEn || course.titleFr;
    return course.titleFr;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) return null;

  const isBinaryFile = file && !['.txt', '.md', '.html', '.htm'].includes(file.name.slice(file.name.lastIndexOf('.')).toLowerCase());

  return (
    <div className="min-h-screen flex flex-col" dir={dir}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,var(--bg-pattern)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
            <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
            Retour à l'administration
          </Link>
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
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        <div className="mb-8">
          <h1 className="text-2xl font-display font-extrabold">Importateur de Cours</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            Alimentez vos cursus en téléchargeant directement des fichiers de cours et d'exercices.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card">
              <form onSubmit={handleUpload} className="space-y-5">
                {/* target course selection */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Cursus Cible
                  </label>
                  <select
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                    className="input cursor-pointer"
                    required
                  >
                    {courses.map((course) => (
                      <option key={course.id} value={course.slug}>
                        {getCourseTitle(course)} ({course.modulesCount} leçons)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Grid for language and category */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Langue d'Importation
                    </label>
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="input cursor-pointer"
                    >
                      <option value="fr">Français (fr)</option>
                      <option value="en">English (en)</option>
                      <option value="ar">العربية (ar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Catégorie des chapitres
                    </label>
                    <input
                      type="text"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      placeholder="Ex: Introduction, Bases, POO..."
                      className="input"
                    />
                  </div>
                </div>

                {/* Splitting Strategy */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Stratégie de Découpage du Document
                  </label>
                  <select
                    value={splittingStrategy}
                    onChange={(e) => setSplittingStrategy(e.target.value)}
                    className="input cursor-pointer"
                  >
                    <option value="single">Document entier (1 leçon unique)</option>
                    <option value="heading">Par titre (Créer une leçon à chaque grand titre # ou &lt;h1&gt;)</option>
                    <option value="marker">Par séparateur personnalisé (Créer une leçon à chaque marqueur)</option>
                  </select>
                </div>

                {/* Custom Marker field */}
                {splittingStrategy === 'marker' && (
                  <div className="animate-in fade-in slide-in-from-top-1 duration-250">
                    <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                      Séparateur personnalisé
                    </label>
                    <input
                      type="text"
                      value={marker}
                      onChange={(e) => setMarker(e.target.value)}
                      placeholder="Ex: --- ou [CHAPITRE]"
                      className="input"
                      required
                    />
                    <p className="text-[10px] text-[var(--text-muted)] mt-1.5 leading-relaxed">
                      Le document sera divisé en chapitres distincts chaque fois que cette chaîne de caractères exacte est rencontrée.
                    </p>
                  </div>
                )}

                {/* File Upload Zone */}
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2">
                    Fichier de cours / exercices
                  </label>
                  <div className="border-2 border-dashed border-border hover:border-primary/50 transition-colors rounded-2xl p-8 text-center bg-white/[0.01] relative cursor-pointer group">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept=".html,.htm,.pdf,.docx,.txt,.md"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      required
                    />
                    <Upload className="w-8 h-8 text-[var(--text-muted)] group-hover:text-primary transition-colors mx-auto mb-3" />
                    <span className="block text-sm font-semibold text-[var(--text-main)] mb-1">
                      {file ? file.name : "Cliquez ou glissez-déposez votre document"}
                    </span>
                    <span className="block text-xs text-[var(--text-muted)]">
                      Formats acceptés : HTML, PDF, Word (.docx), Markdown (.md), Texte (.txt)
                    </span>
                    {file && (
                      <span className="inline-block mt-3 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-semibold">
                        {(file.size / 1024).toFixed(1)} Ko
                      </span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !file}
                  className="btn btn-primary w-full justify-center py-3 rounded-xl font-semibold shadow-lg shadow-primary/20"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin mr-2" />
                      Analyse et importation en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Lancer l'importation
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Client-side text preview */}
            {file && (
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    Aperçu du découpage
                  </h3>
                  <button
                    onClick={() => setShowPreview(!showPreview)}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    {showPreview ? "Masquer" : "Afficher"}
                  </button>
                </div>

                {showPreview && (
                  <div className="space-y-3 max-h-96 overflow-y-auto pr-1 animate-in fade-in duration-350">
                    {isBinaryFile ? (
                      <div className="p-4 rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-500 text-xs flex items-start gap-2">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Format binaire détecté ({file.name.slice(file.name.lastIndexOf('.'))}) :</strong> L'aperçu textuel client n'est pas disponible pour les fichiers Word ou PDF. Le fichier sera envoyé directement au serveur pour analyse et conversion.
                        </span>
                      </div>
                    ) : previewChunks.length === 0 ? (
                      <p className="text-xs text-[var(--text-muted)] italic">Aperçu vide ou fichier incompréhensible.</p>
                    ) : (
                      previewChunks.map((chunk, idx) => (
                        <div key={idx} className="p-3 border rounded-xl bg-white/[0.01]">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
                              Chapitre Candidate #{idx + 1}
                            </span>
                            <span className="text-[10px] text-[var(--text-muted)]">
                              ~{chunk.length} caractères
                            </span>
                          </div>
                          <pre className="text-xs font-mono text-[var(--text-muted)] max-h-32 overflow-y-auto whitespace-pre-wrap bg-black/15 p-2 rounded-lg leading-relaxed">
                            {chunk}
                          </pre>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Guidelines sidebar */}
          <div className="space-y-6">
            {/* Status alerts */}
            {error && (
              <div className="card border-red-500/30 bg-red-500/8 text-red-400 p-5 flex items-start gap-3.5 animate-in shake duration-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Échec de l'importation</h4>
                  <p className="text-xs mt-1 leading-relaxed">{error}</p>
                </div>
              </div>
            )}

            {successMessage && (
              <div className="card border-primary/30 bg-primary/8 text-primary p-5 flex items-start gap-3.5 animate-in fade-in duration-300">
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Importation réussie !</h4>
                  <p className="text-xs mt-1 leading-relaxed">{successMessage}</p>
                  
                  {importedLessons.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary/70">Leçons créées :</span>
                      <ul className="text-xs space-y-1.5">
                        {importedLessons.map((l, i) => (
                          <li key={l.id} className="flex items-center gap-2">
                            <ChevronRight className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="truncate max-w-[200px]" title={l.title}>
                              {l.order}. {l.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Instruction manual */}
            <div className="card">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-primary" />
                <h3 className="font-display font-bold text-sm">Guide d'Importation</h3>
              </div>
              <ul className="space-y-3.5 text-xs text-[var(--text-muted)] leading-relaxed">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">1</span>
                  <span>
                    <strong>Structurez votre document :</strong> Si vous choisissez le découpage par titres, veillez à utiliser des balises de titres (ex: <code>&lt;h2&gt;</code>) ou des symboles Markdown (ex: <code>## Titre</code>) pour identifier le début de chaque chapitre.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">2</span>
                  <span>
                    <strong>Découpage par séparateur :</strong> Insérez une ligne spécifique (ex: <code>---</code>) entre vos chapitres et configurez cette même chaîne comme séparateur. Le premier paragraphe de chaque bloc sera extrait comme titre.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">3</span>
                  <span>
                    <strong>Contenu bilingue :</strong> Les leçons créées dupliquent le contenu importé dans les champs de toutes les langues (Français, Anglais, Arabe) pour éviter les crashs d'affichage, vous pourrez éditer les traductions manuellement par la suite.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
