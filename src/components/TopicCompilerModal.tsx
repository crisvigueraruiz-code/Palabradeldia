import React, { useState } from 'react';
import { Sparkles, X, Compass, Globe, ArrowRight, Loader2 } from 'lucide-react';
import { DailyEdition } from '../types.ts';

interface TopicCompilerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditionGenerated: (edition: DailyEdition) => void;
}

const POPULAR_TOPICS = [
  'Guerra de semiconductores y litografía avanzada',
  'Transición de tierras raras y minerales críticos',
  'Corredores comerciales del Estrecho de Malaca y Mar Rojo',
  'Crisis de deuda soberana en economías del Sur Global',
  'Gobernanza de la Inteligencia Artificial y agentes autónomos',
  'Estrés hídrico y seguridad alimentaria en el Mediterráneo',
  'Nueva carrera espacial y minería lunar internacional',
];

export const TopicCompilerModal: React.FC<TopicCompilerModalProps> = ({
  isOpen,
  onClose,
  onEditionGenerated,
}) => {
  const [topic, setTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCompile = async (targetTopic: string) => {
    const t = targetTopic.trim();
    if (!t || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/edition/topic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: t }),
      });
      const data = await res.json();
      if (data.edition) {
        onEditionGenerated(data.edition);
        onClose();
      } else {
        setError(data.error || 'No se pudo compilar la edición temática');
      }
    } catch (err: any) {
      setError(err?.message || 'Error de comunicación con el motor de IA');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl border border-sky-500/30 bg-[#0c1018] shadow-2xl overflow-hidden p-6 sm:p-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30">
            <Compass className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-serif-editorial text-2xl font-bold text-white">
              Compilar Edición Temática
            </h3>
            <p className="text-xs text-slate-400 font-serif-editorial">
              Genera al instante un informe global especializado con su palabra clave y crónica de análisis.
            </p>
          </div>
        </div>

        {/* Input */}
        <div className="mb-5">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Tema, Región o Dinámica a Sintetizar
          </label>
          <div className="relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCompile(topic);
              }}
              placeholder="Ej. Mercado global del uranio, Ciberespionaje militar, etc."
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        {/* Popular topic suggestions */}
        <div className="mb-6">
          <span className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-2">
            Sugerencias de actualidad estratégica:
          </span>
          <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto">
            {POPULAR_TOPICS.map((pt, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => {
                  setTopic(pt);
                  handleCompile(pt);
                }}
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:border-sky-500/40 hover:text-sky-200 transition-all text-left"
              >
                {pt}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-xs font-medium text-slate-400 hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={() => handleCompile(topic)}
            disabled={!topic.trim() || isLoading}
            className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-400 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Sintetizando informe con Gemini...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Compilar Edición</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
