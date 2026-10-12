import React, { useState } from 'react';
import { DailyEdition } from '../types.ts';
import { X, Copy, Check, Printer, Share2, FileText } from 'lucide-react';

interface ShareEditionModalProps {
  edition: DailyEdition;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareEditionModal: React.FC<ShareEditionModalProps> = ({
  edition,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getMarkdown = () => {
    let md = `═══════════════════════════════════════════════\n`;
    md += `ORBIS • CRÓNICA GLOBAL & PALABRA DEL DÍA\n`;
    md += `Edición No. ${edition.editionNumber} | ${edition.formattedDate}\n`;
    md += `═══════════════════════════════════════════════\n\n`;
    md += `🏛️ PALABRA DEL DÍA: ${edition.wordOfTheDay.word} (${edition.wordOfTheDay.phonetic})\n`;
    md += `📚 Etimología: ${edition.wordOfTheDay.etymology}\n`;
    md += `📖 Definición: ${edition.wordOfTheDay.definition}\n`;
    md += `🌐 ¿Por qué hoy?: ${edition.wordOfTheDay.whyToday}\n`;
    md += `🗞️ Titular de referencia: "${edition.wordOfTheDay.globalHeadline}"\n\n`;
    md += `───────────────────────────────────────────────\n`;
    md += `COMPILACIÓN DE INTELIGENCIA GLOBAL\n`;
    md += `───────────────────────────────────────────────\n\n`;

    edition.newsItems.forEach((item, idx) => {
      md += `${idx + 1}. [${item.category.toUpperCase()} | ${item.country}] ${item.title}\n`;
      md += `   • Resumen: ${item.summary}\n`;
      md += `   • Relevancia: ${item.whyItMatters}\n`;
      md += `   • Concepto clave: ${item.relatedConcept}\n`;
      md += `   • Fuentes: ${item.sources.join(', ')}\n\n`;
    });

    md += `Tensión Global: ${edition.worldTensionIndex}/100\n`;
    md += `Compilado por Orbis Intelligence\n`;
    return md;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getMarkdown());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-700 bg-[#0d1118] shadow-2xl overflow-hidden p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-xl font-bold text-white">
                Exportar & Compartir Edición
              </h3>
              <p className="text-xs text-slate-400">
                Formato despacho diplomático / newsletter
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

        {/* Text Preview */}
        <div className="flex-1 overflow-y-auto rounded-xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap select-all">
          {getMarkdown()}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <Printer className="h-4 w-4" />
            <span>Imprimir / PDF</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            <span>{copied ? 'Copiado al portapapeles' : 'Copiar Despacho'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
