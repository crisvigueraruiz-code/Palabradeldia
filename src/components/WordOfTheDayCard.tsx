import React, { useState } from 'react';
import { WordOfTheDay } from '../types.ts';
import {
  Volume2,
  Bookmark,
  BookmarkCheck,
  Share2,
  Sparkles,
  BookOpen,
  History,
  Compass,
  Check,
  Lightbulb,
  MessageSquare,
  HelpCircle,
  TrendingUp,
} from 'lucide-react';
import { speechManager } from '../utils/audioSpeech.ts';

interface WordOfTheDayCardProps {
  word: WordOfTheDay;
  dateStr: string;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenDeepDive: () => void;
}

export const WordOfTheDayCard: React.FC<WordOfTheDayCardProps> = ({
  word,
  dateStr,
  isSaved,
  onToggleSave,
  onOpenDeepDive,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [copied, setCopied] = useState(false);

  const handlePlayPronunciation = () => {
    if (isPlayingAudio) {
      speechManager.stop();
      setIsPlayingAudio(false);
      return;
    }

    const narrationText = `${word.word}. ${word.partOfSpeech}. Definición: ${word.definition}. ¿Por qué es la palabra clave de hoy?: ${word.whyToday}`;
    setIsPlayingAudio(true);
    speechManager.speak(narrationText, 0.95, () => {
      setIsPlayingAudio(false);
    });
  };

  const handleCopyCard = async () => {
    const textToCopy = `🏛️ PALABRA DEL DÍA [${dateStr}]: ${word.word} (${word.phonetic})
📚 Etimología: ${word.etymology}
📖 Definición: ${word.definition}
🌐 ¿Por qué hoy?: ${word.whyToday}
🗞️ En la prensa: "${word.contextQuote}"
💡 Vía Orbis • Compilación Global Diaria`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'geopolitica': return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      case 'tecnologia': return 'text-sky-400 bg-sky-500/10 border-sky-500/30';
      case 'economia': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'clima': return 'text-teal-400 bg-teal-500/10 border-teal-500/30';
      case 'sociedad': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      default: return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    }
  };

  return (
    <article className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-b from-[#161a23] via-[#0f131a] to-[#0c0e14] p-6 sm:p-8 md:p-10 shadow-2xl">
      {/* Decorative ambient illumination */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-sky-500/5 blur-3xl" />

      {/* Top Banner Tag */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="font-display-classic text-xs font-bold uppercase tracking-widest text-amber-300">
            Léxico de la Jornada
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-xs font-mono text-slate-400">{dateStr}</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${categoryColor(
              word.category
            )}`}
          >
            {word.category}
          </span>
        </div>
      </div>

      {/* Word Headline & Phonetics */}
      <div className="mb-6 flex flex-col md:flex-row md:items-baseline md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-4 flex-wrap">
            <h2 className="font-serif-editorial text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white selection:bg-amber-500/30">
              {word.word}
            </h2>
            <button
              onClick={handlePlayPronunciation}
              title={isPlayingAudio ? 'Detener pronunciación' : 'Escuchar pronunciación y resumen'}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isPlayingAudio
                  ? 'bg-amber-500 text-slate-950 font-semibold ring-2 ring-amber-300 animate-pulse'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
              }`}
            >
              <Volume2 className={`h-4 w-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              <span>{isPlayingAudio ? 'Reproduciendo...' : 'Pronunciar'}</span>
            </button>
          </div>

          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <span className="font-mono-code text-amber-300/90 tracking-wide font-medium">
              {word.phonetic}
            </span>
            <span className="text-slate-600">•</span>
            <span className="italic text-slate-400">{word.partOfSpeech}</span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={onToggleSave}
            className={`flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-xs font-medium transition-all ${
              isSaved
                ? 'border-amber-500/50 bg-amber-500/20 text-amber-300 shadow-lg shadow-amber-500/10'
                : 'border-slate-800 bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
            <span>{isSaved ? 'Guardada' : 'Guardar palabra'}</span>
          </button>

          <button
            onClick={handleCopyCard}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2 text-xs font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Share2 className="h-4 w-4" />}
            <span>{copied ? 'Copiada' : 'Compartir'}</span>
          </button>

          <button
            onClick={onOpenDeepDive}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-semibold text-amber-300 transition-all hover:bg-amber-500/25 hover:border-amber-400"
          >
            <Sparkles className="h-4 w-4 text-amber-300" />
            <span>Profundizar con IA</span>
          </button>
        </div>
      </div>

      {/* Etymology provenance bar */}
      <div className="mb-6 rounded-2xl border border-slate-800/90 bg-slate-900/60 p-4 sm:p-5 backdrop-blur-sm">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
              Genealogía & Etimología
            </h4>
            <p className="mt-1 font-serif-editorial text-sm sm:text-base leading-relaxed text-slate-200">
              {word.etymology}
            </p>
          </div>
        </div>
      </div>

      {/* Main Definition in majestic format */}
      <div className="mb-7">
        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5 mb-2">
          <Compass className="h-3.5 w-3.5" />
          Definición Esencial
        </h4>
        <p className="font-serif-editorial text-lg sm:text-xl md:text-2xl font-medium leading-relaxed text-slate-100">
          «{word.definition}»
        </p>
      </div>

      {/* Grid: Why today? & Citizen Impact */}
      <div className="mb-7 grid gap-5 md:grid-cols-2">
        {/* Why Today? */}
        <div className="rounded-2xl border border-amber-500/25 bg-amber-950/20 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300 font-mono mb-2.5">
            <TrendingUp className="h-4 w-4 text-amber-400" />
            ¿Por qué es la palabra clave hoy?
          </div>
          <p className="font-serif-editorial text-sm sm:text-base leading-relaxed text-slate-200">
            {word.whyToday}
          </p>
          {word.globalHeadline && (
            <div className="mt-4 border-t border-amber-500/20 pt-3">
              <span className="text-[11px] font-mono uppercase text-amber-400/80">En prensa:</span>
              <p className="mt-1 font-serif-editorial text-xs italic text-amber-100/90">
                {word.globalHeadline}
              </p>
            </div>
          )}
        </div>

        {/* Impact on common citizen */}
        <div className="rounded-2xl border border-sky-500/20 bg-sky-950/15 p-5 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300 font-mono mb-2.5">
            <Lightbulb className="h-4 w-4 text-sky-400" />
            Impacto en la vida cotidiana
          </div>
          <p className="font-serif-editorial text-sm sm:text-base leading-relaxed text-slate-200">
            {word.citizenImpact}
          </p>
          {word.contextQuote && (
            <div className="mt-4 border-t border-sky-500/20 pt-3">
              <span className="text-[11px] font-mono uppercase text-sky-400/80">Cita editorial:</span>
              <p className="mt-1 font-serif-editorial text-xs italic text-slate-300">
                {word.contextQuote}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Conceptual Network: Synonyms, Antonyms, Precedents */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-800/80 pt-5 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-slate-400 font-medium">Sinónimos afines:</span>
          {word.synonyms.map((s, idx) => (
            <span
              key={idx}
              className="rounded-lg bg-slate-800/80 px-2.5 py-1 text-slate-300 ring-1 ring-slate-700/60 font-serif-editorial italic"
            >
              {s}
            </span>
          ))}
        </div>

        {word.antonyms && word.antonyms.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-slate-400 font-medium">Antónimos:</span>
            {word.antonyms.map((a, idx) => (
              <span
                key={idx}
                className="rounded-lg bg-slate-900 px-2.5 py-1 text-slate-400 ring-1 ring-slate-800 font-serif-editorial italic"
              >
                {a}
              </span>
            ))}
          </div>
        )}

        {word.historicalPrecedent && (
          <div className="w-full flex items-center gap-2 rounded-xl bg-slate-900/60 p-3 ring-1 ring-slate-800/80 text-xs">
            <History className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-slate-400 font-mono text-[11px] uppercase">Precedente histórico:</span>
            <span className="text-slate-300 font-serif-editorial">{word.historicalPrecedent}</span>
          </div>
        )}
      </div>
    </article>
  );
};
