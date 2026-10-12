import React, { useState } from 'react';
import { WordOfTheDay } from '../types.ts';
import { Sparkles, X, Send, BookOpen, HelpCircle, MessageSquare } from 'lucide-react';

interface DeepDiveModalProps {
  word: WordOfTheDay;
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_QUESTIONS = [
  '¿Cómo se utiliza este término en el lenguaje diplomático de la ONU y cancillerías?',
  '¿Cuáles son los malentendidos o errores más comunes al emplear esta palabra?',
  '¿Qué pensadores o escuelas teóricas contemporáneas han acuñado y profundizado este concepto?',
  '¿Cómo se traduce o qué equivalentes exactos existen en inglés, francés o mandarín?',
];

export const DeepDiveModal: React.FC<DeepDiveModalProps> = ({ word, isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ q: string; a: string }>>([
    {
      q: 'Perspectiva conceptual de apertura',
      a: word.academicInsight
        ? `${word.academicInsight}\n\nPrecedente histórico: ${word.historicalPrecedent || 'N/A'}`
        : `El término "${word.word}" opera como un analizador clave de la realidad geopolítica y social moderna. Su etimología (${word.etymology}) subraya la necesidad de superar explicaciones reduccionistas.`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleAsk = async (textToAsk: string) => {
    const q = textToAsk.trim();
    if (!q || isLoading) return;

    setIsLoading(true);
    setQuestion('');

    try {
      const res = await fetch('/api/word/deepdive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: word.word, question: q }),
      });
      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { q, a: data.answer || 'No se pudo obtener la respuesta en este momento.' },
      ]);
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        { q, a: 'Error de conexión con el motor de análisis editorial.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-amber-500/30 bg-[#0d1118] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-5 bg-[#090d14]">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase text-amber-400 font-semibold">Cátedra Editorial</span>
                <span className="text-slate-600">•</span>
                <span className="font-serif-editorial font-bold text-white text-base">{word.word}</span>
              </div>
              <p className="text-xs text-slate-400">
                Profundización lingüística y geopolítica asistida por IA
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Conversation Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {chatHistory.map((item, idx) => (
            <div key={idx} className="space-y-2">
              {idx > 0 && (
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl bg-slate-800 px-4 py-2.5 text-xs sm:text-sm text-slate-200 font-serif-editorial">
                    {item.q}
                  </div>
                </div>
              )}
              <div className="flex justify-start">
                <div className="max-w-[95%] rounded-2xl border border-slate-800 bg-slate-900/90 p-4 text-xs sm:text-sm text-slate-200 font-serif-editorial leading-relaxed whitespace-pre-line">
                  {item.a}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 p-2">
              <Sparkles className="h-4 w-4 animate-spin" />
              <span>Analizando matices léxicos con Gemini...</span>
            </div>
          )}
        </div>

        {/* Suggested Quick Questions */}
        <div className="border-t border-slate-800/80 bg-[#090d14] p-3">
          <div className="mb-2 text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <HelpCircle className="h-3 w-3 text-amber-400" /> Preguntas frecuentes para explorar:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_QUESTIONS.map((pq, idx) => (
              <button
                key={idx}
                disabled={isLoading}
                onClick={() => handleAsk(pq)}
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] text-slate-300 hover:border-amber-500/40 hover:text-amber-200 transition-all text-left line-clamp-1 max-w-full"
              >
                {pq}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-800 p-4 bg-[#0a0e16] flex items-center gap-2">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAsk(question);
            }}
            placeholder={`Pregunta cualquier matiz sobre «${word.word}»...`}
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
          <button
            onClick={() => handleAsk(question)}
            disabled={!question.trim() || isLoading}
            className="flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2.5 text-slate-950 font-bold hover:bg-amber-400 transition-all disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
