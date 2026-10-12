import React, { useState } from 'react';
import { GlobalNewsItem } from '../types.ts';
import {
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Sparkles,
  ShieldAlert,
  Share2,
  Check,
  BookOpen,
} from 'lucide-react';

interface NewsCardProps {
  item: GlobalNewsItem;
  isSelected?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item, isSelected }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'geopolitica': return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
      case 'tecnologia': return { text: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/30' };
      case 'economia': return { text: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' };
      case 'clima': return { text: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' };
      case 'sociedad': return { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
      default: return { text: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30' };
    }
  };

  const style = categoryColor(item.category);

  const handleCopy = async () => {
    const text = `📰 [${item.country} • ${item.category.toUpperCase()}] ${item.title}\n\n${item.summary}\n\nPor qué importa: ${item.whyItMatters}\nFuentes: ${item.sources.join(', ')}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div
      id={`news-${item.id}`}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        isSelected
          ? 'border-amber-500/80 bg-slate-900/90 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/50'
          : 'border-slate-800/80 bg-[#0f131b]/80 hover:border-slate-700 hover:bg-[#121722]'
      } p-5 sm:p-6`}
    >
      {/* Top Meta info */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider ${style.text} ${style.bg} ${style.border}`}
          >
            {item.category}
          </span>
          <span className="flex items-center gap-1 text-slate-300 font-medium">
            <MapPin className="h-3 w-3 text-slate-400" />
            {item.country} ({item.region})
          </span>
        </div>

        <div className="flex items-center gap-3 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1 font-mono">
            <Clock className="h-3 w-3" />
            {item.readTimeMinutes} min
          </span>
          <span className="flex items-center gap-1">
            <span className="text-slate-400 font-mono">Impacto:</span>
            <span className="font-mono font-bold text-amber-400">{'★'.repeat(item.impactScore)}</span>
          </span>
          <button
            onClick={handleCopy}
            title="Copiar resumen"
            className="rounded p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Title */}
      <h3 className="font-serif-editorial text-xl sm:text-2xl font-bold leading-snug text-slate-100 group-hover:text-amber-100/95 transition-colors">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="mt-2.5 font-serif-editorial text-sm sm:text-base leading-relaxed text-slate-300">
        {item.summary}
      </p>

      {/* 3 Key Takeaways */}
      <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-900/60 p-3.5">
        <div className="mb-2 text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-400" />
          En 30 segundos (Puntos Clave):
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300 font-serif-editorial">
          {item.keyPoints.map((pt, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="text-amber-400 select-none">•</span>
              <span className="leading-relaxed">{pt}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Why it matters banner */}
      <div className="mt-3.5 rounded-xl border border-slate-800 bg-[#0b0e14] p-3 text-xs">
        <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400/90 font-semibold">
          Relevancia Planetaria:
        </span>
        <p className="mt-0.5 font-serif-editorial text-slate-300 leading-relaxed italic">
          {item.whyItMatters}
        </p>
      </div>

      {/* Bottom bar with Concept tag and sources */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono text-slate-400">Concepto clave:</span>
          <span className="rounded-md bg-amber-500/10 px-2 py-0.5 font-medium text-amber-300 ring-1 ring-amber-500/30">
            {item.relatedConcept}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {item.detailedAnalysis && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 rounded-lg bg-slate-800/90 px-2.5 py-1 text-[11px] font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
            >
              <BookOpen className="h-3 w-3 text-amber-400" />
              <span>{isExpanded ? 'Cerrar análisis' : 'Lectura de fondo'}</span>
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Deep Analysis */}
      {isExpanded && item.detailedAnalysis && (
        <div className="mt-4 rounded-xl border border-amber-500/20 bg-slate-900/90 p-4 animate-fadeIn">
          <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
            Análisis de Fondo & Dinámica Geopolítica
          </h4>
          <p className="font-serif-editorial text-sm leading-relaxed text-slate-200">
            {item.detailedAnalysis}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-800 pt-2 text-[11px] text-slate-400 font-mono">
            <span>Fuentes acreditadas:</span>
            {item.sources.map((s, idx) => (
              <span key={idx} className="rounded bg-slate-800 px-1.5 py-0.5 text-slate-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
