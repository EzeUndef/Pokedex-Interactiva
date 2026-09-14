import { Search, X, Shuffle, Heart } from 'lucide-react';

export default function Header({ searchTerm, onSearchChange, totalCount, onRandom, onToggleFavorites, showFavorites, favCount }) {
  return (
    <div className="px-4 py-3 flex flex-col sm:flex-row items-center gap-3 border-b border-white/5">
      {/* Search */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
        <input
          type="text"
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Buscar por nombre o número..."
          className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:ring-[color:var(--dex-primary)]/40 focus:border-[color:var(--dex-primary)]/40 transition-all"
        />
        {searchTerm && (
          <button onClick={() => onSearchChange('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-white/20 font-mono mr-1">{totalCount} pokémon</span>
        <button
          onClick={onToggleFavorites}
          className={`w-9 h-9 flex items-center justify-center rounded-xl border transition-all ${
            showFavorites
              ? 'bg-red-500/20 border-red-500/30 text-red-400'
              : 'bg-white/5 border-white/10 text-white/30 hover:text-red-400'
          }`}
          title="Favoritos"
        >
          <Heart className={`w-4 h-4 ${showFavorites ? 'fill-red-400' : ''}`} />
          {favCount > 0 && (
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-[8px] font-bold text-white rounded-full flex items-center justify-center">
              {favCount > 9 ? '9+' : favCount}
            </span>
          )}
        </button>
        <button
          onClick={onRandom}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/30 hover:text-yellow-400 transition-all"
          title="Pokémon Aleatorio"
        >
          <Shuffle className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
