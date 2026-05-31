'use client';

import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';
import { useTheme } from '@/context/ThemeContext';
import { locales, localeNames } from '@/i18n';
import {
  Sun, Moon, Globe, Code, Award, Clock, ArrowRight,
  BookOpen, Shield, Zap, Check, Menu, X
} from 'lucide-react';
import { useState } from 'react';

export default function HomePage() {
  const { t, locale, setLocale, dir } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isRTL = dir === 'rtl';

  return (
    <div className="min-h-screen" dir={dir}>
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.04)_1px,transparent_0)] [background-size:24px_24px]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_10%,rgba(124,109,248,0.12),transparent_40%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.10),transparent_40%)]" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--bg-base)]/80 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 font-display font-extrabold text-xl">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-gray-900 font-bold text-sm">
                SC
              </div>
              Smartcodai
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                {t('nav.courses')}
              </a>
              <a href="#certificates" className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                {t('nav.certificates')}
              </a>

              {/* Language selector */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                  <Globe className="w-4 h-4" />
                  {localeNames[locale]}
                </button>
                <div className="absolute right-0 mt-2 w-40 bg-[var(--bg-panel)] border border-border rounded-xl shadow-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  {locales.map((l) => (
                    <button
                      key={l}
                      onClick={() => setLocale(l)}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-white/5 first:rounded-t-xl last:rounded-b-xl transition-colors ${
                        l === locale ? 'text-primary font-semibold' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {localeNames[l]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="w-10 h-10 rounded-xl border border-border bg-white/5 flex items-center justify-center hover:border-primary/30 hover:bg-primary/10 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              <Link href="/login" className="text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors">
                {t('nav.login')}
              </Link>
              <Link href="/register" className="btn btn-primary btn-sm">
                {t('nav.register')}
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden w-10 h-10 rounded-xl border border-border bg-white/5 flex items-center justify-center"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-[var(--bg-panel)] px-4 py-4 space-y-3">
            <a href="#features" className="block text-sm text-[var(--text-muted)] py-2">{t('nav.courses')}</a>
            <a href="#certificates" className="block text-sm text-[var(--text-muted)] py-2">{t('nav.certificates')}</a>
            <div className="flex items-center gap-3 py-2">
              {locales.map((l) => (
                <button
                  key={l}
                  onClick={() => setLocale(l)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    l === locale ? 'bg-primary/15 text-primary' : 'text-[var(--text-muted)] hover:bg-white/5'
                  }`}
                >
                  {localeNames[l]}
                </button>
              ))}
              <button onClick={toggleTheme} className="ml-auto w-8 h-8 rounded-lg border border-border flex items-center justify-center">
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
            <Link href="/login" className="block text-sm text-[var(--text-muted)] py-2">{t('nav.login')}</Link>
            <Link href="/register" className="btn btn-primary btn-sm w-full justify-center">{t('nav.register')}</Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/15 to-secondary/12 border border-primary/25 text-primary text-xs font-semibold tracking-wide mb-6">
            <Zap className="w-3.5 h-3.5" />
            {t('landing.hero.eyebrow')}
          </div>

          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold leading-tight mb-6"
            dangerouslySetInnerHTML={{ __html: t('landing.hero.title') }}
          />

          <p className="text-lg text-[var(--text-muted)] leading-relaxed max-w-2xl mb-8">
            {t('landing.hero.subtitle')}
          </p>

          <div className="flex flex-wrap gap-4 mb-8">
            <Link href="/register" className="btn btn-primary btn-lg">
              {t('landing.hero.cta')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
            <a href="#features" className="btn btn-ghost btn-lg">
              {t('landing.hero.ctaSecondary')}
            </a>
          </div>

          {/* Proof pills */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-border text-xs text-[var(--text-muted)]">
              <Check className="w-3.5 h-3.5 text-primary" />
              {t('landing.hero.proof')}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-border text-xs text-[var(--text-muted)]">
              <Check className="w-3.5 h-3.5 text-primary" />
              {t('landing.hero.proofCert')}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-display font-extrabold text-center mb-12">
          {t('landing.features.title')}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Structured */}
          <div className="card group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-display font-bold mb-2">{t('landing.features.structured.title')}</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t('landing.features.structured.desc')}</p>
          </div>

          {/* Certificates */}
          <div className="card group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-display font-bold mb-2">{t('landing.features.certificates.title')}</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t('landing.features.certificates.desc')}</p>
          </div>

          {/* Practical */}
          <div className="card group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/15 to-secondary/10 flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-display font-bold mb-2">{t('landing.features.practical.title')}</h3>
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">{t('landing.features.practical.desc')}</p>
          </div>
        </div>
      </section>

      {/* Courses preview */}
      <section id="certificates" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold tracking-wide mb-4">
              {t('nav.certificates')}
            </div>
            <h2 className="text-3xl font-display font-extrabold mb-4">
              {t('dashboard.certificates.empty')}
            </h2>
            <p className="text-[var(--text-muted)] leading-relaxed mb-6">
              {t('dashboard.certificates.desc')}
            </p>
            <ul className="space-y-3 mb-8">
              {[
                t('auth.register.features.0'),
                t('auth.register.features.1'),
                t('auth.register.features.2'),
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-sm text-[var(--text-muted)]">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-primary" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/register" className="btn btn-primary">
              {t('landing.cta.btn')}
            </Link>
          </div>

          {/* Certificate mockup */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/15 rounded-2xl blur-3xl" />
            <div className="relative bg-gradient-to-br from-amber-50 to-white rounded-2xl border-2 border-amber-200 p-8 shadow-elevated">
              <div className="text-center">
                <div className="text-xs font-bold tracking-[0.2em] text-gray-800 mb-1">SMARTCODAI ACADEMY</div>
                <div className="text-[10px] text-gray-500 mb-4">CERTIFICATION DE FIN DE PARCOURS</div>
                <div className="text-2xl font-serif font-bold text-gray-900 mb-2">Certificat de Reussite</div>
                <div className="text-sm italic text-gray-500 mb-1">Decerne a</div>
                <div className="text-xl font-serif font-bold text-gray-900 mb-2">ETUDIANT SMARTCODAI</div>
                <div className="w-48 h-px bg-amber-300 mx-auto mb-4" />
                <div className="text-xs text-gray-500">Developpement Web avec PHP</div>
                <div className="mt-6 flex justify-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-400 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[8px] font-bold text-amber-700">SMARTCODAI</div>
                      <div className="text-[7px] text-amber-600">VERIFIED</div>
                      <div className="text-lg">★</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/15 via-secondary/12 to-primary/10" />
          <div className="absolute inset-0 border border-border rounded-2xl" />
          <div className="relative px-8 py-16 sm:px-16 sm:py-20 text-center">
            <h2 className="text-3xl font-display font-extrabold mb-4">{t('landing.cta.title')}</h2>
            <p className="text-[var(--text-muted)] mb-8 max-w-xl mx-auto">{t('landing.cta.subtitle')}</p>
            <Link href="/register" className="btn btn-primary btn-lg">
              {t('landing.cta.btn')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[var(--text-muted)]">
          {t('landing.footer')}
        </div>
      </footer>
    </div>
  );
}
