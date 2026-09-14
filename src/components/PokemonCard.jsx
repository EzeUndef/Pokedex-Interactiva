import { useState } from 'react';
import { Heart, Plus, Check, Swords, Sparkles } from 'lucide-react';
import { formatPokedexNumber, getTypeColor } from '../utils/helpers';
import { playSound } from '../services/audioService';

export default function PokemonCard({
  pokemon,
  onClick,
  index,
  isFavorite,
  onToggleFavorite,
  isInTeam,
  onToggleTeam,
  onCompareWith,
}) {
  const [loaded, setLoaded] = useState(false);
  const [isShiny, setIsShiny] = useState(false);
  const mainType = pokemon.types[0]?.name || 'normal';
  const color = getTypeColor(mainType);

  const handleCardClick = () => {
    playSound.select();
    onClick(pokemon);
  };

  const handleFav = (e) => {
    e.stopPropagation();
    playSound.click();
    onToggleFavorite(pokemon.id);
  };

  const handleTeam = (e) => {
    e.stopPropagation();
    if (isInTeam) playSound.remove();
    else playSound.add();
    onToggleTeam(pokemon);
  };

  const handleCompare = (e) => {
    e.stopPropagation();
    playSound.click();
    onCompareWith(pokemon);
  };

  const handleToggleShiny = (e) => {
    e.stopPropagation();
    playSound.click();
    setIsShiny(prev => !prev);
  };

  const spriteUrl = isShiny ? pokemon.shinySprite || pokemon.sprite : pokemon.sprite;

  return (
    <div
      onClick={handleCardClick}
      className="group cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${(index % 24) * 20}ms` }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-white/[.06] bg-white/[.03] hover:bg-white/[.07] transition-all duration-300 hover:-translate-y-1"
        style={{ boxShadow: `0 4px 20px ${color}15` }}
      >
        {/* Top color accent */}
        <div className="h-0.5 opacity-60" style={{ background: color }} />

        {/* Decorative pokeball background */}
        <div className="absolute -bottom-6 -right-6 w-24 h-24 opacity-[.03] group-hover:opacity-[.06] transition-opacity pointer-events-none">
          <svg viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="3" />
            <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="3" />
          </svg>
        </div>

        <div className="relative p-3 pt-3.5">
          {/* Action header */}
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] font-mono font-bold text-white/30">
              {formatPokedexNumber(pokemon.id)}
            </span>

            <div className="flex items-center gap-1">
              {/* Shiny Toggle */}
              <button
                onClick={handleToggleShiny}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition-all ${
                  isShiny ? 'text-yellow-300 bg-yellow-400/20' : 'text-white/20 hover:text-yellow-300'
                }`}
                title="Variocolor Shiny ✨"
              >
                <Sparkles className="w-3 h-3" />
              </button>

              {/* Compare Button */}
              {onCompareWith && (
                <button
                  onClick={handleCompare}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-white/20 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                  title="Comparar este Pokémon"
                >
                  <Swords className="w-3 h-3" />
                </button>
              )}

              {/* Add to Team Button */}
              {onToggleTeam && (
                <button
                  onClick={handleTeam}
                  className={`w-6 h-6 flex items-center justify-center rounded-md transition-all ${
                    isInTeam
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'text-white/20 hover:text-emerald-400 hover:bg-emerald-500/10'
                  }`}
                  title={isInTeam ? 'Quitar del equipo' : 'Añadir al equipo'}
                >
                  {isInTeam ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                </button>
              )}

              {/* Favorite Button */}
              <button
                onClick={handleFav}
                className={`w-6 h-6 flex items-center justify-center rounded-md transition-all ${
                  isFavorite ? 'text-red-400' : 'text-white/20 hover:text-red-400'
                }`}
                title="Favorito"
              >
                <Heart className={`w-3 h-3 ${isFavorite ? 'fill-red-400' : ''}`} />
              </button>
            </div>
          </div>

          {/* Sprite image */}
          <div className="flex justify-center py-2">
            <img
              src={spriteUrl}
              alt={pokemon.name}
              className="w-24 h-24 object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onLoad={() => setLoaded(true)}
            />
          </div>

          {/* Name */}
          <p className="text-[12px] font-bold text-white/90 capitalize text-center mb-2 truncate">
            {pokemon.name}
          </p>

          {/* Types */}
          <div className="flex justify-center gap-1">
            {pokemon.types.map(t => (
              <span
                key={t.name}
                className={`type-${t.name} px-2 py-[2px] rounded-md text-[9px] font-bold text-white`}
              >
                {t.nameEs}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
