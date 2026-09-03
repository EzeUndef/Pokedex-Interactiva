import { useState, useEffect, useRef } from 'react';
import { X, Ruler, Weight, Sparkles, Heart, Shield, Zap, Star, Volume2, VolumeX, ChevronRight } from 'lucide-react';
import { fetchPokemonDetails, fetchPokemonSpecies, fetchEvolutionChain } from '../services/pokeApi';
import { formatPokedexNumber, getTypeGradient, getTypeBgColor } from '../utils/helpers';

export default function PokemonModal({ pokemon, onClose, isFavorite, onToggleFavorite }) {
  const [details, setDetails] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!pokemon) return;
    setLoading(true);
    setActiveTab('about');
    setEvolution([]);
    Promise.all([
      fetchPokemonDetails(pokemon.id),
      fetchPokemonSpecies(pokemon.id),
    ])
      .then(([det, sp]) => {
        setDetails(det);
        setSpecies(sp);
        // Cargar cadena evolutiva
        if (sp.evolutionChainUrl) {
          fetchEvolutionChain(sp.evolutionChainUrl)
            .then(setEvolution)
            .catch(() => setEvolution([]));
        }
      })
      .finally(() => setLoading(false));
  }, [pokemon]);

  const playCry = () => {
    if (!details?.cries?.latest) return;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    const audio = new Audio(details.cries.latest);
    audioRef.current = audio;
    setIsPlaying(true);
    audio.play();
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => setIsPlaying(false);
  };

  if (!pokemon) return null;

  const mainType = pokemon.types[0]?.name || 'normal';
  const typeColor = getTypeBgColor(mainType);

  const tabs = [
    { id: 'about', label: 'Info' },
    { id: 'stats', label: 'Stats' },
    { id: 'evolution', label: 'Evolución' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md max-h-[95vh] sm:max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up sm:animate-slide-in"
      >
        {/* Header con gradiente del tipo */}
        <div className={`relative bg-gradient-to-br ${getTypeGradient(mainType)} p-6 pb-24 rounded-t-3xl`}>
          {/* Top buttons */}
          <div className="flex items-center justify-between relative z-10">
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-xl text-white/80 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {/* Cry button */}
              {details?.cries?.latest && (
                <button
                  onClick={playCry}
                  className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                    isPlaying
                      ? 'bg-white/30 text-white scale-110'
                      : 'bg-black/20 hover:bg-black/40 text-white/80 hover:text-white'
                  }`}
                  title="Escuchar grito"
                >
                  {isPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              )}
              {/* Favorite button */}
              <button
                onClick={() => onToggleFavorite(pokemon.id)}
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${
                  isFavorite
                    ? 'bg-red-500/30 text-white scale-110'
                    : 'bg-black/20 hover:bg-black/40 text-white/80 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Background pokeball spinning */}
          <div className="absolute top-2 right-4 w-44 h-44 opacity-[0.08]" style={{ animation: 'spin-slow 20s linear infinite' }}>
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2"/>
              <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          {/* Pokemon info */}
          <div className="relative z-10 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-white/40 text-sm font-mono font-bold">
                {formatPokedexNumber(pokemon.id)}
              </span>
              {(species?.isLegendary || species?.isMythical) && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400/20 rounded-full">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  <span className="text-yellow-200 text-[10px] font-bold">
                    {species.isLegendary ? 'Legendario' : 'Mítico'}
                  </span>
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-1 capitalize">
              {species?.nameEs || pokemon.name}
            </h2>
            {species?.genus && (
              <p className="text-white/50 text-sm mt-0.5">{species.genus}</p>
            )}
            <div className="flex gap-2 mt-3">
              {pokemon.types.map((type) => (
                <span
                  key={type.name}
                  className="px-4 py-1 bg-black/20 backdrop-blur-sm rounded-xl text-sm font-semibold text-white"
                >
                  {type.nameEs}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Pokemon image floating */}
        <div className="relative -mt-20 flex justify-center z-20 mb-2">
          {loading ? (
            <div className="w-40 h-40 skeleton rounded-full" />
          ) : (
            <img
              src={details?.sprites.artwork}
              alt={pokemon.name}
              className="w-48 h-48 object-contain drop-shadow-2xl animate-float"
            />
          )}
        </div>

        {/* Content */}
        <div className="bg-[#0f0f1a] rounded-b-3xl px-5 pt-1 pb-6">
          {/* Tabs */}
          <div className="flex gap-1 mb-5 bg-white/[0.03] rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white shadow-sm'
                    : 'text-white/30 hover:text-white/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="skeleton h-4 w-full" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-5/6" />
              <div className="skeleton h-20 w-full mt-4" />
            </div>
          ) : (
            <>
              {/* About Tab */}
              {activeTab === 'about' && (
                <div className="space-y-4 animate-fade-in-up">
                  {/* Descripción */}
                  <div className="bg-white/[0.03] rounded-xl p-4">
                    <p className="text-white/60 text-sm leading-relaxed">
                      {species?.description}
                    </p>
                  </div>

                  {/* Medidas */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Ruler className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">Altura</p>
                        <p className="text-white font-bold">{details?.height} m</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-3">
                      <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <Weight className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">Peso</p>
                        <p className="text-white font-bold">{details?.weight} kg</p>
                      </div>
                    </div>
                  </div>

                  {/* Habilidades */}
                  <div>
                    <h4 className="text-[10px] font-bold text-white/25 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      Habilidades
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {details?.abilities.map((ability) => (
                        <span
                          key={ability.name}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize ${
                            ability.isHidden
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-white/[0.05] text-white/60 border border-white/5'
                          }`}
                        >
                          {ability.name.replace('-', ' ')}
                          {ability.isHidden && (
                            <span className="text-[9px] ml-1 text-purple-400">(oculta)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Info adicional */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Heart className="w-3.5 h-3.5 text-pink-400" />
                        <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">Felicidad</p>
                      </div>
                      <p className="text-white font-bold text-xl">{species?.baseHappiness ?? '—'}</p>
                    </div>
                    <div className="bg-white/[0.03] rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1.5">
                        <Shield className="w-3.5 h-3.5 text-amber-400" />
                        <p className="text-[10px] text-white/25 uppercase tracking-wider font-semibold">Captura</p>
                      </div>
                      <p className="text-white font-bold text-xl">{species?.captureRate ?? '—'}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Tab */}
              {activeTab === 'stats' && (
                <div className="space-y-3.5 animate-fade-in-up">
                  {details?.stats.map((stat, i) => (
                    <div key={stat.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">
                          {stat.nameEs}
                        </span>
                        <span className="text-sm font-bold text-white/90 tabular-nums">
                          {stat.value}
                        </span>
                      </div>
                      <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full stat-bar-fill"
                          style={{
                            width: `${Math.min((stat.value / 255) * 100, 100)}%`,
                            backgroundColor: stat.color,
                            opacity: 0.85,
                          }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Total */}
                  <div className="pt-3 border-t border-white/5">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-white/40 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        Total
                      </span>
                      <span className="text-2xl font-extrabold text-white">
                        {details?.stats.reduce((sum, s) => sum + s.value, 0)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Evolution Tab */}
              {activeTab === 'evolution' && (
                <div className="animate-fade-in-up">
                  {evolution.length <= 1 ? (
                    <div className="text-center py-8">
                      <p className="text-white/30 text-sm">Este Pokémon no evoluciona</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      {evolution.map((evo, i) => (
                        <div key={evo.id} className="flex flex-col items-center">
                          {i > 0 && (
                            <div className="flex flex-col items-center my-1 text-white/20">
                              <ChevronRight className="w-5 h-5 rotate-90" />
                              {evo.minLevel && (
                                <span className="text-[10px] font-semibold bg-white/5 px-2 py-0.5 rounded-full mt-0.5">
                                  Nv. {evo.minLevel}
                                </span>
                              )}
                              {evo.item && (
                                <span className="text-[10px] font-semibold bg-white/5 px-2 py-0.5 rounded-full mt-0.5 capitalize">
                                  {evo.item.replace('-', ' ')}
                                </span>
                              )}
                            </div>
                          )}
                          <div
                            className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                              evo.id === pokemon.id
                                ? 'bg-white/10 ring-1 ring-white/20 scale-105'
                                : 'bg-white/[0.03] hover:bg-white/[0.06]'
                            }`}
                          >
                            <img
                              src={evo.sprite}
                              alt={evo.name}
                              className="w-20 h-20 object-contain"
                              loading="lazy"
                            />
                            <p className="text-xs font-semibold text-white/70 capitalize mt-1">{evo.name}</p>
                            <p className="text-[10px] font-mono text-white/25">{formatPokedexNumber(evo.id)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
