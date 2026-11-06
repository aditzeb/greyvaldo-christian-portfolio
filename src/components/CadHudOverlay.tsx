import React, { useEffect, useState } from 'react';
import { Language, UI_COPY } from '../data/portfolioData';

interface CadHudOverlayProps {
  scrollProgress: number;
  hoveredNodeTelemetry: string | null;
  activeStageOverride: number | null;
  onSelectStage: (stage: number | null) => void;
  lang: Language;
}

export const CadHudOverlay: React.FC<CadHudOverlayProps> = ({
  scrollProgress,
  hoveredNodeTelemetry,
  activeStageOverride,
  onSelectStage,
  lang,
}) => {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const t = UI_COPY[lang];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const totalMeters = Math.round(scrollProgress * 7200);
  const km = Math.floor(totalMeters / 1000);
  const meters = (totalMeters % 1000).toString().padStart(3, '0');
  const staFormatted = `STA ${km}+${meters}`;

  const currentStage =
    activeStageOverride ?? (scrollProgress < 0.25 ? 1 : scrollProgress < 0.55 ? 2 : 3);

  const sectionLabel =
    lang === 'id'
      ? scrollProgress < 0.22
        ? '01 // PROFIL & INDIKATOR IKN'
        : scrollProgress < 0.56
        ? '02 // PENGALAMAN PROYEK'
        : scrollProgress < 0.78
        ? '03 // PENDIDIKAN & ORGANISASI'
        : '04 // KEAHLIAN & PENGHARGAAN'
      : scrollProgress < 0.22
      ? '01 // PROFILE & IKN TELEMETRY'
      : scrollProgress < 0.56
      ? '02 // WORK EXPERIENCE'
      : scrollProgress < 0.78
      ? '03 // EDUCATION & LEADERSHIP'
      : '04 // TECHNICAL SKILLS & AWARDS';

  return (
    <>
      {/* Desktop CAD HUD Overlay */}
      <div className="pointer-events-none fixed inset-0 z-30 hidden lg:block">
        <div className="absolute top-14 bottom-10 left-5 w-px bg-[#1F1F1F]" />
        <div className="absolute top-14 bottom-10 right-5 w-px bg-[#1F1F1F]" />

        <div className="pointer-events-auto fixed bottom-0 left-0 right-0 h-9 bg-[#000000]/95 border-t border-[#1F1F1F] px-6 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#0070F3]" />
              <span className="ink-label text-[#EDEDED]">{staFormatted}</span>
              <span className="ink-label text-[#8F8F8F]">/ STA 7+200</span>
            </div>

            <div className="w-24 h-1 bg-[#1F1F1F] overflow-hidden">
              <div
                className="h-full bg-[#0070F3] transition-all duration-75"
                style={{ width: `${Math.min(100, Math.max(2, scrollProgress * 100))}%` }}
              />
            </div>

            <span className="ink-label text-[#8F8F8F]">{sectionLabel}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="ink-label text-[#8F8F8F] mr-1">{t.hudEngineLabel}</span>
            {[
              { id: null, label: t.hudAuto },
              { id: 1, label: t.hudStage1 },
              { id: 2, label: t.hudStage2 },
              { id: 3, label: t.hudStage3 },
            ].map((btn) => {
              const isSelected =
                btn.id === null
                  ? activeStageOverride === null
                  : activeStageOverride === btn.id ||
                    (activeStageOverride === null && currentStage === btn.id);
              return (
                <button
                  key={String(btn.id)}
                  type="button"
                  onClick={() => onSelectStage(btn.id)}
                  className={`px-2 py-0.5 rounded-[4px] border ink-label text-[10px] transition-colors ${
                    isSelected
                      ? 'border-[#0070F3] bg-[#0A0A0A] text-[#EDEDED]'
                      : 'border-[#1F1F1F] bg-[#000000] text-[#8F8F8F] hover:text-[#EDEDED]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-5">
            {hoveredNodeTelemetry ? (
              <span className="ink-label text-[#0070F3]">{hoveredNodeTelemetry}</span>
            ) : (
              <span className="ink-label text-[#8F8F8F]">{t.hudReady}</span>
            )}
            <span className="ink-label text-[#8F8F8F]">
              X:{cursor.x.toString().padStart(4, '0')} Y:{cursor.y.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Compact Bottom CAD Telemetry & 3D Stage Bar (< lg) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#000000]/95 backdrop-blur-md border-t border-[#1F1F1F] px-3 py-1.5 pb-safe">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="w-1.5 h-1.5 bg-[#0070F3]" />
            <span className="font-mono text-[11px] font-medium text-[#EDEDED] tabular-nums">
              {staFormatted}
            </span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {[
              { id: null, label: t.hudAuto },
              { id: 1, label: '01:TRUSS' },
              { id: 2, label: '02:PAVE' },
              { id: 3, label: '03:FEM' },
            ].map((btn) => {
              const isSelected =
                btn.id === null
                  ? activeStageOverride === null
                  : activeStageOverride === btn.id ||
                    (activeStageOverride === null && currentStage === btn.id);
              return (
                <button
                  key={String(btn.id)}
                  type="button"
                  onClick={() => onSelectStage(btn.id)}
                  className={`px-2 py-1 rounded-[4px] border font-mono text-[10px] shrink-0 transition-colors ${
                    isSelected
                      ? 'border-[#0070F3] bg-[#0070F3]/15 text-[#EDEDED]'
                      : 'border-[#1F1F1F] bg-[#0A0A0A] text-[#8F8F8F]'
                  }`}
                >
                  {btn.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
