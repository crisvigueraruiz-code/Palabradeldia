import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, X, Sparkles, Trophy } from 'lucide-react';
import { WordOfTheDay } from '../types.ts';

interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface LexiconQuizModalProps {
  words: WordOfTheDay[];
  isOpen: boolean;
  onClose: () => void;
}

export const LexiconQuizModal: React.FC<LexiconQuizModalProps> = ({ words, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  if (!isOpen) return null;

  // Build questions dynamically from words
  const questions: QuizQuestion[] = [
    {
      id: 'q1',
      prompt: '¿Qué significa el término «POLICRISIS» en el análisis de relaciones internacionales?',
      options: [
        'Una serie de crisis monetarias provocadas exclusivamente por tipos de interés bancarios.',
        'La interacción simultánea de múltiples crisis (climáticas, bélicas, financieras) cuyo impacto combinado supera la suma de sus partes.',
        'La multiplicación de partidos políticos en democracias occidentales.',
        'Un término exclusivo de la lingüística que describe la pérdida de vocabulario técnico.'
      ],
      correctIndex: 1,
      explanation: 'Policrisis fue acuñado por Edgar Morin y popularizado por Adam Tooze para describir cómo las crisis modernas se retroalimentan y cancelan las soluciones unilaterales.'
    },
    {
      id: 'q2',
      prompt: '¿Cuál es la raíz etimológica principal del concepto «DESACOPLE» (Decoupling)?',
      options: [
        'Del prefijo latino «dis-» (separación) y «copulare» (unir, conectar), indicando fractura calculada de interdependencias.',
        'Del griego «déka» (diez) y «polis» (ciudad), referido a tratados entre diez potencias.',
        'Del germánico «koppeln», referido a la doma de caballos de carga.',
        'Del sánscrito antiguo sobre meditación y desapego terrenal.'
      ],
      correctIndex: 0,
      explanation: 'En economía y geopolítica, el desacople describe la fragmentación voluntaria de cadenas de valor estratégicas para reducir la vulnerabilidad mutua.'
    },
    {
      id: 'q3',
      prompt: '¿A qué se refiere la «SOBERANÍA COMPUTACIONAL»?',
      options: [
        'El derecho de los usuarios a no actualizar el sistema operativo.',
        'La capacidad de un Estado de poseer, regular y operar sus propios centros de datos y modelos algorítmicos sin depender de potencias externas.',
        'Un software libre administrado por las Naciones Unidas.',
        'El monopolio estatal sobre los teléfonos inteligentes de la población.'
      ],
      correctIndex: 1,
      explanation: 'Es el nuevo pilar de la seguridad nacional del siglo XXI: quien no posee infraestructura de cómputo y semiconductores soberanos, cede su soberanía de datos.'
    },
    {
      id: 'q4',
      prompt: 'En el contexto de la diplomacia hídrica global, ¿qué fenómeno describe la «Hidrodiplomacia»?',
      options: [
        'El transporte fluvial de embajadores en cumbres de paz.',
        'La negociación de acuerdos y gestión compartida de cuencas y acuíferos transfronterizos para prevenir conflictos.',
        'La privatización de océanos para minería submarina.',
        'El suministro militar de agua potable a tropas en el frente.'
      ],
      correctIndex: 1,
      explanation: 'La hidrodiplomacia es vital en regiones como la Cuenca del Chad, el Nilo o el Éufrates para evitar guerras por el agua.'
    }
  ];

  const currentQ = questions[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    if (idx === currentQ.correctIndex) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl border border-amber-500/30 bg-[#0c1017] shadow-2xl overflow-hidden p-6 sm:p-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition-all"
        >
          <X className="h-5 w-5" />
        </button>

        {!isFinished ? (
          <div>
            {/* Header */}
            <div className="mb-6 flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-serif-editorial text-xl font-bold text-white">
                    Reto Léxico Geopolítico
                  </h3>
                  <p className="text-xs text-slate-400">
                    Pregunta {currentIndex + 1} de {questions.length}
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-900 px-3 py-1.5 font-mono text-xs text-amber-300 ring-1 ring-slate-800">
                Aciertos: {score}
              </div>
            </div>

            {/* Question prompt */}
            <h4 className="font-serif-editorial text-lg sm:text-xl font-bold text-slate-100 leading-snug mb-5">
              {currentQ.prompt}
            </h4>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((opt, idx) => {
                const isChosen = selectedOption === idx;
                const isCorrect = idx === currentQ.correctIndex;
                let btnStyle = 'border-slate-800 bg-slate-900/70 text-slate-300 hover:bg-slate-800/80 hover:text-white';

                if (selectedOption !== null) {
                  if (isCorrect) {
                    btnStyle = 'border-emerald-500/60 bg-emerald-950/40 text-emerald-200 ring-1 ring-emerald-500/50';
                  } else if (isChosen) {
                    btnStyle = 'border-red-500/60 bg-red-950/40 text-red-200 ring-1 ring-red-500/50';
                  } else {
                    btnStyle = 'border-slate-800/40 bg-slate-900/30 text-slate-500 opacity-60';
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={selectedOption !== null}
                    onClick={() => handleSelect(idx)}
                    className={`w-full rounded-2xl border p-4 text-left text-xs sm:text-sm font-serif-editorial transition-all flex items-start gap-3 ${btnStyle}`}
                  >
                    <span className="font-mono text-xs font-bold shrink-0 opacity-60 mt-0.5">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    )}
                    {selectedOption !== null && isChosen && !isCorrect && (
                      <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box */}
            {selectedOption !== null && (
              <div className="mb-6 rounded-2xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs font-serif-editorial text-amber-200 leading-relaxed animate-fadeIn">
                <span className="font-mono font-bold text-[11px] uppercase tracking-wider block text-amber-400 mb-1">
                  Explicación Conceptual:
                </span>
                {currentQ.explanation}
              </div>
            )}

            {/* Next button */}
            {selectedOption !== null && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all"
                >
                  {currentIndex + 1 === questions.length ? 'Ver Resultados' : 'Siguiente Desafío'}
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Finished State */
          <div className="text-center py-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/20 text-amber-400 ring-2 ring-amber-500/40">
              <Trophy className="h-8 w-8" />
            </div>
            <h3 className="font-serif-editorial text-3xl font-extrabold text-white">
              ¡Reto Léxico Completado!
            </h3>
            <p className="mt-2 text-sm text-slate-300 font-serif-editorial">
              Has obtenido <span className="font-mono font-bold text-amber-400">{score}</span> de{' '}
              <span className="font-mono font-bold text-slate-200">{questions.length}</span> aciertos.
            </p>

            <p className="mt-4 text-xs text-slate-400 max-w-sm mx-auto font-serif-editorial italic">
              {score === questions.length
                ? 'Dominio absoluto de la terminología de relaciones internacionales y prospectiva global.'
                : score >= 2
                ? 'Buen criterio léxico. La práctica regular afianza la comprensión de las corrientes mundiales.'
                : 'Un gran comienzo para familiarizarse con los conceptos que definen el siglo XXI.'}
            </p>

            <div className="mt-8 flex items-center justify-center gap-3">
              <button
                onClick={handleRestart}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-all"
              >
                <RotateCcw className="h-4 w-4" />
                <span>Reintentar</span>
              </button>
              <button
                onClick={onClose}
                className="rounded-xl bg-amber-500 px-6 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
