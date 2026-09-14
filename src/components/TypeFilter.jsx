import { TYPE_TRANSLATIONS } from '../services/pokeApi';
import { ArrowUpDown } from 'lucide-react';

const typeEntries = Object.entries(TYPE_TRANSLATIONS);

export default function TypeFilter({ selectedType, onTypeChange, sortBy, onSortChange }) {
  return (
    <div className="px-4 py-2 flex items-center gap-2">
      {/* Sort */}
      <div className="relative shrink-0">
        <select
          value={sortBy}
          onChange={e => onSortChange(e.target.value)}
          className="appearance-none bg-white/5 border border-white/10 rounded-lg px-2.5 py-1.5 pr-7 text-[11px] font-medium text-white/50 focus:outline-none cursor-pointer hover:bg-white/[.07] transition-all"
        >
          <option value="id-asc" className="bg-[#0c0c14]">N° ↑</option>
          <option value="id-desc" className="bg-[#0c0c14]">N° ↓</option>
          <option value="name-asc" className="bg-[#0c0c14]">A → Z</option>
          <option value="name-desc" className="bg-[#0c0c14]">Z → A</option>
        </select>
        <ArrowUpDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-white/20 pointer-events-none" />
      </div>

      {/* Types */}
      <div className="flex items-center gap-1 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => onTypeChange(null)}
          className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-bold transition-all ${
            !selectedType
              ? 'bg-white text-[#0c0c14]'
              : 'bg-white/5 text-white/30 hover:bg-white/10'
          }`}
        >
          Todos
        </button>
        {typeEntries.map(([en, es]) => (
          <button
            key={en}
            onClick={() => onTypeChange(en)}
            className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
              selectedType === en
                ? `type-${en} text-white shadow-lg`
                : 'bg-white/5 text-white/30 hover:bg-white/10'
            }`}
          >
            {es}
          </button>
        ))}
      </div>
    </div>
  );
}
