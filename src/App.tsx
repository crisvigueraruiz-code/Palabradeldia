import React, { useState, useEffect } from 'react';
import { DailyEdition, SavedWordItem, WordOfTheDay } from './types.ts';
import { INITIAL_EDITIONS } from './data/mockEditions.ts';
import { Header, MainSection } from './components/Header.tsx';
import { CartoonStudio } from './components/CartoonStudio.tsx';
import { WordOfTheDayCard } from './components/WordOfTheDayCard.tsx';
import { WorldRadarMap } from './components/WorldRadarMap.tsx';
import { NewsFeed } from './components/NewsFeed.tsx';
import { DeepDiveModal } from './components/DeepDiveModal.tsx';
import { TopicCompilerModal } from './components/TopicCompilerModal.tsx';
import { LexiconQuizModal } from './components/LexiconQuizModal.tsx';
import { SavedWordsDrawer } from './components/SavedWordsDrawer.tsx';
import { HistoryDrawer } from './components/HistoryDrawer.tsx';
import { ShareEditionModal } from './components/ShareEditionModal.tsx';
import { Sparkles, ArrowUp, Share2, Palette, BookOpen, Globe2, Layers } from 'lucide-react';

const SAVED_WORDS_STORAGE_KEY = 'orbis_saved_words_v1';

export default function App() {
  const [currentEdition, setCurrentEdition] = useState<DailyEdition>(INITIAL_EDITIONS[0]);
  const [allEditions, setAllEditions] = useState<DailyEdition[]>(INITIAL_EDITIONS);
  const [savedWords, setSavedWords] = useState<SavedWordItem[]>([]);
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<MainSection>('studio');

  // Loading states
  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Modals & Drawers state
  const [isDeepDiveOpen, setIsDeepDiveOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Load saved words from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_WORDS_STORAGE_KEY);
      if (stored) {
        setSavedWords(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  // Save to localStorage
  const saveSavedWords = (updated: SavedWordItem[]) => {
    setSavedWords(updated);
    try {
      localStorage.setItem(SAVED_WORDS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  // Fetch today's edition and history on load from backend
  useEffect(() => {
    const fetchToday = async () => {
      try {
        const res = await fetch('/api/edition/today');
        if (res.ok) {
          const data = await res.json();
          if (data.edition) {
            setCurrentEdition(data.edition);
          }
        }
      } catch {
        // Fallback to pre-baked initial edition
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/edition/history');
        if (res.ok) {
          const data = await res.json();
          if (data.editions && data.editions.length > 0) {
            setAllEditions(data.editions);
          }
        }
      } catch {
        // Fallback
      }
    };

    fetchToday();
    fetchHistory();
  }, []);

  // Toggle Save current word of the day
  const handleToggleSaveCurrentWord = () => {
    const cur = currentEdition.wordOfTheDay;
    const exists = savedWords.some((w) => w.word.toLowerCase() === cur.word.toLowerCase());

    if (exists) {
      const updated = savedWords.filter((w) => w.word.toLowerCase() !== cur.word.toLowerCase());
      saveSavedWords(updated);
      showNotification(`Palabra «${cur.word}» retirada del cuaderno léxico`);
    } else {
      const newItem: SavedWordItem = {
        id: `saved-${Date.now()}`,
        word: cur.word,
        dateAdded: currentEdition.formattedDate,
        definition: cur.definition,
        category: cur.category,
      };
      const updated = [newItem, ...savedWords];
      saveSavedWords(updated);
      showNotification(`Palabra «${cur.word}» agregada a tu cuaderno léxico`);
    }
  };

  const handleRemoveSavedWord = (id: string) => {
    const updated = savedWords.filter((w) => w.id !== id);
    saveSavedWords(updated);
  };

  const showNotification = (msg: string) => {
    setStatusNotification(msg);
    setTimeout(() => {
      setStatusNotification(null);
    }, 3500);
  };

  // Refresh with Live AI synthesis
  const handleRefreshLive = async () => {
    setIsLoadingLive(true);
    showNotification('Conectando con Gemini 3.8 Flash para compilar el pulso mundial en directo...');

    try {
      const res = await fetch('/api/edition/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: '2026-10-08' }),
      });
      const data = await res.json();
      if (data.edition) {
        setCurrentEdition(data.edition);
        setAllEditions((prev) => {
          const filtered = prev.filter((e) => e.date !== data.edition.date);
          return [data.edition, ...filtered];
        });
        showNotification('Edición sintetizada con éxito: Nueva palabra e idea para la viñeta.');
      }
    } catch {
      showNotification('Se mantuvo la edición curada con datos de alta precisión.');
    } finally {
      setIsLoadingLive(false);
    }
  };

  const handleSelectNewsFromRadar = (id: string) => {
    setSelectedNewsId(id);
    setActiveSection('news');
    setTimeout(() => {
      const element = document.getElementById(`news-${id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const isCurrentWordSaved = savedWords.some(
    (w) => w.word.toLowerCase() === currentEdition.wordOfTheDay.word.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#080b10] text-[#e2e8f0] font-sans-clean editorial-paper-texture">
      {/* Top Header with Navigation */}
      <Header
        edition={currentEdition}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        onRefreshLive={handleRefreshLive}
        isLoadingLive={isLoadingLive}
        onOpenTopicModal={() => setIsTopicModalOpen(true)}
        onOpenQuizModal={() => setIsQuizModalOpen(true)}
        onOpenSavedDrawer={() => setIsSavedDrawerOpen(true)}
        onOpenHistoryDrawer={() => setIsHistoryDrawerOpen(true)}
        savedWordsCount={savedWords.length}
      />

      {/* Epigraph / Daily Banner */}
      <section className="border-b border-slate-800/80 bg-[#0b0f16] py-2.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-mono uppercase tracking-widest text-amber-400 font-semibold">
              Palabra de Hoy:
            </span>
            <span className="font-serif-editorial text-slate-100 text-sm font-bold">
              «{currentEdition.wordOfTheDay.word}»
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 italic line-clamp-1">
              {currentEdition.wordOfTheDay.definition}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Exportar despacho</span>
            </button>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 font-mono text-[11px]">
              Tensión: <strong className="text-amber-300">{currentEdition.worldTensionIndex}/100</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Workspace */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-10">
        {/* VIEW 1: ESTUDIO DE LA VIÑETA (Subida & Generación de Captions para Instagram y TikTok) */}
        {activeSection === 'studio' && (
          <div className="space-y-12">
            <CartoonStudio edition={currentEdition} />

            {/* Quick Context Card below studio so creator doesn't lose sight of the word's full context */}
            <div className="border-t border-slate-800/80 pt-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold block">
                    Fundamento Conceptual
                  </span>
                  <h3 className="font-serif-editorial text-2xl font-bold text-white">
                    Ficha Completa de la Palabra: {currentEdition.wordOfTheDay.word}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveSection('word')}
                  className="text-xs font-mono text-amber-400 hover:underline"
                >
                  Abrir vista dedicada →
                </button>
              </div>

              <WordOfTheDayCard
                word={currentEdition.wordOfTheDay}
                dateStr={currentEdition.formattedDate}
                isSaved={isCurrentWordSaved}
                onToggleSave={handleToggleSaveCurrentWord}
                onOpenDeepDive={() => setIsDeepDiveOpen(true)}
              />
            </div>
          </div>
        )}

        {/* VIEW 2: PALABRA DEL DÍA (Ficha Léxica Completa) */}
        {activeSection === 'word' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold">
                  Léxico Internacional
                </span>
                <h2 className="font-serif-editorial text-3xl font-extrabold text-white">
                  Palabra del Día & Análisis Geopolítico
                </h2>
              </div>
              <button
                onClick={() => setActiveSection('studio')}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-400"
              >
                <Palette className="h-4 w-4" />
                <span>Ir al Estudio de la Viñeta</span>
              </button>
            </div>

            <WordOfTheDayCard
              word={currentEdition.wordOfTheDay}
              dateStr={currentEdition.formattedDate}
              isSaved={isCurrentWordSaved}
              onToggleSave={handleToggleSaveCurrentWord}
              onOpenDeepDive={() => setIsDeepDiveOpen(true)}
            />
          </div>
        )}

        {/* VIEW 3: COMPILACIÓN GLOBAL DE NOTICIAS */}
        {activeSection === 'news' && (
          <div className="space-y-8 animate-fadeIn">
            <NewsFeed
              newsItems={currentEdition.newsItems}
              selectedNewsId={selectedNewsId}
            />
          </div>
        )}

        {/* VIEW 4: RADAR GEOPOLÍTICO MUNDIAL */}
        {activeSection === 'radar' && (
          <div className="space-y-8 animate-fadeIn">
            <WorldRadarMap
              newsItems={currentEdition.newsItems}
              selectedNewsId={selectedNewsId}
              onSelectNews={handleSelectNewsFromRadar}
              worldTensionIndex={currentEdition.worldTensionIndex}
            />

            <NewsFeed
              newsItems={currentEdition.newsItems}
              selectedNewsId={selectedNewsId}
            />
          </div>
        )}
      </main>

      {/* Floating Notification Toast */}
      {statusNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-amber-500/40 bg-slate-900/95 px-5 py-3 shadow-2xl backdrop-blur-md text-xs sm:text-sm text-slate-200 animate-fadeIn">
          <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <DeepDiveModal
        word={currentEdition.wordOfTheDay}
        isOpen={isDeepDiveOpen}
        onClose={() => setIsDeepDiveOpen(false)}
      />

      <TopicCompilerModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onEditionGenerated={(newEdition) => {
          setCurrentEdition(newEdition);
          setAllEditions((prev) => [newEdition, ...prev]);
          setActiveSection('studio');
          showNotification(`Edición temática generada: ${newEdition.wordOfTheDay.word}`);
        }}
      />

      <LexiconQuizModal
        words={allEditions.map((e) => e.wordOfTheDay)}
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
      />

      <SavedWordsDrawer
        savedWords={savedWords}
        isOpen={isSavedDrawerOpen}
        onClose={() => setIsSavedDrawerOpen(false)}
        onRemoveWord={handleRemoveSavedWord}
        onSelectWordToView={(wName) => {
          const match = allEditions.find(
            (e) => e.wordOfTheDay.word.toLowerCase() === wName.toLowerCase()
          );
          if (match) {
            setCurrentEdition(match);
            setIsSavedDrawerOpen(false);
          }
        }}
      />

      <HistoryDrawer
        editions={allEditions}
        currentEditionDate={currentEdition.date}
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        onSelectEdition={(ed) => setCurrentEdition(ed)}
      />

      <ShareEditionModal
        edition={currentEdition}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Editorial Footer */}
      <footer className="mt-20 border-t border-slate-800 bg-[#06080d] py-12 px-4 sm:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="font-serif-editorial text-lg font-bold tracking-tight text-white">
                La Viñeta del Día
              </span>
              <span className="text-slate-600">•</span>
              <span className="font-serif-editorial text-amber-400">
                Tinta, Palabra & Redes (España)
              </span>
            </div>
            <p className="font-serif-editorial text-slate-400 max-w-lg text-xs leading-relaxed">
              Herramienta diaria para ilustradores y creadores de contenido: compila la actualidad mundial, propone la palabra del día y genera automáticamente las captions y guiones para Instagram y TikTok adaptados al público español.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-mono text-[11px] text-slate-400">
            <button
              onClick={() => setActiveSection('studio')}
              className="hover:text-amber-300 transition-colors"
            >
              Estudio de Viñeta
            </button>
            <button
              onClick={() => setIsQuizModalOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              Reto Léxico
            </button>
            <button
              onClick={() => setIsHistoryDrawerOpen(true)}
              className="hover:text-amber-300 transition-colors"
            >
              Hemeroteca
            </button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-1 text-amber-400 hover:text-amber-300"
            >
              <ArrowUp className="h-3.5 w-3.5" /> Arriba
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
