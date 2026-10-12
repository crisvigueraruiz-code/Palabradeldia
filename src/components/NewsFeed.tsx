import React, { useState, useMemo } from 'react';
import { GlobalNewsItem, CategoryType, RegionType } from '../types.ts';
import { NewsCard } from './NewsCard.tsx';
import { Search, Filter, Layers, Globe2, X } from 'lucide-react';

interface NewsFeedProps {
  newsItems: GlobalNewsItem[];
  selectedNewsId: string | null;
}

const CATEGORIES: { label: string; value: 'all' | CategoryType }[] = [
  { label: 'Todas las áreas', value: 'all' },
  { label: 'Geopolítica', value: 'geopolitica' },
  { label: 'Tecnología', value: 'tecnologia' },
  { label: 'Economía', value: 'economia' },
  { label: 'Clima & Planeta', value: 'clima' },
  { label: 'Sociedad', value: 'sociedad' },
];

const REGIONS: { label: string; value: 'all' | RegionType }[] = [
  { label: 'Todo el mundo', value: 'all' },
  { label: 'Europa', value: 'Europa' },
  { label: 'América', value: 'América' },
  { label: 'Asia-Pacífico', value: 'Asia-Pacífico' },
  { label: 'Oriente Medio', value: 'Oriente Medio' },
  { label: 'África', value: 'África' },
];

export const NewsFeed: React.FC<NewsFeedProps> = ({ newsItems, selectedNewsId }) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | CategoryType>('all');
  const [selectedRegion, setSelectedRegion] = useState<'all' | RegionType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = useMemo(() => {
    return newsItems.filter((item) => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (selectedRegion !== 'all' && item.region !== selectedRegion) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesSummary = item.summary.toLowerCase().includes(query);
        const matchesCountry = item.country.toLowerCase().includes(query);
        const matchesConcept = item.relatedConcept.toLowerCase().includes(query);
        return matchesTitle || matchesSummary || matchesCountry || matchesConcept;
      }
      return true;
    });
  }, [newsItems, selectedCategory, selectedRegion, searchQuery]);

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-1">
            <Layers className="h-3.5 w-3.5" />
            Compilación Global Diaria
          </div>
          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-extrabold text-slate-100">
            Crónica & Despachos Estratégicos
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 font-serif-editorial mt-1">
            Síntesis rigurosa de los acontecimientos de mayor peso estructural en los cinco continentes.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por país, titular o concepto..."
            className="w-full rounded-xl border border-slate-800 bg-[#0c1017] pl-9 pr-8 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips Bar */}
      <div className="space-y-3">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Eje:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`rounded-lg px-2.5 py-1 text-xs transition-all ${
                selectedCategory === cat.value
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/10'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200 ring-1 ring-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Regions */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-1 flex items-center gap-1">
            <Globe2 className="h-3 w-3" /> Región:
          </span>
          {REGIONS.map((reg) => (
            <button
              key={reg.value}
              onClick={() => setSelectedRegion(reg.value)}
              className={`rounded-lg px-2.5 py-1 text-xs transition-all ${
                selectedRegion === reg.value
                  ? 'bg-slate-700 text-white font-medium ring-1 ring-slate-600'
                  : 'bg-slate-900/50 text-slate-400 hover:bg-slate-800 hover:text-slate-200 ring-1 ring-slate-800/80'
              }`}
            >
              {reg.label}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      {filteredNews.length === 0 ? (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-12 text-center">
          <p className="font-serif-editorial text-lg text-slate-300">
            No se encontraron despachos con los filtros seleccionados.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedRegion('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs font-mono text-amber-400 underline hover:text-amber-300"
          >
            Restablecer todos los filtros
          </button>
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredNews.map((item) => (
            <NewsCard
              key={item.id}
              item={item}
              isSelected={selectedNewsId === item.id}
            />
          ))}
        </div>
      )}
    </section>
  );
};
