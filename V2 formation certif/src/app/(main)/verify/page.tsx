'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { Sun, Moon, Globe, CheckCircle, XCircle, Share2, Copy, Linkedin } from 'lucide-react';
import { locales, localeNames } from '@/i18n';

interface CertData {
  reference: string;
  studentName: string;
  course: { slug: string; titleFr: string; titleEn: string; titleAr: string; modulesCount: number };
  score: number;
  issuedAt: string;
  isVerified: boolean;
}

function VerifyPageInner() {
  const { locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const searchParams = useSearchParams();

  const [certId, setCertId] = useState('');
  const [cert, setCert] = useState<CertData | null>(null);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const urlCert = searchParams.get('cert');
    if (urlCert) {
      setCertId(urlCert);
      verifyCert(urlCert);
    }
  }, [searchParams]);

  const verifyCert = async (id: string) => {
    setLoading(true);
    setVerified(null);
    setCert(null);

    try {
      const res = await fetch(`/api/certificates/verify?ref=${encodeURIComponent(id)}`);
      const data = await res.json();

      if (data.valid) {
        setCert(data.certificate);
        setVerified(true);
      } else {
        setVerified(false);
      }
    } catch {
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (certId.trim()) verifyCert(certId.trim());
  };

  const copyLink = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify?cert=${encodeURIComponent(certId)}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const shareLinkedin = () => {
    const url = `${typeof window !== 'undefined' ? window.location.origin : ''}/verify?cert=${encodeURIComponent(certId)}`;
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" dir={dir}>
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,109,248,0.14),transparent_40%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.10),transparent_40%)]" />
      </div>

      <button onClick={toggleTheme} className="fixed top-5 right-5 w-10 h-10 rounded-xl border border-border bg-[var(--bg-panel)] flex items-center justify-center hover:border-primary/30 transition-all">
        {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
      </button>

      <div className="fixed top-5 left-5 flex gap-2">
        {locales.map((l) => (
          <button key={l} onClick={() => setLocale(l)} className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${l === locale ? 'bg-primary/15 text-primary' : 'text-[var(--text-muted)] hover:bg-white/5'}`}>
            {localeNames[l]}
          </button>
        ))}
      </div>

      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-extrabold text-2xl mb-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 font-bold text-sm">SC</div>
            Smartcodai
          </Link>
          <h1 className="text-2xl font-display font-extrabold">
            {locale === 'ar' ? 'التحقق من الشهادة' : locale === 'en' ? 'Certificate Verification' : 'Verification du certificat'}
          </h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {locale === 'ar' ? 'أدخل معرف الشهادة للتحقق' : locale === 'en' ? 'Enter the certificate ID to verify' : 'Entrez l\'identifiant du certificat pour verifier'}
          </p>
        </div>

        <div className="bg-[var(--bg-panel)] border border-border rounded-2xl p-6 sm:p-8 shadow-card">
          <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
            <input
              type="text"
              value={certId}
              onChange={(e) => setCertId(e.target.value)}
              placeholder={locale === 'ar' ? 'مثال: PHP-2026-XXX' : locale === 'en' ? 'Ex: PHP-2026-XXX' : 'Ex: PHP-2026-XXX'}
              className="input flex-1"
              required
            />
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '...' : (locale === 'ar' ? 'تحقق' : locale === 'en' ? 'Verify' : 'Verifier')}
            </button>
          </form>

          {verified !== null && (
            <div className={`rounded-xl border p-5 ${verified ? 'border-primary/30 bg-primary/6' : 'border-red-500/30 bg-red-500/6'}`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${verified ? 'bg-primary/15 text-primary' : 'bg-red-500/15 text-red-400'}`}>
                  {verified ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-semibold text-sm">
                    {verified
                      ? (locale === 'ar' ? 'شهادة صحيحة' : locale === 'en' ? 'Authentic certificate' : 'Certificat authentique')
                      : (locale === 'ar' ? 'شهادة غير موجودة' : locale === 'en' ? 'Certificate not found' : 'Certificat introuvable')}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {verified
                      ? (locale === 'ar' ? 'هذه الشهادة صادرة من Smartcodai Academy' : locale === 'en' ? 'This certificate was issued by Smartcodai Academy' : 'Ce certificat a ete emis par Smartcodai Academy')
                      : (locale === 'ar' ? 'لا توجد شهادة تطابق هذا المرجع' : locale === 'en' ? 'No certificate matches this reference' : 'Aucun certificat ne correspond a cette reference')}
                  </div>
                </div>
              </div>

              {verified && cert && (
                <>
                  <div className="space-y-2 mb-5">
                    {[
                      { label: locale === 'ar' ? 'الطالب' : locale === 'en' ? 'Student' : 'Etudiant', value: cert.studentName },
                      { label: locale === 'ar' ? 'الدورة' : locale === 'en' ? 'Course' : 'Formation', value: cert.course?.titleFr || cert.course?.titleEn || cert.course?.slug || '' },
                      { label: locale === 'ar' ? 'المرجع' : locale === 'en' ? 'Reference' : 'Reference', value: cert.reference },
                      { label: locale === 'ar' ? 'التاريخ' : locale === 'en' ? 'Date' : 'Date', value: new Date(cert.issuedAt).toLocaleDateString(locale === 'ar' ? 'ar-MA' : locale === 'en' ? 'en-US' : 'fr-FR') },
                      { label: locale === 'ar' ? 'النتيجة' : locale === 'en' ? 'Score' : 'Score', value: `${cert.score}%` },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                        <span className="text-sm text-[var(--text-muted)]">{item.label}</span>
                        <span className="text-sm font-semibold">{item.value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <div className="text-[10px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
                      {locale === 'ar' ? 'مشاركة' : locale === 'en' ? 'Share' : 'Partager'}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={shareLinkedin} className="btn btn-sm" style={{ background: 'rgba(0,119,181,0.12)', borderColor: 'rgba(0,119,181,0.3)', color: '#0077b5' }}>
                        <Linkedin className="w-3.5 h-3.5" />
                        LinkedIn
                      </button>
                      <button onClick={copyLink} className="btn btn-sm bg-white/5 border border-border hover:bg-primary/10 hover:border-primary/25">
                        {copied ? <CheckCircle className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? (locale === 'ar' ? 'تم النسخ' : locale === 'en' ? 'Copied' : 'Copie') : (locale === 'ar' ? 'نسخ الرابط' : locale === 'en' ? 'Copy link' : 'Copier le lien')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-[var(--text-muted)] hover:text-primary transition-colors">
            {locale === 'ar' ? 'العودة للرئيسية' : locale === 'en' ? 'Back to home' : 'Retour a l\'accueil'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <VerifyPageInner />
    </Suspense>
  );
}
