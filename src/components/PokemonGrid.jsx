import PokemonCard from './PokemonCard';
import { Loader2, Frown, Sparkles } from 'lucide-react';
import { playSound } from '../services/audioService';

export default function PokemonGrid({
  pokemons,
  loading,
  onPokemonClick,
  hasMore,
  onLoadMore,
  loadingMore,
  favorites,
  onToggleFavorite,
  team = [],
  onToggleTeam,
  onCompareWith,
}) {
  const teamIds = new Set(team.map(p => p.id));

  const handleLoadMoreClick = () => {
    playSound.click();
    onLoadMore();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="rounded-2xl bg-white/[.03] p-3.5">
            <div className="skeleton h-3 w-10 mb-3" />
            <div className="skeleton h-24 w-24 mx-auto rounded-full mb-3" />
            <div className="skeleton h-3 w-16 mx-auto mb-2" />
            <div className="flex justify-center gap-1">
              <div className="skeleton h-4 w-12 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!pokemons.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-white/25">
        <Frown className="w-12 h-12 mb-3" />
        <p className="text-base font-semibold text-white/40">No se encontraron Pokémon</p>
        <p className="text-xs">Prueba con otro nombre, número o cambia de generación</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {pokemons.map((p, i) => (
          <PokemonCard
            key={p.id}
            pokemon={p}
            onClick={onPokemonClick}
            index={i}
            isFavorite={favorites.has(p.id)}
            onToggleFavorite={onToggleFavorite}
            isInTeam={teamIds.has(p.id)}
            onToggleTeam={onToggleTeam}
            onCompareWith={onCompareWith}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-8 mb-4">
          <button
            onClick={handleLoadMoreClick}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50 shadow-lg"
            style={{ background: 'var(--dex-primary)' }}
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Cargando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" /> Cargar más de esta generación
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
