import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import {
  Language,
  UI_COPY,
  HERO_DATA,
  EXPERIENCE_DATA,
  EDUCATION_DATA,
  LEADERSHIP_DATA,
  SKILLS_DATA,
  AWARDS_DATA,
} from './data/portfolioData';
import { StructuralCanvas } from './components/StructuralCanvas';
import { CadPhotoFrame } from './components/CadPhotoFrame';
import { CadHudOverlay } from './components/CadHudOverlay';
import { AnimatedCounter } from './components/AnimatedCounter';
import { DossierModal } from './components/DossierModal';
import { FinanceVault } from './components/FinanceVault';

const LANG_STORAGE_KEY = 'greyvaldo_lang_pref';

export function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    return saved === 'id' ? 'id' : 'en';
  });
  const [activeView, setActiveView] = useState<'portfolio' | 'vault'>('portfolio');
  const [isDossierOpen, setIsDossierOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hoveredNodeTelemetry, setHoveredNodeTelemetry] = useState<string | null>(null);
  const [activeStageOverride, setActiveStageOverride] = useState<number | null>(null);

  const t = UI_COPY[lang];
  const { scrollYProgress } = useScroll();

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setScrollProgress(latest);
  });

  useEffect(() => {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }, [lang]);

  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#vault') {
        setActiveView('vault');
      }
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    if (activeView !== 'portfolio') {
      setActiveView('portfolio');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 60);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-[#EDEDED] relative selection:bg-[#0070F3] selection:text-[#FFFFFF]">
      {/* Fixed 3D WebGL Structural Canvas Background */}
      <StructuralCanvas
        scrollProgress={scrollProgress}
        activeStageOverride={activeStageOverride}
        onNodeHover={setHoveredNodeTelemetry}
      />

      {/* Viewport CAD HUD Overlay */}
      {activeView === 'portfolio' && (
        <CadHudOverlay
          scrollProgress={scrollProgress}
          hoveredNodeTelemetry={hoveredNodeTelemetry}
          activeStageOverride={activeStageOverride}
          onSelectStage={setActiveStageOverride}
          lang={lang}
        />
      )}

      {/* Surgical Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-40 h-14 bg-[#000000]/92 backdrop-blur-md border-b border-[#1F1F1F] px-3 sm:px-8 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen(false);
            setActiveView('portfolio');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-left group min-w-0"
        >
          <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#0070F3] shrink-0" />
          <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-tight text-[#EDEDED] group-hover:text-[#0070F3] transition-colors truncate">
            GREYVALDO CHRISTIAN, S.T
          </span>
          <span className="ink-label text-[#8F8F8F] hidden xl:inline">{t.navRole}</span>
        </button>

        <nav className="hidden lg:flex items-center gap-6">
          {[
            { id: 'hero', label: t.navProfile },
            { id: 'experience', label: t.navExperience },
            { id: 'education', label: t.navEducation },
            { id: 'skills', label: t.navSkills },
          ].map((nav) => (
            <button
              key={nav.id}
              type="button"
              onClick={() => navigateToSection(nav.id)}
              className="ink-label text-[#8F8F8F] hover:text-[#EDEDED] transition-colors"
            >
              {nav.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Bilingual EN / ID Toggle */}
          <div className="flex items-center bg-[#0A0A0A] border border-[#1F1F1F] rounded-[6px] p-0.5">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-1 rounded-[4px] font-mono text-[10px] sm:text-[11px] transition-colors ${
                lang === 'en'
                  ? 'bg-[#0070F3] text-[#FFFFFF] font-semibold'
                  : 'text-[#8F8F8F] hover:text-[#EDEDED]'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('id')}
              className={`px-2 py-1 rounded-[4px] font-mono text-[10px] sm:text-[11px] transition-colors ${
                lang === 'id'
                  ? 'bg-[#0070F3] text-[#FFFFFF] font-semibold'
                  : 'text-[#8F8F8F] hover:text-[#EDEDED]'
              }`}
            >
              ID
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsMobileMenuOpen(false);
              setActiveView((prev) => (prev === 'vault' ? 'portfolio' : 'vault'));
            }}
            className={`ink-btn-secondary py-1.5 px-2.5 sm:px-3 text-[11px] sm:text-xs ${
              activeView === 'vault'
                ? 'border-[#0070F3] text-[#0070F3]'
                : 'border-[#1F1F1F] text-[#EDEDED]'
            }`}
          >
            {t.navVault}
          </button>

          {/* Mobile Menu Toggle Button (< lg) */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
            className="lg:hidden bg-[#0A0A0A] border border-[#1F1F1F] hover:border-[#0070F3] rounded-[8px] px-2.5 py-1.5 font-mono text-[11px] text-[#EDEDED]"
          >
            [{isMobileMenuOpen ? t.navClose : t.navMenu}]
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer (< lg) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="fixed top-14 left-0 right-0 z-40 lg:hidden bg-[#0A0A0A] border-b border-[#1F1F1F] px-4 py-4 shadow-2xl"
          >
            <div className="flex flex-col space-y-2">
              {[
                { id: 'hero', label: t.navProfile },
                { id: 'experience', label: t.navExperience },
                { id: 'education', label: t.navEducation },
                { id: 'skills', label: t.navSkills },
              ].map((nav) => (
                <button
                  key={nav.id}
                  type="button"
                  onClick={() => navigateToSection(nav.id)}
                  className="w-full text-left bg-[#000000] border border-[#1F1F1F] active:border-[#0070F3] rounded-[8px] px-3.5 py-2.5 font-mono text-xs text-[#EDEDED] flex items-center justify-between"
                >
                  <span>{nav.label}</span>
                  <span className="text-[#0070F3]">-&gt;</span>
                </button>
              ))}

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setIsDossierOpen(true);
                  }}
                  className="ink-btn-primary w-full text-center py-2.5"
                >
                  {t.heroPrimaryCta}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conditional View: PIN-Protected Financial Vault vs. Public Engineering Portfolio */}
      {activeView === 'vault' ? (
        <FinanceVault onBackToPortfolio={() => setActiveView('portfolio')} lang={lang} />
      ) : (
        <main className="relative z-10 max-w-7xl mx-auto px-3.5 sm:px-10 pt-20 sm:pt-24 pb-24 space-y-20 sm:space-y-28">
          {/* ================================================================= */}
          {/* SECTION 1: HERO & ARCHITECTURAL TELEMETRY STRIP                   */}
          {/* ================================================================= */}
          <section id="hero" className="pt-2 sm:pt-4">
            {/* Exact Metadata Bar (Geist Mono) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="w-full sm:w-auto flex flex-col sm:inline-flex sm:flex-row sm:flex-wrap items-start sm:items-center gap-y-2 sm:gap-x-4 sm:gap-y-1.5 bg-[#0A0A0A] border border-[#1F1F1F] rounded-[8px] px-3.5 py-2.5 sm:px-4 sm:py-2 mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 ink-label text-[#EDEDED]">
                <span className="w-2 h-2 bg-[#0070F3] shrink-0" />
                {HERO_DATA.location}
              </span>
              <span className="hidden sm:inline text-[#1F1F1F]">|</span>
              <a
                href={`tel:${HERO_DATA.phone}`}
                className="ink-label text-[#8F8F8F] hover:text-[#0070F3] transition-colors"
              >
                TEL: {HERO_DATA.phone}
              </a>
              <span className="hidden sm:inline text-[#1F1F1F]">|</span>
              <a
                href={`mailto:${HERO_DATA.email}`}
                className="ink-label text-[#8F8F8F] hover:text-[#0070F3] transition-colors break-all"
              >
                MAIL: {HERO_DATA.email}
              </a>
            </motion.div>

            {/* Main Hero Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start">
              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="lg:col-span-7 space-y-5 sm:space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-[6px] bg-[#0A0A0A] border border-[#1F1F1F] max-w-full">
                  <span className="w-1.5 h-1.5 bg-[#0070F3] shrink-0" />
                  <span className="font-mono text-[10px] sm:text-xs text-[#0070F3] truncate">
                    {t.heroBadge}
                  </span>
                </div>

                <h1 className="ink-display">{HERO_DATA.name}</h1>

                <h2 className="text-lg sm:text-2xl font-medium text-[#EDEDED] tracking-tight leading-snug">
                  {HERO_DATA.title[lang]}
                </h2>

                <div className="ink-card">
                  <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#1F1F1F] gap-2">
                    <span className="ink-label text-[#8F8F8F] truncate">
                      {t.heroSpecTitle}
                    </span>
                    <span className="ink-label text-[#0070F3] shrink-0">{t.heroSpecRole}</span>
                  </div>
                  <p className="ink-body text-[#EDEDED]">{HERO_DATA.summary[lang]}</p>
                </div>

                {/* Single Primary Action Button on Hero Screen per Vercel Ink Rule */}
                <div className="pt-1 sm:pt-2 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setIsDossierOpen(true)}
                    className="ink-btn-primary w-full sm:w-auto text-center"
                  >
                    {t.heroPrimaryCta}
                  </button>

                  <span className="ink-label text-[#8F8F8F] text-center sm:text-left">
                    [{t.heroSubTags}]
                  </span>
                </div>
              </motion.div>

              {/* Right Column: Hero Section Portrait Card */}
              <div className="lg:col-span-5">
                <CadPhotoFrame
                  src={HERO_DATA.portrait.src}
                  caption={HERO_DATA.portrait.caption[lang]}
                  code={HERO_DATA.portrait.code}
                  telemetry={HERO_DATA.portrait.coordinates}
                  aspectClass="aspect-[4/5]"
                  objectPosition="object-top"
                  lang={lang}
                />
              </div>
            </div>

            {/* Architectural Telemetry Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-10">
              {HERO_DATA.telemetry.map((kpi, index) => (
                <motion.div
                  key={kpi.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    delay: index * 0.06,
                  }}
                  className="ink-card flex flex-col justify-between hover:border-[#0070F3] transition-colors"
                >
                  <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-[#1F1F1F]">
                    <span className="ink-label text-[#8F8F8F]">{kpi.code}</span>
                    <span className="w-1.5 h-1.5 bg-[#0070F3]" />
                  </div>
                  <div className="font-mono text-2xl sm:text-4xl font-semibold text-[#EDEDED] tracking-tight my-0.5 sm:my-1">
                    <AnimatedCounter
                      prefix={kpi.prefix}
                      target={kpi.numericValue}
                      suffix={kpi.suffix}
                    />
                  </div>
                  <p className="ink-label text-[#8F8F8F] mt-1.5 sm:mt-2 leading-relaxed">
                    {kpi.label[lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 2: WORK EXPERIENCE (LONGITUDINAL TIMELINE)                */}
          {/* ================================================================= */}
          <section id="experience" className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-[#1F1F1F]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#0070F3] shrink-0" />
                  <span className="ink-label text-[#0070F3]">{t.expSectionCode}</span>
                </div>
                <h2 className="ink-h1">{t.expSectionTitle}</h2>
              </div>
              <span className="ink-label text-[#8F8F8F]">{t.expSectionRight}</span>
            </div>

            <div className="relative pl-3.5 sm:pl-8 border-l border-[#1F1F1F] space-y-8 sm:space-y-12">
              {EXPERIENCE_DATA.map((exp) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 22 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="relative"
                >
                  <div className="absolute -left-[19px] sm:-left-[37px] top-6 w-2.5 h-2.5 bg-[#0070F3] border border-[#000000]" />

                  <div className="ink-card space-y-5 sm:space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 sm:pb-4 border-b border-[#1F1F1F]">
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <span className="px-2.5 py-1 rounded-[6px] bg-[#000000] border border-[#0070F3] ink-label text-[#0070F3]">
                          {exp.staCode}
                        </span>
                        <span className="ink-label text-[#8F8F8F]">{exp.elevation}</span>
                      </div>
                      <span className="ink-label text-[#EDEDED] bg-[#000000] border border-[#1F1F1F] px-2.5 py-1 rounded-[6px]">
                        {exp.period[lang]}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg sm:text-2xl font-semibold text-[#EDEDED] leading-snug">
                        {exp.company} — <span className="text-[#0070F3]">{exp.role[lang]}</span>
                      </h3>
                      <div className="mt-2.5 p-3 bg-[#000000] border border-[#1F1F1F] rounded-[8px]">
                        <div className="ink-label text-[#8F8F8F] mb-0.5">{t.expProjectLabel}</div>
                        <div className="font-medium text-sm text-[#EDEDED] leading-relaxed">
                          {exp.project}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                      {exp.metrics.map((m) => (
                        <div
                          key={m.label.en}
                          className="bg-[#000000] border border-[#1F1F1F] rounded-[6px] p-2.5 sm:p-3"
                        >
                          <div className="ink-label text-[10px] text-[#8F8F8F]">
                            {m.label[lang]}
                          </div>
                          <div className="ink-label text-xs sm:text-sm text-[#EDEDED] mt-1 font-semibold">
                            {m.value}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div
                      className={`grid grid-cols-1 ${
                        exp.photo ? 'lg:grid-cols-12' : ''
                      } gap-5 sm:gap-6 items-start`}
                    >
                      <ul
                        className={`${
                          exp.photo ? 'lg:col-span-7' : ''
                        } space-y-2.5 sm:space-y-3`}
                      >
                        {exp.highlights[lang].map((bullet, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2.5 sm:gap-3 bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3 sm:p-3.5"
                          >
                            <span className="ink-label text-[#0070F3] mt-0.5 shrink-0">
                              0{idx + 1}
                            </span>
                            <p className="ink-body text-sm text-[#EDEDED]">{bullet}</p>
                          </li>
                        ))}
                      </ul>

                      {exp.photo && (
                        <div className="lg:col-span-5">
                          <CadPhotoFrame
                            src={exp.photo.src}
                            caption={exp.photo.caption[lang]}
                            code={exp.photo.code}
                            telemetry={exp.photo.telemetry}
                            aspectClass="aspect-square"
                            lang={lang}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 3: EDUCATION & LEADERSHIP EXPERIENCE                      */}
          {/* ================================================================= */}
          <section id="education" className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-[#1F1F1F]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#0070F3] shrink-0" />
                  <span className="ink-label text-[#0070F3]">{t.eduSectionCode}</span>
                </div>
                <h2 className="ink-h1">{t.eduSectionTitle}</h2>
              </div>
              <span className="ink-label text-[#8F8F8F]">{t.eduSectionRight}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="lg:col-span-7 ink-card space-y-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 sm:pb-4 border-b border-[#1F1F1F]">
                  <span className="ink-label text-[#0070F3]">{t.eduSpecHeader}</span>
                  <span className="ink-label text-[#EDEDED] bg-[#000000] border border-[#1F1F1F] px-2.5 py-1 rounded-[6px]">
                    {EDUCATION_DATA.period}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-[#EDEDED]">
                    {EDUCATION_DATA.institution}
                  </h3>
                  <p className="text-base sm:text-lg font-medium text-[#0070F3] mt-1">
                    {EDUCATION_DATA.degree[lang]}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-[#000000] border border-[#0070F3] rounded-[8px] p-3.5 sm:p-4">
                    <div className="ink-label text-[#8F8F8F]">{t.eduGpaLabel}</div>
                    <div className="font-mono text-2xl sm:text-3xl font-semibold text-[#EDEDED] mt-1">
                      <AnimatedCounter target={3.64} decimals={2} suffix=" / 4.00" />
                    </div>
                    <div className="ink-label text-[#0070F3] mt-1">
                      {EDUCATION_DATA.honor[lang].toUpperCase()}
                    </div>
                  </div>

                  <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3.5 sm:p-4 flex flex-col justify-between">
                    <div className="ink-label text-[#8F8F8F]">{t.eduRankLabel}</div>
                    <div className="text-sm font-medium text-[#EDEDED] mt-1">
                      {EDUCATION_DATA.distinction[lang]}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="ink-label text-[#8F8F8F] mb-2">{t.eduCourseworkLabel}</div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {EDUCATION_DATA.coursework[lang].map((course) => (
                      <span
                        key={course}
                        className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-[6px] bg-[#000000] border border-[#1F1F1F] ink-label text-[#EDEDED]"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3.5 sm:p-4">
                  <div className="ink-label text-[#0070F3] mb-1">{t.eduCapstoneLabel}</div>
                  <p className="ink-body text-sm text-[#EDEDED]">
                    {EDUCATION_DATA.capstone[lang]}
                  </p>
                </div>
              </motion.div>

              <div className="lg:col-span-5">
                <CadPhotoFrame
                  src={EDUCATION_DATA.photo.src}
                  caption={EDUCATION_DATA.photo.caption[lang]}
                  code={EDUCATION_DATA.photo.code}
                  telemetry={EDUCATION_DATA.photo.telemetry}
                  aspectClass="aspect-[16/10]"
                  lang={lang}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              {LEADERSHIP_DATA.map((item, idx) => (
                <motion.div
                  key={item.staCode}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    delay: idx * 0.06,
                  }}
                  className="ink-card flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F1F1F] gap-2">
                      <span className="ink-label text-[#0070F3]">{item.staCode}</span>
                      <span className="ink-label text-[#8F8F8F]">{item.period}</span>
                    </div>
                    <h4 className="font-semibold text-base text-[#EDEDED]">{item.role[lang]}</h4>
                    <div className="ink-label text-[#8F8F8F] mt-1 mb-3">
                      {item.organization[lang]}
                    </div>
                  </div>
                  <p className="ink-body text-sm text-[#EDEDED] pt-3 border-t border-[#1F1F1F]">
                    {item.description[lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* SECTION 4: TECHNICAL SKILLS & ACHIEVEMENTS GRID                   */}
          {/* ================================================================= */}
          <section id="skills" className="space-y-8 sm:space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 pb-5 sm:pb-6 border-b border-[#1F1F1F]">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 bg-[#0070F3] shrink-0" />
                  <span className="ink-label text-[#0070F3]">{t.skillsSectionCode}</span>
                </div>
                <h2 className="ink-h1">{t.skillsSectionTitle}</h2>
              </div>
              <span className="ink-label text-[#8F8F8F]">{t.skillsSectionRight}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {SKILLS_DATA.map((group, idx) => (
                <motion.div
                  key={group.code}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    delay: idx * 0.05,
                  }}
                  className="ink-card"
                >
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#1F1F1F]">
                    <span className="ink-label text-[#0070F3]">{group.code}</span>
                    <span className="ink-label text-[#8F8F8F]">{t.skillsVerified}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#EDEDED] mb-3.5 sm:mb-4">
                    {group.category[lang]}
                  </h3>
                  <div className="space-y-2.5">
                    {group.items.map((skill) => (
                      <div
                        key={skill.name.en}
                        className="bg-[#000000] border border-[#1F1F1F] rounded-[6px] p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-1.5 h-1.5 bg-[#0070F3] shrink-0" />
                          <span className="font-medium text-sm text-[#EDEDED]">
                            {skill.name[lang]}
                          </span>
                        </div>
                        <span className="ink-label text-[11px] sm:text-xs text-[#8F8F8F] pl-4 sm:pl-0 sm:text-right">
                          {skill.spec[lang]}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {AWARDS_DATA.map((award, idx) => (
                <motion.div
                  key={award.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    type: 'spring',
                    stiffness: 100,
                    damping: 20,
                    delay: idx * 0.06,
                  }}
                  className="ink-card border-[#1F1F1F] hover:border-[#0070F3] transition-colors flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F1F1F] gap-2">
                      <span className="ink-label text-[#8F8F8F] truncate">{award.code}</span>
                      <span className="px-2 py-0.5 rounded-[4px] bg-[#000000] border border-[#0070F3] ink-label text-[#0070F3] shrink-0">
                        {award.metric}
                      </span>
                    </div>
                    <h4 className="font-semibold text-base text-[#EDEDED] mb-1.5">
                      {award.title[lang]}
                    </h4>
                    <div className="ink-label text-[#0070F3] mb-3">{award.event}</div>
                  </div>
                  <p className="ink-body text-sm text-[#EDEDED] pt-3 border-t border-[#1F1F1F]">
                    {award.detail[lang]}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ================================================================= */}
          {/* FOOTER                                                            */}
          {/* ================================================================= */}
          <footer className="pt-6 sm:pt-8 border-t border-[#1F1F1F]">
            <div className="ink-card flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#0070F3] shrink-0" />
                  <span className="ink-label text-[#0070F3]">{t.footerStatus}</span>
                </div>
                <h3 className="text-lg font-semibold text-[#EDEDED]">{HERO_DATA.name}</h3>
                <p className="ink-label text-[#8F8F8F] break-words">
                  {HERO_DATA.location} | {HERO_DATA.phone} | {HERO_DATA.email}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setIsDossierOpen(true)}
                  className="ink-btn-primary text-center"
                >
                  {t.footerDossierBtn}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveView('vault');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="ink-btn-secondary py-3 px-4 text-center"
                >
                  {t.footerVaultBtn}
                </button>
              </div>
            </div>
          </footer>
        </main>
      )}

      {/* Printable Engineering Dossier & Direct Contact Modal */}
      <DossierModal
        isOpen={isDossierOpen}
        onClose={() => setIsDossierOpen(false)}
        lang={lang}
      />
    </div>
  );
}

export default App;
