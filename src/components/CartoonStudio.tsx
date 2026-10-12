import React, { useState, useRef, useEffect } from 'react';
import { WordOfTheDay, GeneratedCaptions, PublishedCartoon, DailyEdition } from '../types.ts';
import {
  Upload,
  Sparkles,
  Camera,
  Copy,
  Check,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  Send,
  Download,
  Flame,
  Bookmark,
  Share2,
  Eye,
  Info,
  Radio,
  Trash2,
} from 'lucide-react';

interface CartoonStudioProps {
  edition: DailyEdition;
  onSavePublishedCartoon?: (cartoon: PublishedCartoon) => void;
}

type SocialTab = 'instagram' | 'tiktok' | 'stories';
type ToneType = 'satirico' | 'editorial' | 'viral';

export const CartoonStudio: React.FC<CartoonStudioProps> = ({ edition }) => {
  const word = edition.wordOfTheDay;
  const brief = word.cartoonBrief;

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('image/jpeg');
  const [authorSignature, setAuthorSignature] = useState('Por Cris');
  const [selectedTone, setSelectedTone] = useState<ToneType>('satirico');
  const [userNote, setUserNote] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [captions, setCaptions] = useState<GeneratedCaptions | null>(null);
  const [activeTab, setActiveTab] = useState<SocialTab>('instagram');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<'4:5' | '1:1' | '9:16'>('4:5');

  // Local storage for user cartoons
  const [savedCartoons, setSavedCartoons] = useState<PublishedCartoon[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load saved cartoons from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('vinetas_guardadas_espana_v1');
      if (stored) {
        setSavedCartoons(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageMimeType(file.type || 'image/jpeg');
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImagePreview(dataUrl);
      // Auto-trigger caption generation when a new image is loaded!
      triggerCaptionGeneration(dataUrl, file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  // Generate clean sample cartoon on canvas for instant testing
  const handleLoadSampleCartoon = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // 4:5 Instagram vertical format
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background paper
    ctx.fillStyle = '#fbf7ee';
    ctx.fillRect(0, 0, 1080, 1350);

    // Subtle paper grain border
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, 1008, 1278);

    // Inner cartoon frame
    ctx.lineWidth = 4;
    ctx.strokeRect(54, 54, 972, 1242);

    // Header Word & Date
    ctx.fillStyle = '#18181b';
    ctx.font = 'bold 36px Newsreader, serif';
    ctx.fillText(`PALABRA DEL DÍA: ${word.word}`, 80, 120);

    ctx.font = 'normal 24px Newsreader, serif';
    ctx.fillStyle = '#52525b';
    ctx.fillText(`${edition.formattedDate} • LA VIÑETA DIARIA`, 80, 160);

    // Dividing rule
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(80, 190);
    ctx.lineTo(1000, 190);
    ctx.stroke();

    // Drawing of characters (Bar stool, coffee, bewildered citizen looking at world map on TV)
    // TV on the wall
    ctx.strokeStyle = '#18181b';
    ctx.lineWidth = 8;
    ctx.strokeRect(620, 260, 320, 220);
    // Antenna
    ctx.beginPath();
    ctx.moveTo(740, 260);
    ctx.lineTo(700, 210);
    ctx.moveTo(820, 260);
    ctx.lineTo(860, 210);
    ctx.stroke();

    // TV content: globe on fire & price tag
    ctx.beginPath();
    ctx.arc(740, 370, 50, 0, Math.PI * 2);
    ctx.stroke();
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#dc2626';
    ctx.fillText('NOTICIAS: POLICRISIS', 650, 310);
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#18181b';
    ctx.fillText('Aceite: 14€', 810, 390);

    // Bar counter
    ctx.beginPath();
    ctx.moveTo(120, 850);
    ctx.lineTo(950, 850);
    ctx.lineWidth = 12;
    ctx.stroke();

    // Coffee cup on counter
    ctx.lineWidth = 6;
    ctx.strokeRect(260, 780, 70, 70);
    ctx.beginPath();
    ctx.arc(330, 815, 20, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();
    // Smoke
    ctx.beginPath();
    ctx.moveTo(280, 770);
    ctx.bezierCurveTo(270, 740, 310, 720, 290, 690);
    ctx.stroke();

    // Citizen character (El Roto / Forges style outline)
    // Head
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.arc(440, 620, 65, 0, Math.PI * 2);
    ctx.stroke();
    // Big nose and glasses
    ctx.beginPath();
    ctx.arc(415, 620, 24, 0, Math.PI * 2);
    ctx.arc(465, 620, 24, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(440, 630, 18, 0, Math.PI);
    ctx.stroke();
    // Torso sitting on stool
    ctx.beginPath();
    ctx.moveTo(440, 685);
    ctx.lineTo(440, 850);
    ctx.lineTo(390, 850);
    ctx.stroke();

    // Speech bubble with satirical punchline
    ctx.lineWidth = 5;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(140, 930, 800, 160, 20);
    ctx.fill();
    ctx.stroke();

    // Bubble pointer
    ctx.beginPath();
    ctx.moveTo(400, 930);
    ctx.lineTo(440, 870);
    ctx.lineTo(450, 930);
    ctx.fill();
    ctx.stroke();

    // Punchline text in bubble
    ctx.fillStyle = '#09090b';
    ctx.font = 'italic bold 28px Newsreader, serif';
    ctx.fillText('«—Póngame otra caña, Paco...', 180, 990);
    ctx.fillText('a ver si amortigua el impacto geopolítico.»', 180, 1040);

    // Signature
    ctx.font = 'bold 24px Newsreader, serif';
    ctx.fillStyle = '#18181b';
    ctx.fillText(`— ${authorSignature || 'Cris'}`, 840, 1220);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
    setImagePreview(dataUrl);
    setImageMimeType('image/jpeg');
    triggerCaptionGeneration(dataUrl, 'image/jpeg');
  };

  const triggerCaptionGeneration = async (imgData?: string, mime?: string) => {
    setIsGenerating(true);
    setCaptions(null);

    const payload = {
      imageBase64: imgData || imagePreview || null,
      mimeType: mime || imageMimeType,
      word: word.word,
      definition: word.definition,
      whyToday: word.whyToday,
      dominantTheme: edition.dominantTheme,
      tone: selectedTone,
      userNote: userNote.trim(),
    };

    try {
      const res = await fetch('/api/caption/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.captions) {
        setCaptions(data.captions);

        // Auto-save to creator's gallery if image is present
        if (imgData || imagePreview) {
          const newCartoon: PublishedCartoon = {
            id: `vineta-${Date.now()}`,
            date: edition.formattedDate,
            word: word.word,
            imageDataUrl: (imgData || imagePreview)!,
            captions: data.captions,
            authorSignature: authorSignature,
          };
          const updated = [newCartoon, ...savedCartoons.slice(0, 19)];
          setSavedCartoons(updated);
          try {
            localStorage.setItem('vinetas_guardadas_espana_v1', JSON.stringify(updated));
          } catch {
            // ignore
          }
        }
      }
    } catch (err) {
      console.error('Error generating captions:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(sectionId);
      setTimeout(() => setCopiedSection(null), 2500);
    } catch {
      // fallback
    }
  };

  const handleDownloadMountedImage = () => {
    if (!imagePreview) return;
    const a = document.createElement('a');
    a.href = imagePreview;
    a.download = `vineta-${word.word.toLowerCase()}-${Date.now()}.jpg`;
    a.click();
  };

  const removeSavedCartoon = (id: string) => {
    const updated = savedCartoons.filter((c) => c.id !== id);
    setSavedCartoons(updated);
    try {
      localStorage.setItem('vinetas_guardadas_espana_v1', JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  return (
    <section className="space-y-8 animate-fadeIn">
      {/* Studio Header Banner */}
      <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-[#131924] to-[#0d121c] p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-300">
                Estudio del Viñetista • España
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-400 font-mono">Instagram & TikTok Auto-Publisher</span>
            </div>
            <h2 className="font-serif-editorial text-3xl sm:text-4xl font-extrabold text-white">
              Sube tu viñeta y la caption se crea sola
            </h2>
            <p className="mt-1.5 font-serif-editorial text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Ilustra la palabra del día («<strong className="text-amber-300 font-bold">{word.word}</strong>»), sube la foto de tu dibujo y Gemini redacta al instante el post perfecto para Instagram (con hashtags de España) y el guion/copy para TikTok.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleLoadSampleCartoon}
              className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/20 px-4 py-2.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 transition-all shadow-md"
            >
              <Sparkles className="h-4 w-4 text-amber-300" />
              <span>Cargar viñeta de prueba</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Workspace */}
      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left Column: Brief creativo & Subida de la Viñeta (5 cols) */}
        <div className="space-y-6 lg:col-span-5">
          {/* Brief Creativo de Hoy */}
          {brief && (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2.5">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                  <Flame className="h-3.5 w-3.5" />
                  Idea sugerida para dibujar hoy
                </div>
                <span className="text-[11px] font-mono text-slate-400">{word.word}</span>
              </div>

              <div className="space-y-2.5 text-xs font-serif-editorial">
                <div>
                  <span className="font-mono text-[11px] uppercase text-slate-400 block mb-0.5">
                    Metáfora Visual:
                  </span>
                  <p className="text-slate-200 leading-relaxed font-medium">
                    {brief.visualIdea}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 block">
                      Elementos clave:
                    </span>
                    <p className="text-slate-300 text-[11px]">{brief.charactersOrElements}</p>
                  </div>
                  <div>
                    <span className="font-mono text-[10px] uppercase text-slate-400 block">
                      Escenario:
                    </span>
                    <p className="text-slate-300 text-[11px]">{brief.setting}</p>
                  </div>
                </div>

                <div className="rounded-xl border border-amber-500/20 bg-amber-950/20 p-2.5 text-amber-200">
                  <span className="font-mono text-[10px] uppercase text-amber-400 font-bold block mb-0.5">
                    Remate cómico / Frase para el bocadillo:
                  </span>
                  <p className="italic font-bold">{brief.punchlineOrIrony}</p>
                </div>
              </div>
            </div>
          )}

          {/* Subir Viñeta (Foto de tu ilustración) */}
          <div className="rounded-2xl border border-slate-800 bg-[#0d121c] p-5 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif-editorial text-lg font-bold text-white flex items-center gap-2">
                <Camera className="h-4 w-4 text-amber-400" />
                Tu Viñeta (Foto o Digital)
              </h3>
              {imagePreview && (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs text-amber-400 hover:underline font-mono"
                >
                  Cambiar foto
                </button>
              )}
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              className="hidden"
            />

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="group flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-700 bg-slate-900/50 p-8 text-center cursor-pointer transition-all hover:border-amber-500/60 hover:bg-slate-900/80"
              >
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20 group-hover:scale-110 transition-transform">
                  <Upload className="h-7 w-7" />
                </div>
                <p className="font-serif-editorial text-base font-bold text-slate-200">
                  Haz clic para subir la foto de tu viñeta
                </p>
                <p className="mt-1 text-xs text-slate-400 max-w-xs">
                  Sube una foto del cuaderno, una captura de Procreate/Photoshop o un boceto a lápiz.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] font-mono text-amber-300">
                  <span>PNG, JPG, WEBP</span> • <span>La caption se crea automáticamente</span>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview with aspect ratio selector */}
                <div className="relative overflow-hidden rounded-2xl border border-slate-700 bg-black flex items-center justify-center max-h-[460px]">
                  <img
                    src={imagePreview}
                    alt="Viñeta del día"
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-3 right-3 flex items-center gap-2">
                    <button
                      onClick={handleDownloadMountedImage}
                      title="Descargar imagen"
                      className="rounded-xl bg-slate-900/90 p-2 text-slate-200 hover:text-white ring-1 ring-slate-700 shadow-lg backdrop-blur-sm"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-slate-950 shadow-lg hover:bg-amber-400"
                    >
                      Subir otra
                    </button>
                  </div>
                </div>

                {/* Signature input */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-slate-400">Firma del autor:</span>
                  <input
                    type="text"
                    value={authorSignature}
                    onChange={(e) => setAuthorSignature(e.target.value)}
                    placeholder="Ej. Por Cris"
                    className="flex-1 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            )}

            {/* Config: Tono y Notas opcionales */}
            <div className="mt-5 border-t border-slate-800 pt-4 space-y-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1.5">
                  Tono para el público de España:
                </label>
                <div className="grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    onClick={() => {
                      setSelectedTone('satirico');
                      if (imagePreview) triggerCaptionGeneration(imagePreview);
                    }}
                    className={`rounded-xl p-2 text-center transition-all ${
                      selectedTone === 'satirico'
                        ? 'border border-amber-500/50 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    ⚡ Satírico
                    <span className="block text-[10px] font-normal opacity-70">El Roto / Forges</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTone('editorial');
                      if (imagePreview) triggerCaptionGeneration(imagePreview);
                    }}
                    className={`rounded-xl p-2 text-center transition-all ${
                      selectedTone === 'editorial'
                        ? 'border border-amber-500/50 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📰 Editorial
                    <span className="block text-[10px] font-normal opacity-70">Columna de opinión</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedTone('viral');
                      if (imagePreview) triggerCaptionGeneration(imagePreview);
                    }}
                    className={`rounded-xl p-2 text-center transition-all ${
                      selectedTone === 'viral'
                        ? 'border border-amber-500/50 bg-amber-500/20 text-amber-300 font-bold'
                        : 'border border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    📱 Viral TikTok
                    <span className="block text-[10px] font-normal opacity-70">Cercano & Rápido</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Apuntes opcionales sobre tu dibujo:
                </label>
                <input
                  type="text"
                  value={userNote}
                  onChange={(e) => setUserNote(e.target.value)}
                  placeholder="Ej. El camarero representa a los autónomos..."
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={() => triggerCaptionGeneration()}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-2.5 text-xs font-bold text-slate-950 hover:bg-amber-400 transition-all shadow-lg disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating ? 'Gemini analizando la viñeta y redactando...' : 'Regenerar Captions con IA'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Captions Generadas listas para Copiar (7 cols) */}
        <div className="space-y-6 lg:col-span-7">
          <div className="rounded-3xl border border-slate-800 bg-[#0d121c] p-6 shadow-2xl flex flex-col h-full">
            {/* Social Platform Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('instagram')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'instagram'
                      ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>📸 Instagram (Post/Carrusel)</span>
                </button>

                <button
                  onClick={() => setActiveTab('tiktok')}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === 'tiktok'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>🎵 TikTok & Reels</span>
                </button>

                <button
                  onClick={() => setActiveTab('stories')}
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all ${
                    activeTab === 'stories'
                      ? 'bg-slate-700 text-white'
                      : 'bg-slate-900 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>Stories</span>
                </button>
              </div>

              {captions && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                  <Check className="h-3 w-3" /> Listo para publicar
                </span>
              )}
            </div>

            {/* Loading animation state */}
            {isGenerating && (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                <div className="relative mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-amber-500/10 text-amber-400 ring-2 ring-amber-500/30">
                  <Sparkles className="h-8 w-8 animate-spin" />
                </div>
                <h4 className="font-serif-editorial text-xl font-bold text-white">
                  Analizando la ilustración y redactando las captions...
                </h4>
                <p className="mt-1 text-xs text-slate-400 max-w-sm font-serif-editorial">
                  Gemini está reconociendo los trazos, el humor de tu viñeta y cruzándolo con la palabra «{word.word}» para el público de España.
                </p>
              </div>
            )}

            {/* Captions Display */}
            {!isGenerating && captions && (
              <div className="flex-1 space-y-5 animate-fadeIn">
                {/* Visual Analysis interpretation tag */}
                {captions.visualAnalysis && (
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs flex items-start gap-2.5">
                    <Info className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
                        Lectura de tu viñeta:
                      </span>
                      <p className="text-slate-300 font-serif-editorial italic">
                        {captions.visualAnalysis}
                      </p>
                    </div>
                  </div>
                )}

                {/* INSTAGRAM TAB CONTENT */}
                {activeTab === 'instagram' && (
                  <div className="space-y-4">
                    {/* Hook line */}
                    <div className="rounded-xl border border-pink-500/30 bg-pink-950/20 p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-pink-300 font-bold">
                          Gancho de 1ª línea (Hook):
                        </span>
                        <button
                          onClick={() => copyToClipboard(captions.instagram.hook, 'hook')}
                          className="text-xs text-pink-300 hover:text-white"
                        >
                          {copiedSection === 'hook' ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <p className="font-serif-editorial text-sm font-bold text-white">
                        {captions.instagram.hook}
                      </p>
                    </div>

                    {/* Full Instagram caption box */}
                    <div className="relative rounded-2xl border border-slate-700 bg-slate-950 p-4 font-serif-editorial text-xs sm:text-sm text-slate-200 leading-relaxed max-h-[320px] overflow-y-auto whitespace-pre-line select-all">
                      {captions.instagram.fullText}
                    </div>

                    {/* Copy Full Button */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <div className="flex flex-wrap gap-1 max-w-sm">
                        {captions.instagram.hashtags.slice(0, 5).map((h, i) => (
                          <span
                            key={i}
                            className="rounded bg-slate-900 px-1.5 py-0.5 text-[10px] font-mono text-slate-400"
                          >
                            {h}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => copyToClipboard(captions.instagram.fullText, 'full-ig')}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:opacity-90 transition-all"
                      >
                        {copiedSection === 'full-ig' ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>¡Copiado para Instagram!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copiar Caption Completa</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* TIKTOK & REELS TAB CONTENT */}
                {activeTab === 'tiktok' && (
                  <div className="space-y-4">
                    {/* On-Screen Hook */}
                    <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-cyan-300 font-bold">
                          Texto para poner en pantalla (0-2 segundos):
                        </span>
                        <button
                          onClick={() => copyToClipboard(captions.tiktok.hookOnScreen, 'tt-hook')}
                          className="text-xs text-cyan-300 hover:text-white"
                        >
                          {copiedSection === 'tt-hook' ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <p className="font-serif-editorial text-sm font-bold text-white">
                        {captions.tiktok.hookOnScreen}
                      </p>
                    </div>

                    {/* Voiceover script */}
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/90 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-[11px] uppercase tracking-wider text-amber-400 font-bold">
                          Guion de Voz en Off (20-30 seg para locutar):
                        </span>
                        <button
                          onClick={() => copyToClipboard(captions.tiktok.voiceoverScript, 'tt-voice')}
                          className="text-xs text-amber-400 hover:text-white"
                        >
                          {copiedSection === 'tt-voice' ? '¡Copiado!' : 'Copiar Guion'}
                        </button>
                      </div>
                      <p className="font-serif-editorial text-xs sm:text-sm text-slate-200 leading-relaxed italic">
                        "{captions.tiktok.voiceoverScript}"
                      </p>
                    </div>

                    {/* Description for TikTok */}
                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-3.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] uppercase text-slate-400 font-bold">
                          Descripción para pegar en el vídeo de TikTok:
                        </span>
                        <button
                          onClick={() => copyToClipboard(captions.tiktok.videoDescription, 'tt-desc')}
                          className="text-xs text-slate-300 hover:text-white"
                        >
                          {copiedSection === 'tt-desc' ? '¡Copiado!' : 'Copiar'}
                        </button>
                      </div>
                      <p className="font-serif-editorial text-xs text-slate-300">
                        {captions.tiktok.videoDescription}
                      </p>
                    </div>

                    {/* Copy all TikTok package */}
                    <div className="flex items-center justify-between gap-3 pt-2">
                      <span className="text-[11px] font-mono text-slate-400">
                        Música: {captions.tiktok.suggestedAudioStyle}
                      </span>
                      <button
                        onClick={() => copyToClipboard(captions.tiktok.fullText, 'tt-all')}
                        className="flex items-center gap-2 rounded-xl bg-cyan-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:bg-cyan-400 transition-all"
                      >
                        {copiedSection === 'tt-all' ? (
                          <>
                            <Check className="h-4 w-4" />
                            <span>¡Paquete TikTok Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            <span>Copiar Todo el Paquete TikTok</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* STORIES TAB CONTENT */}
                {activeTab === 'stories' && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
                      <span className="font-mono text-[11px] uppercase text-amber-400 font-bold block mb-1">
                        Texto para Story de Instagram:
                      </span>
                      <p className="font-serif-editorial text-sm text-slate-100">
                        {captions.stories.text}
                      </p>
                      <button
                        onClick={() => copyToClipboard(captions.stories.text, 'st-text')}
                        className="mt-2 text-xs text-amber-300 hover:underline"
                      >
                        {copiedSection === 'st-text' ? '¡Copiado!' : 'Copiar texto'}
                      </button>
                    </div>

                    <div className="rounded-2xl border border-purple-500/30 bg-purple-950/20 p-4">
                      <span className="font-mono text-[11px] uppercase text-purple-300 font-bold block mb-2">
                        Sticker de encuesta para engagement:
                      </span>
                      <p className="font-serif-editorial text-sm font-bold text-white mb-3">
                        {captions.stories.pollQuestion}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                        <div className="rounded-xl bg-slate-900 p-2.5 text-center text-slate-300 border border-slate-800">
                          {captions.stories.pollOptions[0]}
                        </div>
                        <div className="rounded-xl bg-slate-900 p-2.5 text-center text-slate-300 border border-slate-800">
                          {captions.stories.pollOptions[1]}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Empty state when no caption yet */}
            {!isGenerating && !captions && (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <ImageIcon className="h-12 w-12 mb-3 opacity-40 text-amber-400" />
                <p className="font-serif-editorial text-base text-slate-300">
                  Aún no has generado las captions de hoy.
                </p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Sube la foto de tu viñeta o pulsa «Cargar viñeta de prueba» para ver cómo se redacta sola para Instagram y TikTok.
                </p>
                <button
                  onClick={handleLoadSampleCartoon}
                  className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-300 hover:bg-amber-500/20"
                >
                  Probar con viñeta de ejemplo ahora
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Historial de Viñetas Guardadas del Creador */}
      {savedCartoons.length > 0 && (
        <div className="rounded-3xl border border-slate-800 bg-[#0c1017] p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
            <h3 className="font-serif-editorial text-xl font-bold text-white flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-emerald-400" />
              Tus Viñetas Anteriores ({savedCartoons.length})
            </h3>
            <span className="text-xs font-mono text-slate-400">Guardadas localmente</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {savedCartoons.map((c) => (
              <div
                key={c.id}
                className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-3 transition-all hover:border-amber-500/50 hover:bg-slate-900"
              >
                <div className="aspect-[4/5] overflow-hidden rounded-xl bg-black mb-2 flex items-center justify-center">
                  <img
                    src={c.imageDataUrl}
                    alt={c.word}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-serif-editorial font-bold text-white">{c.word}</span>
                  <span className="text-[10px] font-mono text-slate-400">{c.date}</span>
                </div>
                <button
                  onClick={() => {
                    setImagePreview(c.imageDataUrl);
                    setCaptions(c.captions);
                  }}
                  className="w-full rounded-lg bg-slate-800 py-1 text-[11px] font-medium text-slate-300 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                >
                  Ver y recargar captions
                </button>
                <button
                  onClick={() => removeSavedCartoon(c.id)}
                  title="Eliminar de galería"
                  className="absolute top-4 right-4 rounded-lg bg-black/80 p-1 text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
