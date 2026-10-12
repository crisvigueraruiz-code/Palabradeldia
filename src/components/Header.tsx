import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Volume2,
  Calendar,
  Bookmark,
  Award,
  Play,
  Pause,
  Compass,
  Palette,
  RotateCcw,
  BookOpen,
  Globe2,
} from 'lucide-react';
import { DailyEdition } from '../types.ts';
import { speechManager } from '../utils/audioSpeech.ts';

export type MainSection = 'studio' | 'word' | 'news' | 'radar';

interface HeaderProps {
  edition: DailyEdition;
  activeSection: MainSection;
  setActiveSection: (section: MainSection) => void;
  onRefreshLive: () => void;
  isLoadingLive: boolean;
  onOpenTopicModal: () => void;
  onOpenQuizModal: () => void;
  onOpenSavedDrawer: () => void;
  onOpenHistoryDrawer: () => void;
  savedWordsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  edition,
  activeSection,
  setActiveSection,
  onRefreshLive,
  isLoadingLive,
  onOpenTopicModal,
  onOpenQuizModal,
  onOpenSavedDrawer,
  onOpenHistoryDrawer,
  savedWordsCount,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  useEffect(() => {
    const unsubscribe = speechManager.subscribe((speaking) => {
      setIsPlayingAudio(speaking);
    });
    return () => unsubscribe();
  }, []);

  const handleToggleDailyBriefingAudio = () => {
    if (isPlayingAudio) {
      speechManager.stop();
      setIsPlayingAudio(false);
      return;
    }

    const narration = `Edición de hoy en La Viñeta del Día, ${edition.formattedDate}. Palabra del día: ${edition.wordOfTheDay.word}. Definición: ${edition.wordOfTheDay.definition}. Idea para la viñeta de hoy: ${edition.wordOfTheDay.cartoonBrief?.visualIdea || ''}. Por qué hoy: ${edition.wordOfTheDay.whyToday}.`;

    speechManager.speak(narration, playbackSpeed, () => {
      setIsPlayingAudio(false);
    });
  };

  const cycleSpeed = () => {
    const nextSpeed = playbackSpeed === 1.0 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1.0;
    setPlaybackSpeed(nextSpeed);
    if (isPlayingAudio) {
      handleToggleDailyBriefingAudio();
    }
  };

  return (
    <header className="border-b border-slate-800 bg-[#080b10] sticky top-0 z-40 backdrop-blur-md bg-opacity-90">
      {/* Top Utility Bar */}
      <div className="border-b border-slate-800/70 py-1.5 px-4 sm:px-8 text-[11px] text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-mono text-amber-400 font-semibold uppercase tracking-wider">
              LA VIÑETA DEL DÍA • ESPAÑA
            </span>
            <span className="text-slate-700">|</span>
            <span className="font-mono text-slate-400">Edición No. {edition.editionNumber}</span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-300 font-serif-editorial">{edition.formattedDate}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded bg-pink-500/10 px-2 py-0.5 font-mono text-[10px] text-pink-300 ring-1 ring-pink-500/20">
              Instagram Reels & Post
            </span>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-300 ring-1 ring-cyan-500/20">
              TikTok España
            </span>
            {edition.generatedByAi && (
              <span className="rounded bg-amber-500/10 px-1.5 py-0.5 font-mono text-[10px] text-amber-300 ring-1 ring-amber-500/20">
                Sintetizado con IA
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Masthead */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Logo & Headline */}
          <div>
            <div className="flex items-baseline gap-2.5">
              <h1 className="font-serif-editorial text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>La Viñeta del Día</span>
              </h1>
              <span className="font-serif-editorial text-xs sm:text-sm italic text-amber-400 tracking-wide">
                • Tinta, Palabra & Redes
              </span>
            </div>
            <p className="mt-0.5 font-serif-editorial text-xs text-slate-300 max-w-xl line-clamp-1">
              Palabra de hoy: <strong className="text-amber-300 font-bold">{edition.wordOfTheDay.word}</strong> — Sube tu ilustración y la caption para Instagram y TikTok se redacta sola.
            </p>
          </div>

          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Audio Briefing button */}
            <div className="flex items-center rounded-xl border border-slate-700/80 bg-slate-900/90 p-1 shadow-sm">
              <button
                onClick={handleToggleDailyBriefingAudio}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  isPlayingAudio
                    ? 'bg-amber-500 text-slate-950 font-bold animate-pulse'
                    : 'text-amber-300 hover:bg-slate-800'
                }`}
              >
                {isPlayingAudio ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                <span>{isPlayingAudio ? 'Pausar audio' : 'Escuchar idea'}</span>
              </button>

              <button
                onClick={cycleSpeed}
                title="Velocidad de reproducción"
                className="rounded px-2 py-1 font-mono text-[11px] text-slate-400 hover:text-white"
              >
                {playbackSpeed}x
              </button>
            </div>

            {/* AI Live synthesis button */}
            <button
              onClick={onRefreshLive}
              disabled={isLoadingLive}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500/20 to-amber-600/20 px-3 py-2 text-xs font-semibold text-amber-200 hover:border-amber-400 transition-all disabled:opacity-50"
            >
              <RotateCcw className={`h-3.5 w-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isLoadingLive ? 'Sintetizando...' : 'Cambiar día'}</span>
            </button>

            {/* Custom Topic Compiler */}
            <button
              onClick={onOpenTopicModal}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Compass className="h-3.5 w-3.5 text-sky-400" />
              <span className="hidden md:inline">Pedir Tema</span>
            </button>

            {/* Quiz / Flashcard mode */}
            <button
              onClick={onOpenQuizModal}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Award className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden sm:inline">Reto</span>
            </button>

            {/* Saved notebook */}
            <button
              onClick={onOpenSavedDrawer}
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Bookmark className="h-3.5 w-3.5 text-emerald-400" />
              <span>({savedWordsCount})</span>
            </button>

            {/* Editions history */}
            <button
              onClick={onOpenHistoryDrawer}
              title="Ver ediciones anteriores"
              className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
            >
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3">
          <button
            onClick={() => setActiveSection('studio')}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              activeSection === 'studio'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Palette className="h-4 w-4" />
            <span>🎨 Estudio de la Viñeta & Captions</span>
            <span className="rounded-full bg-slate-950/20 px-1.5 py-0.2 text-[10px] uppercase font-mono">
              Principal
            </span>
          </button>

          <button
            onClick={() => setActiveSection('word')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
              activeSection === 'word'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50'
                : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>Palabra del Día («{edition.wordOfTheDay.word}»)</span>
          </button>

          <button
            onClick={() => setActiveSection('news')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
              activeSection === 'news'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50'
                : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Globe2 className="h-3.5 w-3.5" />
            <span>Compilación de Noticias ({edition.newsItems.length})</span>
          </button>

          <button
            onClick={() => setActiveSection('radar')}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-medium transition-all ${
              activeSection === 'radar'
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/50'
                : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <span>🗺️ Radar Mundial</span>
          </button>
        </div>
      </div>
    </header>
  );
};
