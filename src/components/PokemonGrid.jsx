import PokemonCard from './PokemonCard';
import { Loader2, Frown, Sparkles } from 'lucide-react';

export default function PokemonGrid({ pokemons, loading, onPokemonClick, hasMore, onLoadMore, loadingMore, favorites, onToggleFavorite }) {
  
  // 1. Estado de carga inicial (Esqueletos)
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 p-4 max-w-7xl mx-auto">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <div className="glass-card rounded-2xl p-4">
              <div className="skeleton h-3 w-10 mb-4" />
              <div className="skeleton h-28 w-28 mx-auto rounded-full mb-4" />
              <div className="skeleton h-4 w-20 mx-auto mb-2" />
              <div className="flex justify-center gap-1.5">
                <div className="skeleton h-5 w-14 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Estado vacío de seguridad (Previene crasheos si el arreglo no existe)
  if (!pokemons || pokemons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-white/30">
        <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-5">
          <Frown className="w-10 h-10" />
        </div>
        <p className="text-lg font-semibold text-white/50 mb-1">No se encontraron Pokémon</p>
        <p className="text-sm">Intenta buscar con otro nombre o número</p>
      </div>
    );
  }

  // 3. Renderizado principal: Grilla de tarjetas + Botón Cargar Más
  return (
    <section aria-label="Galería de Pokémon" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      
      {/* Grilla */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {pokemons.map((pokemon, index) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            onClick={onPokemonClick}
            index={index}
            isFavorite={favorites?.has ? favorites.has(pokemon.id) : false}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      {/* Botón Load More */}
      {hasMore && (
        <div className="flex justify-center mt-10">
          <button
            onClick={onLoadMore}
            disabled={loadingMore}
            className="group flex items-center gap-2.5 px-8 py-3 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-semibold rounded-2xl shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Cargando...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Cargar más Pokémon
              </>
            )}
          </button>
        </div>
      )}
      
    </section>
  );
}