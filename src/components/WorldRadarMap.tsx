import React, { useState } from 'react';
import { GlobalNewsItem } from '../types.ts';
import { Globe, MapPin, ExternalLink, ShieldAlert, Sparkles } from 'lucide-react';

interface WorldRadarMapProps {
  newsItems: GlobalNewsItem[];
  selectedNewsId: string | null;
  onSelectNews: (id: string) => void;
  worldTensionIndex: number;
}

// Convert [lat, lng] to SVG percentage coordinates (Equirectangular projection)
function coordsToSvg(lat: number, lng: number): { x: number; y: number } {
  // lng goes from -180 to 180 -> x goes from 0 to 100%
  const x = ((lng + 180) / 360) * 100;
  // lat goes from -90 to 90 -> y goes from 100% to 0
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
}

export const WorldRadarMap: React.FC<WorldRadarMapProps> = ({
  newsItems,
  selectedNewsId,
  onSelectNews,
  worldTensionIndex,
}) => {
  const [hoveredItem, setHoveredItem] = useState<GlobalNewsItem | null>(null);

  const categoryColor = (cat: string) => {
    switch (cat) {
      case 'geopolitica': return '#f59e0b'; // amber
      case 'tecnologia': return '#38bdf8'; // sky
      case 'economia': return '#10b981'; // emerald
      case 'clima': return '#34d399'; // green
      case 'sociedad': return '#c084fc'; // purple
      default: return '#fbbf24';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800 bg-[#0c1017] p-5 shadow-2xl backdrop-blur-xl">
      {/* Header bar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30">
            <Globe className="h-4 w-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-editorial text-lg font-semibold tracking-wide text-slate-100">
                Radar Geopolítico Mundial
              </h3>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                En directo
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Puntos focales de las compilaciones globales de la jornada
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-1.5 ring-1 ring-slate-800">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-slate-400">Índice de Tensión Global:</span>
            <span className="font-mono-code font-bold text-amber-300">{worldTensionIndex}/100</span>
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" /> Geopolítica
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-sky-400" /> Tecnología
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400" /> Economía
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Map Canvas */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-slate-800/60 bg-[#070a0f]">
        {/* Subtle coordinate grid lines */}
        <div className="pointer-events-none absolute inset-0 opacity-20">
          <div className="h-full w-full bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:5%_10%]" />
        </div>

        {/* Simplified Vector Continents Outline */}
        <svg
          viewBox="0 0 1000 500"
          className="h-full w-full opacity-35"
          fill="none"
          stroke="#475569"
          strokeWidth="1.2"
        >
          {/* North America */}
          <path d="M 150 70 Q 220 50 290 80 Q 280 140 230 170 Q 180 190 140 140 Z" fill="#1e293b" fillOpacity="0.4" />
          <path d="M 180 180 L 220 220 L 200 250 L 160 210 Z" fill="#1e293b" fillOpacity="0.4" />
          {/* South America */}
          <path d="M 230 260 Q 320 280 300 370 Q 270 460 240 450 Q 200 350 230 260 Z" fill="#1e293b" fillOpacity="0.4" />
          {/* Europe */}
          <path d="M 460 80 Q 550 70 560 140 Q 500 170 460 130 Z" fill="#1e293b" fillOpacity="0.4" />
          <path d="M 440 130 L 490 130 L 480 160 L 430 150 Z" fill="#1e293b" fillOpacity="0.4" />
          {/* Africa */}
          <path d="M 460 180 Q 560 180 570 260 Q 550 380 500 390 Q 450 310 440 230 Z" fill="#1e293b" fillOpacity="0.4" />
          {/* Asia */}
          <path d="M 570 70 Q 820 60 870 140 Q 850 240 760 270 Q 640 230 580 160 Z" fill="#1e293b" fillOpacity="0.4" />
          <path d="M 670 220 L 730 230 L 700 290 Z" fill="#1e293b" fillOpacity="0.4" />
          {/* Australia / Oceania */}
          <path d="M 780 320 Q 870 310 880 380 Q 810 420 760 370 Z" fill="#1e293b" fillOpacity="0.4" />
        </svg>

        {/* Hotspot Markers */}
        {newsItems.map((item) => {
          const { x, y } = coordsToSvg(item.coordinates[0], item.coordinates[1]);
          const isSelected = selectedNewsId === item.id;
          const color = categoryColor(item.category);

          return (
            <div
              key={item.id}
              style={{ left: `${x}%`, top: `${y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform duration-200 hover:scale-125"
              onClick={() => onSelectNews(item.id)}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {/* Radar pulse ring */}
              <span
                style={{ borderColor: color }}
                className="absolute -inset-2.5 rounded-full border opacity-75 animate-ping"
              />
              {/* Main marker dot */}
              <div
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 12px ${color}`,
                }}
                className={`relative flex h-3.5 w-3.5 items-center justify-center rounded-full ring-2 ring-slate-900 transition-all ${
                  isSelected ? 'scale-150 ring-white' : ''
                }`}
              >
                <div className="h-1 w-1 rounded-full bg-slate-950" />
              </div>

              {/* Tag for country */}
              <div
                className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-medium tracking-wider text-slate-300 shadow-md ring-1 ring-slate-800 transition-opacity ${
                  isSelected ? 'opacity-100 font-bold text-amber-300 ring-amber-500/50' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {item.country}
              </div>
            </div>
          );
        })}

        {/* Hover / Preview Card floating over radar */}
        {hoveredItem && (
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 max-w-md rounded-xl border border-slate-700/80 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-md transition-all sm:bottom-4 sm:left-4 z-20">
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="flex items-center gap-1 font-semibold text-amber-400">
                <MapPin className="h-3 w-3" />
                {hoveredItem.country} • {hoveredItem.region}
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono text-[10px] uppercase text-slate-400">
                {hoveredItem.category}
              </span>
            </div>
            <p className="mt-1 font-serif-editorial text-sm font-semibold text-slate-100 line-clamp-1">
              {hoveredItem.title}
            </p>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {hoveredItem.summary}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400">
              <span className="italic text-amber-200/80">
                Concepto: {hoveredItem.relatedConcept}
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                Clic para ir a la noticia <ExternalLink className="h-3 w-3" />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Quick Jump Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="text-xs font-medium text-slate-400 mr-1 flex items-center gap-1">
          <Sparkles className="h-3 w-3 text-amber-400" />
          Focos de hoy:
        </span>
        {newsItems.map((n) => (
          <button
            key={n.id}
            onClick={() => onSelectNews(n.id)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all ${
              selectedNewsId === n.id
                ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-500/40 font-medium'
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 ring-1 ring-slate-800'
            }`}
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: categoryColor(n.category) }}
            />
            {n.country}
          </button>
        ))}
      </div>
    </div>
  );
};
