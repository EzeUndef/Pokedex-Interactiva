import { useState } from 'react';
import { Heart } from 'lucide-react';
import { formatPokedexNumber, getTypeBgColor } from '../utils/helpers';

export default function PokemonCard({ pokemon, onClick, index, isFavorite, onToggleFavorite }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const mainType = pokemon.types[0]?.name || 'normal';
  const bgColor = getTypeBgColor(mainType);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(pokemon.id);
  };

  return (
    <div
      onClick={() => onClick(pokemon)}
      className="group relative cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${(index % 20) * 40}ms` }}
    >
      <div
        className={`relative overflow-hidden rounded-2xl glass-card card-3d transition-all duration-500 hover:border-white/15 glow-type-${mainType}`}
        style={{ '--glow-color': bgColor }}
      >
        {/* Colored accent top */}
        <div
          className="absolute top-0 left-0 right-0 h-1 opacity-60"
          style={{ background: bgColor }}
        />

        {/* Background blob */}
        <div
          className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-[0.07] blur-2xl transition-opacity duration-500 group-hover:opacity-[0.12]"
          style={{ background: bgColor }}
        />

        {/* Background pokeball */}
        <div className="absolute -bottom-4 -right-4 w-24 h-24 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity duration-500">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3"/>
            <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="3"/>
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="3"/>
          </svg>
        </div>

        <div className="relative p-4 pt-5">
          {/* Header row */}
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-mono font-bold text-white/25">
              {formatPokedexNumber(pokemon.id)}
            </span>
            <button
              onClick={handleFavoriteClick}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 ${
                isFavorite
                  ? 'text-red-400 bg-red-500/15 scale-110'
                  : 'text-white/15 hover:text-red-400 hover:bg-red-500/10'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-400' : ''}`} />
            </button>
          </div>

          {/* Image */}
          <div className="relative flex justify-center py-3">
            {!imageLoaded && (
              <div className="w-24 h-24 skeleton rounded-full" />
            )}
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className={`w-28 h-28 object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0 absolute'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </div>

          {/* Name */}
          <h3 className="text-[13px] font-bold text-white/90 capitalize text-center mb-2.5 truncate">
            {pokemon.name}
          </h3>

          {/* Types */}
          <div className="flex justify-center gap-1.5">
            {pokemon.types.map((type) => (
              <span
                key={type.name}
                className={`type-${type.name} px-2.5 py-[3px] rounded-lg text-[10px] font-semibold shadow-sm`}
              >
                {type.nameEs}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
