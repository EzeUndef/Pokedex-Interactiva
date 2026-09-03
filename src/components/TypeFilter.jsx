import { TYPE_TRANSLATIONS } from '../services/pokeApi';
import { ArrowUpDown } from 'lucide-react';

const typeEntries = Object.entries(TYPE_TRANSLATIONS);

export default function TypeFilter({ selectedType, onTypeChange, sortBy, onSortChange }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="flex items-center gap-3">
        {/* Sort dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 pr-8 text-xs font-medium text-white/60 focus:outline-none focus:ring-2 focus:ring-red-500/30 cursor-pointer hover:bg-white/[0.07] transition-all"
          >
            <option value="id-asc" className="bg-[#0a0a0f]">N° ↑</option>
            <option value="id-desc" className="bg-[#0a0a0f]">N° ↓</option>
            <option value="name-asc" className="bg-[#0a0a0f]">A → Z</option>
            <option value="name-desc" className="bg-[#0a0a0f]">Z → A</option>
          </select>
          <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/30 pointer-events-none" />
        </div>

        {/* Type scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
          <button
            onClick={() => onTypeChange(null)}
            className={`shrink-0 px-3.5 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
              selectedType === null
                ? 'bg-white text-[#0a0a0f] shadow-lg shadow-white/10'
                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
            }`}
          >
            Todos
          </button>

          {typeEntries.map(([en, es]) => (
            <button
              key={en}
              onClick={() => onTypeChange(en)}
              className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-semibold transition-all duration-200 ${
                selectedType === en
                  ? `type-${en} text-white shadow-lg scale-105`
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/60'
              }`}
            >
              {es}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
