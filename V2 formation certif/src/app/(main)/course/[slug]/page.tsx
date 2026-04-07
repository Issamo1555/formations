'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun, Moon, Globe, Menu, X, ArrowLeft, ArrowRight,
  CheckCircle, Circle, Lock, Award, LayoutDashboard
} from 'lucide-react';
import { locales, localeNames } from '@/i18n';

interface Lesson {
  id: string;
  order: number;
  titleFr: string;
  titleEn: string;
  titleAr: string;
  contentFr: string;
  contentEn: string;
  contentAr: string;
  category: string;
  hasQuiz: boolean;
  quizQuestionFr: string | null;
  quizQuestionEn: string | null;
  quizQuestionAr: string | null;
  quizOption1Fr: string | null;
  quizOption1En: string | null;
  quizOption1Ar: string | null;
  quizOption2Fr: string | null;
  quizOption2En: string | null;
  quizOption2Ar: string | null;
  quizOption3Fr: string | null;
  quizOption3En: string | null;
  quizOption3Ar: string | null;
  quizOption4Fr: string | null;
  quizOption4En: string | null;
  quizOption4Ar: string | null;
  quizCorrect: number | null;
  quizExplainFr: string | null;
  quizExplainEn: string | null;
  quizExplainAr: string | null;
}

interface Course {
  id: string;
  slug: string;
  titleFr: string;
  titleEn: string;
  titleAr: string;
  modulesCount: number;
  lessons: Lesson[];
}

const COURSE_ICONS: Record<string, string> = {
  php: '💻',
  python: '🐍',
  n8n: '⚡',
  openclaw: '🤖',
};

export default function CoursePage() {
  const { t, locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [sandboxCode, setSandboxCode] = useState('');
  const [sandboxOutput, setSandboxOutput] = useState('');

  useEffect(() => {
    async function init() {
      try {
        // Check auth
        const meRes = await fetch('/api/auth/me');
        const meData = await meRes.json();
        if (!meData.user) {
          router.push(`/login?redirect=/course/${slug}`);
          return;
        }

        // Check if course is unlocked
        const isUnlocked = meData.user.role === 'ADMIN' ||
          meData.user.unlockedCourses?.some((uc: any) => uc.course.slug === slug);

        if (!isUnlocked) {
          router.push('/dashboard');
          return;
        }

        // Fetch course from API
        const courseRes = await fetch(`/api/courses/${slug}`);
        const courseData = await courseRes.json();

        if (!courseData.course) {
          router.push('/dashboard');
          return;
        }

        setCourse(courseData.course);

        // Load progress from DB
        const progressRes = await fetch(`/api/progress?course=${slug}`);
        const progressData = await progressRes.json();
        if (progressData.completedLessonIds) {
          setCompletedLessons(new Set(progressData.completedLessonIds));
        }
      } catch {
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [slug, router]);

  // Reset quiz state when lesson changes
  useEffect(() => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
  }, [currentLessonIndex]);

  const currentLesson = course?.lessons[currentLessonIndex];

  const markComplete = async () => {
    if (!currentLesson || !course) return;
    const newCompleted = new Set(completedLessons);
    newCompleted.add(currentLesson.id);
    setCompletedLessons(newCompleted);

    // Save to DB
    try {
      await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lessonId: currentLesson.id,
          courseId: course.id,
        }),
      });
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  const progress = course ? Math.round((completedLessons.size / course.lessons.length) * 100) : 0;

  const getTitle = (lesson: Lesson) => {
    if (locale === 'ar') return lesson.titleAr || lesson.titleFr;
    if (locale === 'en') return lesson.titleEn || lesson.titleFr;
    return lesson.titleFr;
  };

  const getContent = (lesson: Lesson) => {
    if (locale === 'ar') return lesson.contentAr || lesson.contentFr;
    if (locale === 'en') return lesson.contentEn || lesson.contentFr;
    return lesson.contentFr;
  };

  const getCourseTitle = () => {
    if (!course) return '';
    if (locale === 'ar') return course.titleAr || course.titleFr;
    if (locale === 'en') return course.titleEn || course.titleFr;
    return course.titleFr;
  };

  const getQuizQuestion = () => {
    if (!currentLesson) return '';
    if (locale === 'ar') return currentLesson.quizQuestionAr || currentLesson.quizQuestionFr || '';
    if (locale === 'en') return currentLesson.quizQuestionEn || currentLesson.quizQuestionFr || '';
    return currentLesson.quizQuestionFr || '';
  };

  const getQuizOptions = (): string[] => {
    if (!currentLesson) return [];
    const suffix = locale === 'ar' ? 'Ar' : locale === 'en' ? 'En' : 'Fr';
    return [
      (currentLesson as any)[`quizOption1${suffix}`] || (currentLesson as any)[`quizOption1Fr`] || '',
      (currentLesson as any)[`quizOption2${suffix}`] || (currentLesson as any)[`quizOption2Fr`] || '',
      (currentLesson as any)[`quizOption3${suffix}`] || (currentLesson as any)[`quizOption3Fr`] || '',
      (currentLesson as any)[`quizOption4${suffix}`] || (currentLesson as any)[`quizOption4Fr`] || '',
    ];
  };

  const getQuizExplain = () => {
    if (!currentLesson) return '';
    if (locale === 'ar') return currentLesson.quizExplainAr || currentLesson.quizExplainFr || '';
    if (locale === 'en') return currentLesson.quizExplainEn || currentLesson.quizExplainFr || '';
    return currentLesson.quizExplainFr || '';
  };

  // Render content with code blocks
  const renderContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = '';

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          elements.push(
            <div key={`code-${i}`} className="relative mt-4 mb-4">
              <div className="flex items-center justify-between px-4 py-2 rounded-t-lg border-b" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border-light)' }}>
                <span className="text-xs font-semibold text-primary">{codeLang || 'code'}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeLines.join('\n'))}
                  className="text-xs text-[var(--text-muted)] hover:text-primary transition-colors"
                >
                  {locale === 'ar' ? 'نسخ' : locale === 'en' ? 'Copy' : 'Copier'}
                </button>
              </div>
              <pre className="p-4 rounded-b-lg overflow-x-auto font-mono text-sm" style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-main)' }}>
                <code>{codeLines.join('\n')}</code>
              </pre>
            </div>
          );
          codeLines = [];
          inCodeBlock = false;
        } else {
          // Start of code block
          inCodeBlock = true;
          codeLang = line.slice(3).trim();
        }
        return;
      }

      if (inCodeBlock) {
        codeLines.push(line);
        return;
      }

      if (line.startsWith('### ')) {
        elements.push(<h3 key={i} className="text-lg font-semibold mt-6 mb-2">{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        elements.push(<h2 key={i} className="text-xl font-display font-bold mt-6 mb-3">{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        elements.push(<h1 key={i} className="text-2xl font-display font-bold mt-6 mb-3">{line.slice(2)}</h1>);
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\* — (.+)/);
        if (match) {
          elements.push(<li key={i} className="text-[var(--text-muted)] ml-4"><strong>{match[1]}</strong> — {match[2]}</li>);
        } else {
          elements.push(<li key={i} className="text-[var(--text-muted)] ml-4">{line.slice(2)}</li>);
        }
      } else if (line.startsWith('- ')) {
        elements.push(<li key={i} className="text-[var(--text-muted)] ml-4">{line.slice(2)}</li>);
      } else if (line.trim() === '') {
        elements.push(<br key={i} />);
      } else {
        elements.push(<p key={i} className="text-[var(--text-muted)] leading-relaxed">{line}</p>);
      }
    });

    return elements;
  };

  // Sandbox functions
  const getDefaultSandbox = (lesson: Lesson) => {
    const content = getContent(lesson);
    const codeMatch = content.match(/```(?:php|python|javascript|js)?\n([\s\S]*?)```/);
    if (codeMatch) return codeMatch[1].trim();
    return '';
  };

  const runSandbox = () => {
    // Simple JS evaluation for demo purposes
    try {
      // For PHP/Python lessons, show a simulated output
      const isPHP = sandboxCode.includes('<?php') || sandboxCode.includes('echo') || sandboxCode.includes('$');
      const isPython = sandboxCode.includes('print(') || sandboxCode.includes('def ') || sandboxCode.includes('#');

      if (isPHP) {
        // Simulate PHP output
        const echoMatches = sandboxCode.match(/echo\s+["'](.+?)["']/g);
        if (echoMatches) {
          const output = echoMatches.map(m => m.replace(/echo\s+["']|["']/g, '')).join('\n');
          setSandboxOutput(output);
        } else {
          setSandboxOutput('(Code PHP execute avec succes - resultat simule)');
        }
      } else if (isPython) {
        // Simulate Python output
        const printMatches = sandboxCode.match(/print\(["'](.+?)["']\)/g);
        if (printMatches) {
          const output = printMatches.map(m => m.replace(/print\(["']|["']\)/g, '')).join('\n');
          setSandboxOutput(output);
        } else {
          setSandboxOutput('(Code Python execute avec succes - resultat simule)');
        }
      } else {
        // Try as JavaScript
        const result = eval(sandboxCode);
        setSandboxOutput(String(result));
      }
    } catch (e: any) {
      setSandboxOutput(`Erreur: ${e.message}`);
    }
  };

  // Reset sandbox when lesson changes
  useEffect(() => {
    if (currentLesson) {
      setSandboxCode(getDefaultSandbox(currentLesson));
      setSandboxOutput('');
    }
  }, [currentLessonIndex]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-[var(--text-muted)]">{t('common.loading')}</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display font-bold mb-4">Cours introuvable</h1>
          <Link href="/dashboard" className="btn btn-primary">{t('course.backToDashboard')}</Link>
        </div>
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
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar - Lesson list */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-72 bg-[var(--bg-panel)] border-r border-border flex flex-col z-50 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
              <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              {t('course.backToDashboard')}
            </Link>
            <button className="lg:hidden w-8 h-8 rounded-lg border border-border flex items-center justify-center" onClick={() => setSidebarOpen(false)}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <h2 className="font-display font-bold text-sm truncate">{getCourseTitle()}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="progress flex-1"><span style={{ width: `${progress}%` }} /></div>
            <span className="text-xs text-[var(--text-muted)] font-semibold">{progress}%</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {course.lessons.map((lesson, i) => {
            const isCompleted = completedLessons.has(lesson.id);
            const isCurrent = i === currentLessonIndex;
            return (
              <button
                key={lesson.id}
                onClick={() => { setCurrentLessonIndex(i); setSidebarOpen(false); }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition-all flex items-center gap-3 ${
                  isCurrent
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-[var(--text-muted)] hover:bg-white/5'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="truncate">{getTitle(lesson)}</div>
                  <div className="text-[10px] opacity-60">{lesson.category}</div>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:border-primary/30 transition-all">
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="relative group ml-auto">
              <button className="flex items-center gap-1 text-xs text-[var(--text-muted)] px-2 py-1.5 rounded-lg hover:bg-white/5">
                <Globe className="w-3.5 h-3.5" />
                {localeNames[locale]}
              </button>
              <div className="absolute right-0 bottom-full mb-2 w-32 bg-[var(--bg-panel)] border border-border rounded-xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                {locales.map((l) => (
                  <button key={l} onClick={() => setLocale(l)} className={`w-full text-left px-3 py-2 text-xs hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl ${l === locale ? 'text-primary font-semibold' : 'text-[var(--text-muted)]'}`}>
                    {localeNames[l]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
          <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button className="lg:hidden w-10 h-10 rounded-xl border border-border flex items-center justify-center" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-sm font-semibold">{currentLesson ? getTitle(currentLesson) : ''}</h1>
                <p className="text-xs text-[var(--text-muted)]">
                  {t('course.lesson')} {currentLessonIndex + 1} {t('course.of')} {course.lessons.length}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Lesson content */}
        <div className="px-4 sm:px-8 lg:px-12 py-8 max-w-4xl">
          {currentLesson && (
            <>
              <div className="mb-6">
                <span className="badge bg-primary/10 text-primary border border-primary/20 text-xs">
                  {currentLesson.category}
                </span>
                {currentLesson.hasQuiz && (
                  <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs ml-2">
                    {t('course.quiz')}
                  </span>
                )}
              </div>

              {/* Render markdown-like content */}
              <div className="space-y-4">
                {renderContent(getContent(currentLesson))}
              </div>

              {/* Sandbox / Exercise Section */}
              <div className="mt-8 bg-[var(--bg-elevated)] border border-border rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <span className="text-lg">💻</span>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-sm">
                        {locale === 'ar' ? ' Sandbox - Essayez le code' : locale === 'en' ? 'Sandbox - Try the code' : 'Bac a sable - Essayez le code'}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)]">
                        {locale === 'ar' ? 'Modifiez et executez le code' : locale === 'en' ? 'Modify and run the code' : 'Modifiez et executez le code'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSandboxCode(getDefaultSandbox(currentLesson))}
                    className="btn btn-ghost btn-sm"
                  >
                    {locale === 'ar' ? 'إعادة تعيين' : locale === 'en' ? 'Reset' : 'Reinitialiser'}
                  </button>
                </div>
                <div className="p-4">
                  <textarea
                    value={sandboxCode}
                    onChange={(e) => setSandboxCode(e.target.value)}
                    className="w-full h-48 bg-[var(--bg-base)] border border-border rounded-xl p-4 font-mono text-sm text-[var(--text-main)] resize-none focus:outline-none focus:border-primary"
                    spellCheck={false}
                  />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-muted)]">
                      {locale === 'ar' ? 'النتيجة:' : locale === 'en' ? 'Output:' : 'Resultat :'}
                    </span>
                    <button
                      onClick={runSandbox}
                      className="btn btn-primary btn-sm"
                    >
                      ▶ {locale === 'ar' ? 'تشغيل' : locale === 'en' ? 'Run' : 'Executer'}
                    </button>
                  </div>
                  {sandboxOutput && (
                    <div className="mt-3 bg-[var(--bg-base)] border border-border rounded-xl p-4 font-mono text-sm whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>
                      {sandboxOutput}
                    </div>
                  )}
                </div>
              </div>

              {/* Quiz Section */}
              {currentLesson.hasQuiz && currentLesson.quizCorrect !== null && (
                <div className="mt-8 bg-[var(--bg-elevated)] border border-border rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center">
                      <span className="text-lg">❓</span>
                    </div>
                    <h3 className="font-display font-bold">{t('course.quiz')}</h3>
                  </div>

                  <p className="text-sm font-medium mb-4">{getQuizQuestion()}</p>

                  <div className="space-y-2 mb-4">
                    {getQuizOptions().map((option, i) => {
                      const isCorrect = i === currentLesson.quizCorrect;
                      const isSelected = quizAnswer === i;
                      let optionStyle = 'bg-white/5 border-border hover:bg-white/10';

                      if (quizSubmitted) {
                        if (isCorrect) {
                          optionStyle = 'bg-primary/15 border-primary/40 text-primary';
                        } else if (isSelected && !isCorrect) {
                          optionStyle = 'bg-red-500/15 border-red-500/40 text-red-400';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-primary/10 border-primary/30';
                      }

                      return (
                        <button
                          key={i}
                          onClick={() => !quizSubmitted && setQuizAnswer(i)}
                          disabled={quizSubmitted}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm transition-all ${optionStyle} ${
                            quizSubmitted ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              quizSubmitted && isCorrect
                                ? 'border-primary bg-primary text-gray-900'
                                : quizSubmitted && isSelected && !isCorrect
                                ? 'border-red-400 bg-red-400 text-white'
                                : isSelected
                                ? 'border-primary'
                                : 'border-border'
                            }`}>
                              {quizSubmitted && isCorrect && <span className="text-xs">✓</span>}
                              {quizSubmitted && isSelected && !isCorrect && <span className="text-xs">✗</span>}
                              {!quizSubmitted && (
                                <span className="text-xs text-[var(--text-muted)]">{String.fromCharCode(65 + i)}</span>
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={async () => {
                        if (quizAnswer !== null) {
                          setQuizSubmitted(true);
                          // Save quiz result to DB
                          if (course && currentLesson) {
                            try {
                              await fetch('/api/progress', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                  lessonId: currentLesson.id,
                                  courseId: course.id,
                                  quizAnswer,
                                  quizCorrect: currentLesson.quizCorrect,
                                }),
                              });
                            } catch (e) {
                              console.error('Failed to save quiz:', e);
                            }
                          }
                        }
                      }}
                      disabled={quizAnswer === null}
                      className="btn btn-primary btn-sm disabled:opacity-30"
                    >
                      {t('course.submit')}
                    </button>
                  ) : (
                    <div className={`p-4 rounded-xl ${
                      quizAnswer === currentLesson.quizCorrect
                        ? 'bg-primary/10 border border-primary/25'
                        : 'bg-red-500/10 border border-red-500/25'
                    }`}>
                      <div className="font-semibold text-sm mb-1">
                        {quizAnswer === currentLesson.quizCorrect
                          ? `✅ ${t('course.correct')}`
                          : `❌ ${t('course.incorrect')}`}
                      </div>
                      <p className="text-xs text-[var(--text-muted)]">{getQuizExplain()}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="mt-10 flex items-center justify-between pt-6 border-t border-border">
                <button
                  onClick={() => setCurrentLessonIndex(Math.max(0, currentLessonIndex - 1))}
                  disabled={currentLessonIndex === 0}
                  className="btn btn-ghost btn-sm disabled:opacity-30"
                >
                  <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                  {t('course.previous')}
                </button>

                <button
                  onClick={markComplete}
                  className={`btn btn-sm ${completedLessons.has(currentLesson.id) ? 'bg-primary/15 text-primary border border-primary/25' : 'bg-white/5 border border-border text-[var(--text-muted)]'}`}
                >
                  {completedLessons.has(currentLesson.id) ? (
                    <><CheckCircle className="w-4 h-4" /> {t('course.correct')}</>
                  ) : (
                    <><Circle className="w-4 h-4" /> Marquer comme termine</>
                  )}
                </button>

                <button
                  onClick={() => {
                    if (currentLessonIndex < course.lessons.length - 1) {
                      setCurrentLessonIndex(currentLessonIndex + 1);
                    }
                  }}
                  disabled={currentLessonIndex >= course.lessons.length - 1}
                  className="btn btn-primary btn-sm disabled:opacity-30"
                >
                  {t('course.next')}
                  <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Completion banner */}
              {progress === 100 && (
                <div className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6 text-center">
                  <Award className="w-12 h-12 text-primary mx-auto mb-3" />
                  <h3 className="text-xl font-display font-bold mb-2">{t('course.certificate.congrats')}</h3>
                  <p className="text-sm text-[var(--text-muted)] mb-4">{getCourseTitle()}</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <Link href={`/certificate/${slug}`} className="btn btn-primary btn-sm">
                      <Award className="w-4 h-4" />
                      {locale === 'ar' ? 'الحصول على الشهادة' : locale === 'en' ? 'Get Certificate' : 'Obtenir le certificat'}
                    </Link>
                    <button className="btn btn-ghost btn-sm">{t('course.certificate.shareLinkedin')}</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
