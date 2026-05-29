'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import {
  Sun, Moon, Globe, Menu, X, ArrowLeft, ArrowRight,
  CheckCircle, Circle, Lock, Award, LayoutDashboard,
  Terminal, HelpCircle, Trophy, Play, BookOpen, XCircle
} from 'lucide-react';
import { locales, localeNames } from '@/i18n';
import CodeBlock from '@/components/CodeBlock';
import CodeEditor from '@/components/CodeEditor';

interface Lesson {
  id: string;
  titleFr: string;
  titleEn: string;
  titleAr: string;
  contentFr: string;
  contentEn: string;
  contentAr: string;
  quizQuestionFr: string | null;
  quizQuestionEn: string | null;
  quizQuestionAr: string | null;
  quizOptionsFr: { text: string; isCorrect: boolean }[] | null;
  quizOptionsEn: { text: string; isCorrect: boolean }[] | null;
  quizOptionsAr: { text: string; isCorrect: boolean }[] | null;
  quizExplainFr: string | null;
  quizExplainEn: string | null;
  quizExplainAr: string | null;
  exampleFr: string | null;
  exampleEn: string | null;
  exampleAr: string | null;
  exerciseFr: string | null;
  exerciseEn: string | null;
  exerciseAr: string | null;
  quizCorrect: number | null;
  category: string;
  hasQuiz: boolean;
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
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState<'theory' | 'example' | 'exercise' | 'quiz'>('theory');

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

  // Reset quiz and tab state when lesson changes
  useEffect(() => {
    setQuizAnswer(null);
    setQuizSubmitted(false);
    setActiveTab('theory');
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

  // Render content with code blocks and HTML support
  const renderContent = (content: string) => {
    // Detect if content is HTML (contains HTML tags like <p>, <h3>, <ul>, etc.)
    const isHtml = /<(p|h[1-6]|ul|ol|li|strong|em|br|div|span)[\s>]/i.test(content);

    if (isHtml) {
      return (
        <div key="html-content" className="prose-content">
          <style dangerouslySetInnerHTML={{ __html: `
            .prose-content p { margin-bottom: 1rem; line-height: 1.75; color: var(--text-muted); }
            .prose-content h3 { font-size: 1.125rem; font-weight: 600; margin-top: 2rem; margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px solid var(--border-light); color: var(--text-main); }
            .prose-content ul { list-style: none; padding-left: 0; margin: 0.5rem 0; }
            .prose-content li { display: flex; align-items: flex-start; gap: 0.5rem; padding: 0.375rem 0; padding-left: 1rem; color: var(--text-muted); line-height: 1.75; }
            .prose-content li::before { content: ""; display: block; width: 0.375rem; height: 0.375rem; border-radius: 9999px; background: var(--primary); opacity: 0.4; margin-top: 0.625rem; flex-shrink: 0; }
            .prose-content code { font-size: 0.875rem; padding: 0.125rem 0.375rem; border-radius: 0.375rem; background: rgba(255,255,255,0.08); color: #e06c75; border: 1px solid rgba(255,255,255,0.06); }
            .prose-content pre { background: #1e1e1e; border: 1px solid var(--border-light); border-radius: 0.75rem; padding: 1rem; overflow-x: auto; margin: 1rem 0; }
            .prose-content pre code { background: none; border: none; padding: 0; color: #d4d4d4; font-size: 0.875rem; }
            .prose-content strong { color: var(--text-main); font-weight: 600; }
            .prose-content em { font-style: italic; color: var(--text-muted); }
          `}} />
          <div dangerouslySetInnerHTML={{ __html: content }} />
        </div>
      );
    }

    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLines: string[] = [];
    let codeLang = '';

    // Helper to render inline formatting (bold, italic, inline code)
    const renderInline = (text: string, keyPrefix: string, keyIndex: number) => {
      // Inline code
      const parts = text.split(/(`[^`]+`)/g);
      if (parts.length > 1) {
        return parts.map((part, i) => {
          if (part.startsWith('`') && part.endsWith('`')) {
            return (
              <code key={`${keyPrefix}-${keyIndex}-${i}`} className="px-1.5 py-0.5 rounded-md text-sm font-mono" style={{ 
                backgroundColor: 'rgba(255,255,255,0.08)',
                color: '#e06c75',
                border: '1px solid rgba(255,255,255,0.06)'
              }}>
                {part.slice(1, -1)}
              </code>
            );
          }
          // Bold
          const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
          if (boldParts.length > 1) {
            return boldParts.map((bp, j) => {
              if (bp.startsWith('**') && bp.endsWith('**')) {
                return <strong key={`${keyPrefix}-${keyIndex}-${i}-${j}`}>{bp.slice(2, -2)}</strong>;
              }
              return bp;
            });
          }
          return part;
        });
      }
      // Bold without code
      const boldParts = text.split(/(\*\*[^*]+\*\*)/g);
      if (boldParts.length > 1) {
        return boldParts.map((bp, i) => {
          if (bp.startsWith('**') && bp.endsWith('**')) {
            return <strong key={`${keyPrefix}-${keyIndex}-${i}`}>{bp.slice(2, -2)}</strong>;
          }
          return bp;
        });
      }
      return text;
    };

    lines.forEach((line, i) => {
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          elements.push(
            <CodeBlock key={`code-${i}`} code={codeLines.join('\n')} language={codeLang || 'code'} />
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
        elements.push(
          <h3 key={i} className="mt-8 mb-3 pb-2 border-b border-border/30">
            <span className="text-lg font-semibold" style={{ color: 'var(--text-main)' }}>{renderInline(line.slice(4), 'h3', i)}</span>
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="mt-8 mb-3 pb-2 border-b border-border/50">
            <span className="text-xl font-display font-bold" style={{ color: 'var(--text-main)' }}>{renderInline(line.slice(3), 'h2', i)}</span>
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="mt-6 mb-4 pb-2 border-b border-border">
            <span className="text-2xl font-display font-bold" style={{ color: 'var(--text-main)' }}>{renderInline(line.slice(2), 'h1', i)}</span>
          </h1>
        );
      } else if (line.startsWith('- **')) {
        const match = line.match(/- \*\*(.+?)\*\*[ —] (.+)/);
        if (match) {
          elements.push(
            <li key={i} className="flex items-start gap-2 py-1.5 ml-4">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
              <span className="text-[var(--text-muted)] leading-relaxed">
                <strong style={{ color: 'var(--text-main)' }}>{renderInline(match[1], 'li-bold', i)}</strong>
                {' — '}
                {renderInline(match[2], 'li-text', i)}
              </span>
            </li>
          );
        } else {
          elements.push(
            <li key={i} className="flex items-start gap-2 py-1.5 ml-4">
              <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
              <span className="text-[var(--text-muted)] leading-relaxed">{renderInline(line.slice(2), 'li', i)}</span>
            </li>
          );
        }
      } else if (line.startsWith('- ')) {
        elements.push(
          <li key={i} className="flex items-start gap-2 py-1.5 ml-4">
            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/60 flex-shrink-0" />
            <span className="text-[var(--text-muted)] leading-relaxed">{renderInline(line.slice(2), 'li', i)}</span>
          </li>
        );
      } else if (line.trim() === '') {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(<p key={i} className="text-[var(--text-muted)] leading-relaxed py-1">{renderInline(line, 'p', i)}</p>);
      }
    });

    return elements;
  };

  // Sandbox functions
  const getDefaultSandbox = (lesson: Lesson) => {
    if (lesson.exerciseFr) return lesson.exerciseFr.trim().replace(/\\n/g, '\n');
    const content = getContent(lesson);
    const codeMatch = content.match(/```(?:php|python|javascript|js)?\n([\s\S]*?)```/);
    if (codeMatch) return codeMatch[1].trim();
    return '';
  };

  const runSandbox = async () => {
    setIsRunning(true);

    // Detect language
    let lang: 'python' | 'php' | 'javascript' = 'javascript';
    if (sandboxCode.includes('<?php') || sandboxCode.includes('echo') || sandboxCode.includes('$')) {
      lang = 'php';
    } else if (sandboxCode.includes('print(') || sandboxCode.includes('def ') || sandboxCode.includes('import ')) {
      lang = 'python';
    }

    try {
      if (lang === 'php') {
        // Try server-side execution first, fallback to transpiler
        setSandboxOutput('⏳ Exécution PHP...');

        try {
          const response = await fetch('/api/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: sandboxCode, language: 'php' }),
          });

          if (response.ok) {
            const result = await response.json();
            setSandboxOutput(result.output || '(aucun affichage)');
          } else {
            // Fallback to client-side transpiler
            const result = transpilePHP(sandboxCode);
            setSandboxOutput(result);
          }
        } catch {
          // Server not available, use client-side transpiler
          const result = transpilePHP(sandboxCode);
          setSandboxOutput(result);
        }
      } else if (lang === 'python') {
        // Use Pyodide
        if ((window as any).loadPyodide === undefined) {
          setSandboxOutput('⏳ Chargement de Pyodide...');
          await new Promise<void>((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Impossible de charger Pyodide'));
            document.head.appendChild(script);
          });
        }

        setSandboxOutput('⏳ Initialisation de Python...');
        const pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });

        pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
`);

        try {
          pyodide.runPython(sandboxCode);
          const output = pyodide.runPython('sys.stdout.getvalue()');
          setSandboxOutput(output || '(aucun affichage)');
        } catch (pyError: any) {
          setSandboxOutput(`❌ Erreur Python:\n${pyError.message}`);
        }
      } else {
        // JavaScript
        try {
          const logs: string[] = [];
          const mockConsole = {
            log: (...args: any[]) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' ')),
            error: (...args: any[]) => logs.push('❌ ' + args.join(' ')),
            warn: (...args: any[]) => logs.push('⚠️ ' + args.join(' ')),
          };
          const fn = new Function('console', sandboxCode);
          fn(mockConsole);
          setSandboxOutput(logs.join('\n') || '(aucun affichage)');
        } catch (jsError: any) {
          setSandboxOutput(`❌ Erreur JavaScript:\n${jsError.message}`);
        }
      }
    } catch (e: any) {
      setSandboxOutput(`❌ Erreur: ${e.message}`);
    } finally {
      setIsRunning(false);
    }
  };

  // Client-side PHP transpiler (best-effort, for simple exercises)
  function transpilePHP(code: string): string {
    try {
      let output = '';
      const log = (val: any) => { output += String(val); };

      let jsCode = code.replace(/^<\?php\s*/i, '').replace(/\?>\s*$/, '');
      jsCode = jsCode.replace(/\s+/g, ' ').trim();

      // Simple approach: handle basic echo/print with variables
      // Extract variables and their values
      const varMap = new Map<string, any>();

      // Handle variable assignments: $var = value;
      jsCode = jsCode.replace(/\$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)\s*=\s*([^;]+);/g, (_, name, val) => {
        // Clean up value
        let jsVal = val.trim();
        // Remove trailing " \n" or similar
        jsVal = jsVal.replace(/\s*\.\s*"\s*\\n\s*"\s*$/g, '');
        // PHP concatenation . -> JS +
        jsVal = jsVal.replace(/\s*\.\s*/g, ' + ');
        // PHP array() -> []
        jsVal = jsVal.replace(/array\s*\(([^)]*)\)/g, '[$1]');
        // Replace PHP variable references with JS references
        jsVal = jsVal.replace(/\$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, (_: string, vName: string) => {
          return `__v_${vName}__`;
        });
        varMap.set(name, jsVal);
        return `varMap.set("${name}", ${jsVal});`;
      });

      // Handle echo statements
      jsCode = jsCode.replace(/echo\s+([^;]+);/g, (_: string, expr: string) => {
        // Clean expression
        let jsExpr = expr.trim();
        // Handle "\n" at end
        jsExpr = jsExpr.replace(/\s*\.\s*"\s*\\n\s*"\s*$/g, '');
        // PHP concatenation . -> JS +
        jsExpr = jsExpr.replace(/\s*\.\s*/g, ' + ');
        // Replace PHP variable references
        jsExpr = jsExpr.replace(/\$([a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*)/g, (_: string, name: string) => {
          if (varMap.has(name)) {
            return `(${varMap.get(name)})`;
          }
          return `__v_${name}__`;
        });
        // Handle math expressions
        if (jsExpr.includes('*') || jsExpr.includes('+') || jsExpr.includes('-')) {
          jsExpr = jsExpr.replace(/\(([^)]+)\)/g, '($1)');
        }
        return `log(${jsExpr} + "\\n");`;
      });

      // Handle for loops (simple: for ($i = 1; $i <= N; $i++))
      const forMatch = jsCode.match(/for\s*\(\s*\$([a-zA-Z]+)\s*=\s*(\d+)\s*;\s*\$([a-zA-Z]+)\s*([<>=!]+)\s*(\d+)\s*;\s*\$([a-zA-Z]+)\+\+\s*\)/);
      if (forMatch) {
        const [, varName, start, , op, end, incName] = forMatch;
        const forBody = jsCode.match(/\{([\s\S]*?)\}/);
        if (forBody) {
          let body = forBody[1];
          // Process echo inside loop
          body = body.replace(/echo\s+([^;]+);/g, (_, expr) => {
            let jsExpr = expr.trim();
            jsExpr = jsExpr.replace(/\s*\.\s*/g, ' + ');
            jsExpr = jsExpr.replace(/\s*\.\s*"\s*\\n\s*"\s*$/g, '');
            // Replace $i with loop variable
            jsExpr = jsExpr.replace(/\$i/g, varName);
            // Replace math expressions
            jsExpr = jsExpr.replace(/\$\w+\s*\*\s*\d+/g, (m: string) => {
              const parts = m.replace(/\$/g, '').split('*');
              return `(${parts[0].trim()} * ${parts[1].trim()})`;
            });
            return `log(${jsExpr} + "\\n");`;
          });
          eval(body);
          return output || '(Code PHP exécuté avec succès)';
        }
      }

      eval(jsCode);
      return output || '(Code PHP exécuté avec succès - aucun affichage)';
    } catch (e: any) {
      return `❌ Erreur PHP: ${e.message}\n\nNote: Le transpileur client ne gère que le PHP basique.\nPour un vrai exécuteur PHP, un endpoint API backend est recommandé.`;
    }
  }

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
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="badge bg-primary/10 text-primary border border-primary/20 text-xs text-nowrap">
                    {currentLesson.category}
                  </span>
                  {currentLesson.hasQuiz && (
                    <span className="badge bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs text-nowrap">
                      {t('course.quiz')}
                    </span>
                  )}
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex items-center gap-1 p-1 bg-white/5 border border-border rounded-xl mb-8 w-fit overflow-x-auto">
                <button
                  onClick={() => setActiveTab('theory')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'theory' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  <BookOpen className="w-4 h-4" />
                  {locale === 'ar' ? 'الدرس' : locale === 'en' ? 'Theory' : 'Cours'}
                </button>
                {currentLesson.exampleFr && (
                  <button
                    onClick={() => setActiveTab('example')}
                    className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'example' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
                  >
                    <BookOpen className="w-4 h-4" />
                    {locale === 'ar' ? 'مثال' : locale === 'en' ? 'Example' : 'Exemple'}
                  </button>
                )}
                <button
                  onClick={() => setActiveTab('exercise')}
                  className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'exercise' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
                >
                  <Terminal className="w-4 h-4" />
                  {locale === 'ar' ? 'تمرين' : locale === 'en' ? 'Exercise' : 'Exercice'}
                </button>
                {currentLesson.hasQuiz && (
                  <button
                    onClick={() => setActiveTab('quiz')}
                    className={`px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 whitespace-nowrap ${activeTab === 'quiz' ? 'bg-primary text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-white'}`}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Quiz
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {activeTab === 'theory' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl p-6 sm:p-8">
                    {renderContent(getContent(currentLesson))}
                  </div>
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-xs text-[var(--text-muted)]">
                      {locale === 'ar' ? 'الدرس' : locale === 'en' ? 'Lesson' : 'Leçon'} {currentLessonIndex + 1} {locale === 'ar' ? 'على' : locale === 'en' ? 'of' : 'sur'} {course.lessons.length}
                    </div>
                    <button
                      onClick={() => setActiveTab(currentLesson.exampleFr ? 'example' : 'exercise')}
                      className="btn btn-primary flex items-center gap-2"
                    >
                      {currentLesson.exampleFr
                        ? (locale === 'ar' ? 'انتقل إلى المثال' : locale === 'en' ? 'Go to Example' : 'Passer à l\'exemple')
                        : (locale === 'ar' ? 'الذهاب إلى التمرين' : locale === 'en' ? 'Go to Exercise' : 'Passer à l\'exercice')
                      }
                      <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'example' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-4 text-primary">
                      <BookOpen className="w-5 h-5" />
                      <h3 className="font-display font-bold">{locale === 'ar' ? 'مثال توضيحي' : locale === 'en' ? 'Illustrative Example' : 'Exemple d\'illustration'}</h3>
                    </div>
                    <CodeBlock
                      code={(currentLesson.exampleFr || '').replace(/\\n/g, '\n').trim()}
                      language="php"
                    />
                  </div>
                  <div className="pt-8 flex justify-between">
                    <button onClick={() => setActiveTab('theory')} className="btn btn-ghost flex items-center gap-2">
                       <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                       {locale === 'ar' ? 'العودة للدرس' : locale === 'en' ? 'Back to Theory' : 'Retour au cours'}
                    </button>
                    <button onClick={() => setActiveTab('exercise')} className="btn btn-primary flex items-center gap-2">
                       {locale === 'ar' ? 'انتقل إلى التمرين' : locale === 'en' ? 'Go to Exercise' : 'Passer à l\'exercice'}
                       <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'exercise' && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {/* Instructions Area */}
                  {(currentLesson.exerciseFr || currentLesson.contentFr.includes('Exercice')) && (
                    <div className="mb-6 bg-primary/5 border border-primary/20 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-3 text-primary">
                        <Trophy className="w-5 h-5" />
                        <h3 className="font-display font-bold">🎯 {locale === 'ar' ? 'هدف التمرين' : locale === 'en' ? 'Exercise Objective' : 'Objectif de l\'exercice'}</h3>
                      </div>
                      <div className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
                        {currentLesson.exerciseFr?.replace(/\\n/g, '\n').split('\n').filter((l: string) => l.startsWith('//')).map((l: string) => l.replace(/^\/\/\s*/, '')).join('\n') ||
                         'Consultez les commentaires dans le code ci-dessous pour les instructions.'}
                      </div>
                    </div>
                  )}

                  {/* Sandbox / Exercise Section */}
                  <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl overflow-hidden shadow-xl">
                    <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
                          <Terminal className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-display font-bold text-base">
                            {locale === 'ar' ? 'تمرين عملي' : locale === 'en' ? 'Practical Exercise' : 'Exercice Pratique'}
                          </h3>
                          <p className="text-xs text-[var(--text-muted)]">
                            {locale === 'ar' ? 'قم بتعديل وتشغيل الكود' : locale === 'en' ? 'Modify and execute the code' : 'Modifiez et exécutez le code'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSandboxCode(getDefaultSandbox(currentLesson));
                          setSandboxOutput('');
                          setIsRunning(false);
                        }}
                        className="btn btn-ghost btn-sm text-xs"
                      >
                        {locale === 'ar' ? 'إعادة تعيين' : locale === 'en' ? 'Reset' : 'Réinitialiser'}
                      </button>
                    </div>
                    <CodeEditor
                      code={sandboxCode}
                      onChange={(newCode) => setSandboxCode(newCode)}
                      language="php"
                    />
                    <div className="px-4 pb-4 flex items-center justify-between border-t border-border pt-4">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {locale === 'ar' ? 'جاهز للتنفيذ' : locale === 'en' ? 'Ready to execute' : 'Prêt pour l\'exécution'}
                      </div>
                      <button
                        onClick={runSandbox}
                        disabled={isRunning}
                        className="btn btn-primary px-6 flex items-center gap-2 group shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isRunning ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {locale === 'ar' ? 'جاري التنفيذ...' : locale === 'en' ? 'Running...' : 'Exécution...'}
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 fill-current group-hover:scale-110 transition-transform" />
                            {locale === 'ar' ? 'تشغيل' : locale === 'en' ? 'Run' : 'Exécuter'}
                          </>
                        )}
                      </button>
                    </div>
                    {sandboxOutput && (
                      <div className="border-t border-border bg-black/40 p-0">
                        <div className="px-4 py-2 bg-white/5 text-[10px] font-bold text-[var(--text-muted)] uppercase tracking-wider border-b border-border">
                          {locale === 'ar' ? 'النتيجة' : locale === 'en' ? 'Output' : 'Résultat'}
                        </div>
                        <pre className="p-6 font-mono text-sm text-green-400 overflow-x-auto min-h-[100px] whitespace-pre-wrap">
                          {sandboxOutput}
                        </pre>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 flex justify-between">
                    <button 
                      onClick={() => setActiveTab('theory')}
                      className="btn btn-ghost flex items-center gap-2"
                    >
                      <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      {locale === 'ar' ? 'العودة للدرس' : locale === 'en' ? 'Back to Theory' : 'Retour au cours'}
                    </button>
                    {currentLesson.hasQuiz && (
                      <button 
                        onClick={() => setActiveTab('quiz')}
                        className="btn btn-primary flex items-center gap-2"
                      >
                        {locale === 'ar' ? 'انتقل إلى الاختبار' : locale === 'en' ? 'Go to Quiz' : 'Passer au Quiz'}
                        <ArrowRight className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'quiz' && currentLesson.hasQuiz && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="bg-[var(--bg-elevated)] border border-border rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-500 font-bold">
                        ?
                      </div>
                      <h3 className="font-display font-bold text-lg">{t('course.quiz')}</h3>
                    </div>

                    <div className="bg-white/5 border border-border rounded-xl p-6 mb-6">
                      <p className="text-base font-medium">{getQuizQuestion()}</p>
                    </div>

                    <div className="space-y-3 mb-8">
                      {getQuizOptions().map((option, i) => {
                        const isCorrect = i === currentLesson.quizCorrect;
                        const isSelected = quizAnswer === i;
                        let optionStyle = 'bg-white/5 border-border hover:bg-white/10 hover:border-primary/30 text-[var(--text-muted)]';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optionStyle = 'bg-primary/20 border-primary shadow-[0_0_15px_rgba(var(--primary-rgb),0.2)] text-primary font-bold';
                          } else if (isSelected && !isCorrect) {
                            optionStyle = 'bg-red-500/20 border-red-500 text-red-400';
                          }
                        } else if (isSelected) {
                          optionStyle = 'bg-primary/10 border-primary text-primary';
                        }

                        return (
                          <button
                            key={i}
                            disabled={quizSubmitted}
                            onClick={() => setQuizAnswer(i)}
                            className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group ${optionStyle}`}
                          >
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                              isSelected ? 'border-primary bg-primary text-white shadow-md' : 'border-border group-hover:border-primary/50'
                            }`}>
                              {String.fromCharCode(65 + i)}
                            </div>
                            <span className="flex-1">{option}</span>
                            {quizSubmitted && isCorrect && <CheckCircle className="w-5 h-5 text-primary" />}
                            {quizSubmitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-400" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted ? (
                      <div className={`p-6 rounded-2xl border animate-in zoom-in-95 duration-300 ${
                        quizAnswer === currentLesson.quizCorrect ? 'bg-primary/10 border-primary/30' : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            quizAnswer === currentLesson.quizCorrect ? 'bg-primary/20 text-primary' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {quizAnswer === currentLesson.quizCorrect ? '🏆' : '❌'}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold mb-1">
                              {quizAnswer === currentLesson.quizCorrect ? 'Bravo !' : 'Oups...'}
                            </h4>
                            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                              {getQuizExplain()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <button
                        disabled={quizAnswer === null}
                        onClick={async () => {
                          if (quizAnswer !== null) {
                            setQuizSubmitted(true);
                            // Save progress
                            if (quizAnswer === currentLesson.quizCorrect) {
                              markComplete();
                            }
                            // API call
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
                        className="btn btn-primary w-full py-4 rounded-xl shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)] disabled:opacity-50 disabled:shadow-none transition-all"
                      >
                        {locale === 'ar' ? 'تحقق من الإجابة' : locale === 'en' ? 'Verify Answer' : 'Vérifier la réponse'}
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-8 flex justify-start">
                    <button 
                      onClick={() => setActiveTab('exercise')}
                      className="btn btn-ghost flex items-center gap-2"
                    >
                      <ArrowLeft className={`w-4 h-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
                      {locale === 'ar' ? 'العودة للتمرين' : locale === 'en' ? 'Back to Exercise' : 'Retour à l\'exercice'}
                    </button>
                  </div>
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
