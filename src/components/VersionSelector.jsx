import { POKEDEX_VERSIONS } from '../services/pokeApi';

export default function VersionSelector({ currentVersion, onVersionChange }) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar py-1">
      {POKEDEX_VERSIONS.map(v => (
        <button
          key={v.id}
          onClick={() => onVersionChange(v)}
          className={`shrink-0 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 ${
            currentVersion.id === v.id
              ? 'text-white shadow-lg scale-105'
              : 'bg-white/5 text-white/35 hover:bg-white/10 hover:text-white/60'
          }`}
          style={currentVersion.id === v.id ? { background: 'var(--dex-primary)' } : {}}
        >
          {v.label}
          <span className="text-[9px] ml-1 opacity-60">({v.gen})</span>
        </button>
      ))}
    </div>
  );
}
