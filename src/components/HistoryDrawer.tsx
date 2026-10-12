import React from 'react';
import { DailyEdition } from '../types.ts';
import { X, Calendar, ChevronRight, Sparkles, BookOpen } from 'lucide-react';

interface HistoryDrawerProps {
  editions: DailyEdition[];
  currentEditionDate: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectEdition: (edition: DailyEdition) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  editions,
  currentEditionDate,
  isOpen,
  onClose,
  onSelectEdition,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md h-full bg-[#0c1017] border-l border-slate-800 p-6 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
              <Calendar className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-xl font-bold text-white">
                Hemeroteca de Ediciones
              </h3>
              <p className="text-xs text-slate-400">
                Archivo histórico de palabras y crónicas
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Editions list */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {editions.map((ed) => {
            const isCurrent = ed.date === currentEditionDate;
            return (
              <div
                key={ed.date}
                onClick={() => {
                  onSelectEdition(ed);
                  onClose();
                }}
                className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                  isCurrent
                    ? 'border-amber-500/60 bg-amber-500/10 ring-1 ring-amber-500/30 shadow-lg shadow-amber-500/10'
                    : 'border-slate-800/80 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5 text-[11px] font-mono">
                  <span className="text-slate-400">No. {ed.editionNumber} • {ed.formattedDate}</span>
                  {isCurrent && (
                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-amber-300 font-bold">
                      Actual
                    </span>
                  )}
                </div>

                <div className="flex items-baseline justify-between gap-2">
                  <h4 className="font-serif-editorial text-xl font-bold text-white">
                    {ed.wordOfTheDay.word}
                  </h4>
                  <span className="text-[10px] uppercase font-mono text-slate-500">
                    {ed.wordOfTheDay.category}
                  </span>
                </div>

                <p className="mt-1 font-serif-editorial text-xs text-slate-400 line-clamp-2">
                  {ed.dominantTheme}
                </p>

                <div className="mt-3 flex items-center justify-between text-[11px] border-t border-slate-800/60 pt-2 text-slate-500">
                  <span>{ed.newsItems.length} despachos compilados</span>
                  <span className="text-amber-400/90 flex items-center gap-1 font-medium group-hover:translate-x-1 transition-transform">
                    Leer edición <ChevronRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
