import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Language, UI_COPY } from '../data/portfolioData';

interface CadPhotoFrameProps {
  src: string;
  caption: string;
  code: string;
  telemetry?: string;
  aspectClass?: string;
  objectPosition?: string;
  lang?: Language;
}

export const CadPhotoFrame: React.FC<CadPhotoFrameProps> = ({
  src,
  caption,
  code,
  telemetry = 'QA/QC SPEC // IKN',
  aspectClass = 'aspect-[4/5]',
  objectPosition = 'object-center',
  lang = 'en',
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const t = UI_COPY[lang];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ type: 'spring', stiffness: 100, damping: 20 }}
        className="group relative bg-[#0A0A0A] border border-[#1F1F1F] hover:border-[#0070F3] rounded-[12px] p-3 sm:p-[16px] transition-colors duration-200"
      >
        {/* Top CAD Viewfinder Header Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#1F1F1F] gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span className="inline-block w-2 h-2 bg-[#0070F3] shrink-0" />
            <span className="ink-label text-[#8F8F8F] truncate">{code}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="ink-label text-[#8F8F8F] hidden sm:inline">{telemetry}</span>
            <button
              type="button"
              onClick={() => setIsLightboxOpen(true)}
              className="ink-label text-[11px] text-[#8F8F8F] hover:text-[#0070F3] transition-colors px-1.5 py-0.5 border border-[#1F1F1F] hover:border-[#0070F3] rounded-[4px]"
              title={t.photoInspect}
            >
              [+ 1:1]
            </button>
          </div>
        </div>

        {/* Image Viewport with Surgical Corner Crosshairs */}
        <div
          onClick={() => setIsLightboxOpen(true)}
          className={`relative w-full ${aspectClass} overflow-hidden rounded-[6px] border border-[#1F1F1F] bg-[#000000] cursor-pointer`}
        >
          <img
            src={src}
            alt={caption}
            loading="lazy"
            className={`w-full h-full object-cover ${objectPosition} grayscale-[35%] sm:grayscale-[55%] contrast-[1.06] group-hover:grayscale-0 group-hover:scale-[1.015] transition-all duration-500 ease-out`}
          />

          {/* Surgical CAD Reticle Corners */}
          <div className="pointer-events-none absolute inset-2 sm:inset-2.5 border border-[#8F8F8F]/20">
            <div className="absolute -top-[1px] -left-[1px] w-2.5 h-2.5 border-t border-l border-[#0070F3]" />
            <div className="absolute -top-[1px] -right-[1px] w-2.5 h-2.5 border-t border-r border-[#0070F3]" />
            <div className="absolute -bottom-[1px] -left-[1px] w-2.5 h-2.5 border-b border-l border-[#0070F3]" />
            <div className="absolute -bottom-[1px] -right-[1px] w-2.5 h-2.5 border-b border-r border-[#0070F3]" />
          </div>

          {/* Live Viewfinder Coordinate Badge */}
          <div className="pointer-events-none absolute bottom-2.5 right-2.5 bg-[#000000]/85 border border-[#1F1F1F] px-2 py-1 rounded-[6px] flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#0070F3]" />
            <span className="font-mono text-[10px] sm:text-[11px] text-[#EDEDED]">
              {t.photoInspect}
            </span>
          </div>
        </div>

        {/* Bottom Geist Mono Metadata Caption Bar */}
        <div className="mt-2.5 pt-2.5 border-t border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <p className="font-mono text-[11px] sm:text-xs text-[#EDEDED] leading-relaxed break-words">
            {caption}
          </p>
          <span className="font-mono text-[10px] sm:text-xs text-[#0070F3] shrink-0">
            {t.photoVerified}
          </span>
        </div>
      </motion.div>

      {/* High-Precision CAD Inspection Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLightboxOpen(false)}
            className="fixed inset-0 z-50 bg-[#000000]/95 flex items-center justify-center p-3 sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl bg-[#0A0A0A] border border-[#1F1F1F] rounded-[12px] p-3.5 sm:p-6"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1F1F1F] gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2 h-2 bg-[#0070F3] shrink-0" />
                  <span className="ink-label text-[#EDEDED] truncate">{code}</span>
                  <span className="ink-label text-[#8F8F8F] hidden sm:inline">// {telemetry}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="ink-btn-secondary py-1.5 px-3 shrink-0"
                >
                  [{t.navClose}]
                </button>
              </div>
              <div className="relative bg-[#000000] border border-[#1F1F1F] rounded-[8px] overflow-hidden max-h-[70vh] sm:max-h-[75vh] flex items-center justify-center">
                <img
                  src={src}
                  alt={caption}
                  className="max-h-[70vh] sm:max-h-[75vh] w-auto object-contain"
                />
              </div>
              <div className="mt-3 pt-3 border-t border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <span className="font-mono text-[11px] sm:text-xs text-[#EDEDED] break-words">
                  {caption}
                </span>
                <span className="font-mono text-[10px] sm:text-xs text-[#0070F3] shrink-0">
                  {t.photoArchive}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
