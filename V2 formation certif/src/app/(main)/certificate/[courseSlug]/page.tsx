'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Globe, Download, Share2, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { locales, localeNames } from '@/i18n';

const COURSE_NAMES: Record<string, Record<string, string>> = {
  php: { fr: 'Developpement Web Backend avec PHP', en: 'Backend Web Development with PHP', ar: 'تطوير الويب الخلفي بـ PHP' },
  python: { fr: 'Programmation en Python', en: 'Programming in Python', ar: 'البرمجة بـ Python' },
  n8n: { fr: 'Automatisation avec n8n', en: 'Automation with n8n', ar: 'الأتمتة بـ n8n' },
  openclaw: { fr: 'Maitrise de l\'IA OpenClaw', en: 'Mastering OpenClaw AI', ar: 'إتقان الذكاء الاصطناعي OpenClaw' },
};

const COURSE_SHORT: Record<string, string> = {
  php: 'PHP', python: 'Python', n8n: 'n8n', openclaw: 'OpenClaw',
};

function generateCertReference(slug: string): string {
  const year = new Date().getFullYear();
  const hash = Math.random().toString(36).substring(2, 8).toUpperCase();
  const num = Math.floor(Math.random() * 9000 + 1000);
  return `${COURSE_SHORT[slug] || slug.toUpperCase()}-${year}-${hash}-${num}`;
}

// Simple QR code drawer on canvas
function drawQRCodeOnCanvas(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, size: number) {
  const modules = 21;
  const cellSize = size / modules;

  // Generate deterministic pattern from text
  let hash: number[] = [];
  for (let i = 0; i < text.length; i++) {
    hash.push((text.charCodeAt(i) * 31 + i * 17 + text.length * 7) % 256);
  }
  while (hash.length < modules * modules) {
    hash.push((hash[hash.length - 1] * 13 + 7) % 256);
  }

  ctx.fillStyle = '#000000';
  for (let row = 0; row < modules; row++) {
    for (let col = 0; col < modules; col++) {
      const idx = row * modules + col;
      if (hash[idx] % 3 !== 0) {
        ctx.fillRect(x + col * cellSize, y + row * cellSize, cellSize - 0.5, cellSize - 0.5);
      }
    }
  }

  // Finder patterns (3 corners)
  function drawFinder(fx: number, fy: number, s: number) {
    ctx.fillStyle = '#000000';
    ctx.fillRect(fx, fy, s, s);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(fx + s * 0.15, fy + s * 0.15, s * 0.7, s * 0.7);
    ctx.fillStyle = '#000000';
    ctx.fillRect(fx + s * 0.3, fy + s * 0.3, s * 0.4, s * 0.4);
  }

  const finderSize = cellSize * 3;
  drawFinder(x, y, finderSize);
  drawFinder(x + (modules - 7) * cellSize, y, finderSize);
  drawFinder(x, y + (modules - 7) * cellSize, finderSize);
}

export default function CertificatePage() {
  const { locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const courseSlug = params?.courseSlug as string;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [user, setUser] = useState<any>(null);
  const [certRef, setCertRef] = useState('');
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (!data.user) {
          router.push('/login?redirect=/certificate/' + courseSlug);
          return;
        }
        setUser(data.user);

        // Check if course is unlocked and completed
        const isUnlocked = data.user.role === 'ADMIN' ||
          data.user.unlockedCourses?.some((uc: any) => uc.course.slug === courseSlug);

        if (!isUnlocked) {
          router.push('/dashboard');
          return;
        }

        // Generate cert reference
        const ref = generateCertReference(courseSlug);
        setCertRef(ref);

        // Save certificate to DB
        await fetch('/api/certificates', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            courseSlug,
            certReference: ref,
            studentName: data.user.name,
            score: 100,
          }),
        });
      } catch {
        router.push('/dashboard');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [courseSlug, router]);

  // Draw certificate on canvas
  useEffect(() => {
    if (!canvasRef.current || !user || !certRef) return;

    const canvas = canvasRef.current;
    const W = 1200;
    const H = 850;
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const courseName = COURSE_NAMES[courseSlug]?.[locale] || COURSE_NAMES[courseSlug]?.fr || courseSlug;
    const courseShort = COURSE_SHORT[courseSlug] || courseSlug.toUpperCase();
    const dateStr = new Date().toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR', {
      day: 'numeric', month: 'long', year: 'numeric',
    });
    const fullName = user.name;

    // Background gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, '#fffef9');
    bg.addColorStop(0.55, '#ffffff');
    bg.addColorStop(1, '#f7fafc');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Dot pattern
    ctx.fillStyle = 'rgba(180,138,33,0.05)';
    for (let x = 36; x < W; x += 42) {
      for (let y = 36; y < H; y += 42) {
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Soft glow
    const softGlow = ctx.createRadialGradient(W / 2, 190, 20, W / 2, 190, 320);
    softGlow.addColorStop(0, 'rgba(245,158,11,0.10)');
    softGlow.addColorStop(0.45, 'rgba(99,102,241,0.05)');
    softGlow.addColorStop(1, 'transparent');
    ctx.fillStyle = softGlow;
    ctx.fillRect(0, 0, W, H);

    // Border
    ctx.strokeStyle = '#c89f3d';
    ctx.lineWidth = 3;
    roundRect(ctx, 24, 24, W - 48, H - 48, 18);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(200,159,61,0.35)';
    ctx.lineWidth = 1;
    roundRect(ctx, 38, 38, W - 76, H - 76, 14);
    ctx.stroke();

    // Header
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 15px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SMARTCODAI ACADEMY', W / 2, 88);

    ctx.fillStyle = 'rgba(15,23,42,0.62)';
    ctx.font = '600 12px Arial, sans-serif';
    ctx.fillText(locale === 'ar' ? 'شهادة إتمام الدورة' : locale === 'en' ? 'COURSE COMPLETION CERTIFICATE' : 'CERTIFICATION DE FIN DE PARCOURS', W / 2, 114);

    // Course badge
    ctx.fillStyle = 'rgba(99,102,241,0.08)';
    ctx.strokeStyle = 'rgba(99,102,241,0.22)';
    ctx.lineWidth = 1.5;
    roundRect(ctx, W / 2 - 78, 136, 156, 36, 18);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#4f46e5';
    ctx.font = '700 15px "Courier New", monospace';
    ctx.fillText(courseShort, W / 2, 159);

    // Title
    ctx.fillStyle = '#111827';
    ctx.font = '700 44px Georgia, serif';
    ctx.fillText(locale === 'ar' ? 'شهادة النجاح' : locale === 'en' ? 'Certificate of Achievement' : 'Certificat de Reussite', W / 2, 235);

    // "Awarded to"
    ctx.fillStyle = 'rgba(71,85,105,0.9)';
    ctx.font = 'italic 21px Georgia, serif';
    ctx.fillText(locale === 'ar' ? 'ممنوحة لـ' : locale === 'en' ? 'Awarded to' : 'Decerne a', W / 2, 286);

    // Student name
    ctx.fillStyle = '#0f172a';
    ctx.font = '700 60px Georgia, serif';
    ctx.fillText(fullName, W / 2, 360);

    // Gold line
    ctx.strokeStyle = 'rgba(200,159,61,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(W / 2 - 210, 382);
    ctx.lineTo(W / 2 + 210, 382);
    ctx.stroke();

    // Course description
    ctx.fillStyle = 'rgba(51,65,85,0.92)';
    ctx.font = '400 22px Georgia, serif';
    ctx.fillText(locale === 'ar' ? 'لإتمام بنجاح دورة' : locale === 'en' ? 'for the successful completion of' : 'pour la validation complete du parcours', W / 2, 430);

    ctx.fillStyle = '#4338ca';
    ctx.font = '700 34px Arial, sans-serif';
    ctx.fillText(courseName, W / 2, 478);

    // Info cards
    const infoY = 560;
    const cards = [
      { x: 118, label: locale === 'ar' ? 'المرجع' : locale === 'en' ? 'Reference' : 'Reference', value: certRef },
      { x: 395, label: locale === 'ar' ? 'التاريخ' : locale === 'en' ? 'Date' : 'Date', value: dateStr },
      { x: 672, label: locale === 'ar' ? 'النتيجة' : locale === 'en' ? 'Score' : 'Score', value: '100%' },
      { x: 949, label: locale === 'ar' ? 'الطالب' : locale === 'en' ? 'Student' : 'Etudiant', value: fullName.split(' ')[0] },
    ];

    cards.forEach((card) => {
      ctx.fillStyle = 'rgba(255,255,255,0.72)';
      ctx.strokeStyle = 'rgba(148,163,184,0.28)';
      ctx.lineWidth = 1;
      roundRect(ctx, card.x, infoY, 205, 88, 14);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = 'rgba(100,116,139,0.85)';
      ctx.font = '700 11px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(card.label.toUpperCase(), card.x + 18, infoY + 28);
      ctx.fillStyle = '#0f172a';
      ctx.font = card.label === 'Reference' ? '700 14px "Courier New", monospace' : '700 24px Arial, sans-serif';
      ctx.fillText(card.value, card.x + 18, infoY + 58);
    });

    // Seal
    ctx.beginPath();
    ctx.arc(W / 2, 707, 66, 0, Math.PI * 2);
    ctx.fillStyle = '#fffaf0';
    ctx.fill();
    ctx.strokeStyle = '#c89f3d';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(W / 2, 707, 52, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(200,159,61,0.45)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.fillStyle = '#b45309';
    ctx.font = '700 14px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SMARTCODAI', W / 2, 698);
    ctx.font = '700 11px Arial, sans-serif';
    ctx.fillText('VERIFIED CERTIFICATE', W / 2, 717);
    ctx.font = '28px serif';
    ctx.fillText('★', W / 2, 742);

    // Signature lines
    ctx.strokeStyle = 'rgba(148,163,184,0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(120, 782);
    ctx.lineTo(390, 782);
    ctx.moveTo(810, 782);
    ctx.lineTo(1080, 782);
    ctx.stroke();

    ctx.fillStyle = 'rgba(71,85,105,0.85)';
    ctx.font = '600 12px Arial, sans-serif';
    ctx.fillText(locale === 'ar' ? 'مدير الشهادات' : locale === 'en' ? 'Certification Manager' : 'Responsable de certification', 255, 804);
    ctx.fillText(locale === 'ar' ? 'تاريخ الإصدار' : locale === 'en' ? 'Issue Date' : 'Emission officielle Smartcodai', 945, 804);

    ctx.fillStyle = '#0f172a';
    ctx.font = '700 24px Georgia, serif';
    ctx.fillText('Smartcodai Academy', 255, 770);
    ctx.font = '700 20px Georgia, serif';
    ctx.fillText(dateStr, 945, 770);

    // Footer text
    ctx.font = '11px Arial, sans-serif';
    ctx.fillStyle = 'rgba(100,116,139,0.7)';
    ctx.fillText(
      locale === 'ar' ? 'تشهد هذه الوثيقة على إتمام الدورة بنجاح' : locale === 'en' ? 'This document certifies the successful completion of the course' : 'Ce document certifie la completion integrale du parcours',
      W / 2, 826
    );

    // QR Code
    const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify?cert=${encodeURIComponent(certRef)}`;
    drawQRCodeOnCanvas(ctx, verifyUrl, 1060, 730, 80);

    ctx.fillStyle = 'rgba(100,116,139,0.6)';
    ctx.font = '8px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(locale === 'ar' ? 'امسح للتحقق' : locale === 'en' ? 'Scan to verify' : 'Scannez pour verifier', 1100, 820);
  }, [user, certRef, courseSlug, locale]);

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    setDownloading(true);
    const link = document.createElement('a');
    link.download = `certificat-${courseSlug}-${user?.name?.toLowerCase().replace(/\s+/g, '-')}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
    setDownloading(false);
  };

  const handleShareLinkedin = () => {
    const courseName = COURSE_NAMES[courseSlug]?.[locale] || COURSE_NAMES[courseSlug]?.fr || courseSlug;
    const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify?cert=${encodeURIComponent(certRef)}`;
    const text = locale === 'ar'
      ? `لقد حصلت على شهادة "${courseName}" من Smartcodai Academy! المرجع: ${certRef}`
      : locale === 'en'
      ? `I just earned my "${courseName}" certificate from Smartcodai Academy! Reference: ${certRef}`
      : `Je viens d'obtenir mon certificat "${courseName}" sur Smartcodai Academy! Reference: ${certRef}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const courseName = COURSE_NAMES[courseSlug]?.[locale] || COURSE_NAMES[courseSlug]?.fr || courseSlug;

  return (
    <div className="min-h-screen" dir={dir}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      {/* Topbar */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
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
        {/* Success banner */}
        <div className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="font-display font-bold text-lg">
              {locale === 'ar' ? '🎉 مبروك!' : locale === 'en' ? '🎉 Congratulations!' : '🎉 Felicitations!'}
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              {locale === 'ar'
                ? `لقد أكملت دورة "${courseName}" بنجاح`
                : locale === 'en'
                ? `You have completed "${courseName}" successfully`
                : `Vous avez complete "${courseName}" avec succes`}
            </p>
          </div>
        </div>

        {/* Certificate canvas */}
        <div className="bg-[var(--bg-panel)] border border-border rounded-2xl p-4 sm:p-6 shadow-card">
          <canvas ref={canvasRef} className="w-full rounded-xl" style={{ maxHeight: '600px' }} />
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <button onClick={handleDownload} className="btn btn-primary" disabled={downloading}>
            {downloading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {locale === 'ar' ? 'تنزيل PNG' : locale === 'en' ? 'Download PNG' : 'Telecharger PNG'}
          </button>
          <button onClick={handleShareLinkedin} className="btn btn-ghost" style={{ background: 'rgba(0,119,181,0.12)', borderColor: 'rgba(0,119,181,0.3)', color: '#0077b5' }}>
            <Share2 className="w-4 h-4" />
            LinkedIn
          </button>
          <Link href="/dashboard" className="btn btn-ghost">
            {locale === 'ar' ? 'العودة للوحة التحكم' : locale === 'en' ? 'Back to Dashboard' : 'Retour au tableau de bord'}
          </Link>
        </div>

        {/* Cert reference */}
        <div className="mt-6 text-center">
          <p className="text-xs text-[var(--text-muted)]">
            {locale === 'ar' ? 'مرجع الشهادة:' : locale === 'en' ? 'Certificate reference:' : 'Reference du certificat :'}{' '}
            <code className="font-mono text-[var(--text-main)] font-semibold">{certRef}</code>
          </p>
          <Link href={`/verify?cert=${certRef}`} className="text-xs text-primary hover:underline mt-1 inline-block">
            {locale === 'ar' ? 'تحقق من هذه الشهادة' : locale === 'en' ? 'Verify this certificate' : 'Verifier ce certificat'}
          </Link>
        </div>
      </main>
    </div>
  );
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}
