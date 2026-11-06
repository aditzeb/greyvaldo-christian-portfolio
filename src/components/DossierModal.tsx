import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Language,
  UI_COPY,
  HERO_DATA,
  EXPERIENCE_DATA,
  EDUCATION_DATA,
  LEADERSHIP_DATA,
  SKILLS_DATA,
  AWARDS_DATA,
} from '../data/portfolioData';

interface DossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const DossierModal: React.FC<DossierModalProps> = ({ isOpen, onClose, lang }) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const t = UI_COPY[lang];

  const handleCopy = (value: string, label: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadDossier = () => {
    const lines = [
      '================================================================================',
      t.dossierSpecHeader,
      `${HERO_DATA.name.toUpperCase()}`,
      `${HERO_DATA.title[lang]}`,
      '================================================================================',
      `LOCATION : ${HERO_DATA.location}`,
      `PHONE    : ${HERO_DATA.phone}`,
      `EMAIL    : ${HERO_DATA.email}`,
      `WEB      : https://greyvaldo-christian.web.app`,
      '',
      `--- ${t.dossierSec1} ---`,
      HERO_DATA.summary[lang],
      '',
      '--- KEY PERFORMANCE METRICS ---',
      ...HERO_DATA.telemetry.map((k) => `* ${k.display} — ${k.label[lang]}`),
      '',
      `--- ${t.dossierSec2} ---`,
      ...EXPERIENCE_DATA.flatMap((exp) => [
        `\n[${exp.period[lang]}] ${exp.company} — ${exp.role[lang]}`,
        `Project: ${exp.project}`,
        ...exp.highlights[lang].map((h) => `  - ${h}`),
      ]),
      '',
      `--- ${t.dossierSec3} ---`,
      `${EDUCATION_DATA.institution} (${EDUCATION_DATA.period})`,
      `${EDUCATION_DATA.degree[lang]} | GPA: ${EDUCATION_DATA.gpa} (${EDUCATION_DATA.honor[lang]})`,
      `${EDUCATION_DATA.distinction[lang]}`,
      `Coursework (${EDUCATION_DATA.creditHours} Credits): ${EDUCATION_DATA.coursework[lang].join(', ')}`,
      `${EDUCATION_DATA.capstone[lang]}`,
      '',
      '--- LEADERSHIP & ORGANIZATIONAL EXPERIENCE ---',
      ...LEADERSHIP_DATA.map(
        (l) => `* ${l.role[lang]} — ${l.organization[lang]} (${l.period}): ${l.description[lang]}`
      ),
      '',
      '--- TECHNICAL SKILLS & AWARDS ---',
      ...SKILLS_DATA.map(
        (s) => `* ${s.category[lang]}: ${s.items.map((i) => i.name[lang]).join(', ')}`
      ),
      ...AWARDS_DATA.map((a) => `* ${a.title[lang]} (${a.event}): ${a.detail[lang]}`),
      '================================================================================',
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Greyvaldo_Christian_ST_CV_${lang.toUpperCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-[#000000]/92 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl bg-[#0A0A0A] border border-[#1F1F1F] rounded-[12px] p-5 sm:p-8 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1F1F1F] gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 bg-[#0070F3]" />
                  <span className="ink-label text-[#0070F3]">{t.dossierSpecHeader}</span>
                </div>
                <h2 className="text-xl font-semibold text-[#EDEDED]">{HERO_DATA.name}</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="ink-btn-secondary py-1.5 px-3"
              >
                [{t.navClose}]
              </button>
            </div>

            {/* Direct Contact Dispatch Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="ink-label text-[#8F8F8F]">{t.dossierDirectEmail}</span>
                  <span className="ink-label text-[#0070F3]">[MAIL]</span>
                </div>
                <a
                  href={`mailto:${HERO_DATA.email}`}
                  className="ink-label text-[#EDEDED] hover:text-[#0070F3] break-all mb-2"
                >
                  {HERO_DATA.email}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(HERO_DATA.email, 'email')}
                  className="ink-label text-[11px] text-[#8F8F8F] hover:text-[#EDEDED] text-left"
                >
                  {copiedField === 'email' ? (
                    <span className="text-[#0070F3]">[{t.dossierCopied}]</span>
                  ) : (
                    <span>[{t.dossierCopy}]</span>
                  )}
                </button>
              </div>

              <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="ink-label text-[#8F8F8F]">{t.dossierDirectPhone}</span>
                  <span className="ink-label text-[#0070F3]">[TEL]</span>
                </div>
                <a
                  href="https://wa.me/6281241664556"
                  target="_blank"
                  rel="noreferrer"
                  className="ink-label text-[#EDEDED] hover:text-[#0070F3] mb-2"
                >
                  {HERO_DATA.phone}
                </a>
                <button
                  type="button"
                  onClick={() => handleCopy(HERO_DATA.phone, 'phone')}
                  className="ink-label text-[11px] text-[#8F8F8F] hover:text-[#EDEDED] text-left"
                >
                  {copiedField === 'phone' ? (
                    <span className="text-[#0070F3]">[{t.dossierCopied}]</span>
                  ) : (
                    <span>[{t.dossierCopy}]</span>
                  )}
                </button>
              </div>

              <div className="bg-[#000000] border border-[#1F1F1F] rounded-[8px] p-3.5 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-2">
                  <span className="ink-label text-[#8F8F8F]">{t.dossierBaseLocation}</span>
                  <span className="ink-label text-[#0070F3]">[LOC]</span>
                </div>
                <div className="ink-label text-[#EDEDED] mb-2">{HERO_DATA.location}</div>
                <span className="ink-label text-[11px] text-[#0070F3]">
                  {t.dossierAvailability}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pb-6 mb-6 border-b border-[#1F1F1F]">
              <button
                type="button"
                onClick={handleDownloadDossier}
                className="ink-btn-primary"
              >
                {t.dossierDownloadTxt}
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="ink-btn-secondary py-3 px-4"
              >
                [{t.dossierPrintPdf}]
              </button>
              <a
                href={`mailto:${HERO_DATA.email}?subject=Engineering%20Inquiry%20—%20Greyvaldo%20Christian,%20S.T`}
                className="ink-btn-secondary py-3 px-4"
              >
                [{t.dossierSendEmail}]
              </a>
            </div>

            {/* Executive Dossier Preview */}
            <div className="space-y-4">
              <div>
                <div className="ink-label text-[#8F8F8F] mb-1">{t.dossierSec1}</div>
                <p className="ink-body text-[#EDEDED] text-sm">{HERO_DATA.summary[lang]}</p>
              </div>

              <div className="pt-3 border-t border-[#1F1F1F]">
                <div className="ink-label text-[#8F8F8F] mb-2">{t.dossierSec2}</div>
                <div className="space-y-2.5">
                  {EXPERIENCE_DATA.map((exp) => (
                    <div
                      key={exp.id}
                      className="bg-[#000000] border border-[#1F1F1F] rounded-[6px] p-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-semibold text-sm text-[#EDEDED]">
                          {exp.company} — {exp.role[lang]}
                        </span>
                        <span className="ink-label text-[#0070F3]">{exp.period[lang]}</span>
                      </div>
                      <div className="ink-label text-[#8F8F8F] mt-1">{exp.project}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#1F1F1F] flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="ink-label text-[#8F8F8F]">{t.dossierSec3}</div>
                  <div className="text-sm font-medium text-[#EDEDED]">
                    {EDUCATION_DATA.institution} — {EDUCATION_DATA.degree[lang]}
                  </div>
                </div>
                <span className="ink-label text-[#0070F3]">
                  GPA {EDUCATION_DATA.gpa} ({EDUCATION_DATA.honor[lang].toUpperCase()})
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
