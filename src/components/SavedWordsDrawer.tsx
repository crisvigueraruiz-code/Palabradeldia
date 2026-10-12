import React, { useState } from 'react';
import { WordOfTheDay, SavedWordItem } from '../types.ts';
import { X, Bookmark, Trash2, Volume2, Download, Search, BookOpen } from 'lucide-react';
import { speechManager } from '../utils/audioSpeech.ts';

interface SavedWordsDrawerProps {
  savedWords: SavedWordItem[];
  isOpen: boolean;
  onClose: () => void;
  onRemoveWord: (id: string) => void;
  onSelectWordToView: (wordName: string) => void;
}

export const SavedWordsDrawer: React.FC<SavedWordsDrawerProps> = ({
  savedWords,
  isOpen,
  onClose,
  onRemoveWord,
  onSelectWordToView,
}) => {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = savedWords.filter((w) =>
    w.word.toLowerCase().includes(search.toLowerCase()) ||
    w.definition.toLowerCase().includes(search.toLowerCase())
  );

  const handleExportMarkdown = () => {
    let content = `# Cuaderno Léxico Personal - Orbis\nExportado el ${new Date().toLocaleDateString('es-ES')}\n\n`;
    savedWords.forEach((w) => {
      content += `### ${w.word} (${w.category})\n`;
      content += `- **Guardado:** ${w.dateAdded}\n`;
      content += `- **Definición:** ${w.definition}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cuaderno-lexico-${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md h-full bg-[#0c1017] border-l border-slate-800 p-6 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
              <Bookmark className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif-editorial text-xl font-bold text-white">
                Cuaderno Léxico
              </h3>
              <p className="text-xs text-slate-400">
                {savedWords.length} {savedWords.length === 1 ? 'término guardado' : 'términos guardados'}
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

        {/* Search & Export */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar en tus palabras..."
              className="w-full rounded-xl border border-slate-800 bg-slate-900/80 pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          {savedWords.length > 0 && (
            <button
              onClick={handleExportMarkdown}
              title="Exportar a Markdown"
              className="flex items-center gap-1 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-white"
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Word List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {filtered.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs font-serif-editorial">
              {savedWords.length === 0
                ? 'Aún no has guardado palabras. Pulsa "Guardar palabra" en la ficha del día para coleccionarlas.'
                : 'No se encontraron coincidencias.'}
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl border border-slate-800/90 bg-slate-900/50 p-4 transition-all hover:border-slate-700 hover:bg-slate-900"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div>
                    <h4
                      onClick={() => onSelectWordToView(item.word)}
                      className="font-serif-editorial text-lg font-bold text-white hover:text-amber-300 cursor-pointer transition-colors"
                    >
                      {item.word}
                    </h4>
                    <span className="text-[10px] font-mono uppercase text-slate-400">
                      {item.category} • {item.dateAdded}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => speechManager.speak(`${item.word}. ${item.definition}`)}
                      title="Escuchar pronunciación"
                      className="p-1 text-slate-400 hover:text-amber-300"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onRemoveWord(item.id)}
                      title="Eliminar de mi cuaderno"
                      className="p-1 text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <p className="font-serif-editorial text-xs leading-relaxed text-slate-300 line-clamp-3">
                  {item.definition}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
