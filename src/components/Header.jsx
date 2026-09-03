import { Search, X, Shuffle, Heart } from 'lucide-react';

export default function Header({ searchTerm, onSearchChange, totalCount, onRandomPokemon, onToggleFavorites, showFavorites, favoritesCount }) {
  return (
    <header className="sticky top-0 z-40 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="w-4 h-4 bg-white rounded-full border-2 border-white/50 shadow-inner"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">
                <span className="bg-gradient-to-r from-red-400 via-rose-400 to-orange-400 bg-clip-text text-transparent">Pokédex</span>
              </h1>
              <p className="text-[10px] text-white/30 font-medium tracking-[0.2em] uppercase -mt-0.5">
                {totalCount} pokémon
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Buscar por nombre o número..."
                className="w-full pl-9 pr-9 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/30 focus:bg-white/[0.07] transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Favorites button */}
            <button
              onClick={onToggleFavorites}
              className={`relative shrink-0 w-10 h-10 flex items-center justify-center rounded-xl border transition-all duration-300 ${
                showFavorites
                  ? 'bg-red-500/20 border-red-500/30 text-red-400'
                  : 'bg-white/5 border-white/10 text-white/40 hover:text-red-400 hover:bg-red-500/10'
              }`}
              title="Favoritos"
            >
              <Heart className={`w-4 h-4 ${showFavorites ? 'fill-red-400' : ''}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-[9px] font-bold text-white rounded-full flex items-center justify-center">
                  {favoritesCount > 9 ? '9+' : favoritesCount}
                </span>
              )}
            </button>

            {/* Random button */}
            <button
              onClick={onRandomPokemon}
              className="shrink-0 w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-yellow-400 hover:bg-yellow-500/10 hover:border-yellow-500/30 transition-all duration-300"
              title="Pokémon Aleatorio"
            >
              <Shuffle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
