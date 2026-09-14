import { useState, useEffect, useRef } from 'react';
import { X, Ruler, Weight, Sparkles, Heart, Shield, Zap, Star, Volume2, ChevronDown, MapPin, Plus, Check, Swords } from 'lucide-react';
import { fetchPokemonDetails, fetchPokemonSpecies, fetchEvolutionChain, fetchLocationAreas } from '../services/pokeApi';
import { formatPokedexNumber, getTypeColor, translateHabitat, translateVersion } from '../utils/helpers';
import { playSound } from '../services/audioService';

export default function PokemonModal({
  pokemon,
  onClose,
  isFavorite,
  onToggleFavorite,
  isInTeam,
  onToggleTeam,
  onCompareWith,
}) {
  const [details, setDetails] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('about');
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!pokemon) return;
    setLoading(true);
    setTab('about');
    setEvolution([]);
    setLocations([]);

    Promise.all([fetchPokemonDetails(pokemon.id), fetchPokemonSpecies(pokemon.id)])
      .then(([det, sp]) => {
        setDetails(det);
        setSpecies(sp);
        if (sp.evolutionChainUrl) fetchEvolutionChain(sp.evolutionChainUrl).then(setEvolution).catch(() => {});
        fetchLocationAreas(pokemon.id).then(setLocations).catch(() => {});
      })
      .finally(() => setLoading(false));
  }, [pokemon]);

  const playCry = () => {
    if (!details?.cries?.latest) return;
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    const a = new Audio(details.cries.latest);
    audioRef.current = a;
    setPlaying(true);
    a.play();
    a.onended = () => setPlaying(false);
    a.onerror = () => setPlaying(false);
  };

  const handleClose = () => {
    playSound.remove();
    onClose();
  };

  const handleTabChange = (newTab) => {
    playSound.click();
    setTab(newTab);
  };

  const handleTeamClick = () => {
    if (isInTeam) playSound.remove();
    else playSound.add();
    if (onToggleTeam) onToggleTeam(pokemon);
  };

  const handleCompareClick = () => {
    playSound.click();
    if (onCompareWith) {
      onCompareWith(pokemon);
      onClose();
    }
  };

  if (!pokemon) return null;
  const mainType = pokemon.types[0]?.name || 'normal';
  const color = getTypeColor(mainType);

  const tabs = [
    { id: 'about', label: 'Info' },
    { id: 'stats', label: 'Stats' },
    { id: 'evolution', label: 'Evolución' },
    { id: 'locations', label: 'Ubicaciones' },
  ];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" />
      <div
        onClick={e => e.stopPropagation()}
        className="relative w-full sm:max-w-md max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl animate-slide-up sm:animate-fade-in-up"
        style={{ background: 'var(--dex-screen-bg, #0f0f1a)' }}
      >
        {/* ── Header ── */}
        <div className="relative p-5 pb-20 rounded-t-3xl" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}>
          <div className="flex items-center justify-between relative z-10">
            <button
              onClick={handleClose}
              className="w-8 h-8 flex items-center justify-center bg-black/20 hover:bg-black/40 rounded-xl text-white/80 hover:text-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              {/* Cry Audio */}
              {details?.cries?.latest && (
                <button
                  onClick={playCry}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    playing ? 'bg-white/30 scale-110' : 'bg-black/20 hover:bg-black/40'
                  } text-white/80`}
                  title="Reproducir grito oficial"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              )}

              {/* Compare Button */}
              {onCompareWith && (
                <button
                  onClick={handleCompareClick}
                  className="w-8 h-8 flex items-center justify-center rounded-xl bg-black/20 hover:bg-black/40 text-white/80 hover:text-cyan-300 transition-all"
                  title="Comparar con otro Pokémon"
                >
                  <Swords className="w-4 h-4" />
                </button>
              )}

              {/* Add to Team Button */}
              {onToggleTeam && (
                <button
                  onClick={handleTeamClick}
                  className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                    isInTeam ? 'bg-emerald-500/30 text-white scale-110' : 'bg-black/20 hover:bg-black/40 text-white/80'
                  }`}
                  title={isInTeam ? 'En tu equipo (Clic para quitar)' : 'Añadir a mi equipo'}
                >
                  {isInTeam ? <Check className="w-4 h-4 text-emerald-300" /> : <Plus className="w-4 h-4" />}
                </button>
              )}

              {/* Favorite Button */}
              <button
                onClick={() => {
                  playSound.click();
                  onToggleFavorite(pokemon.id);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                  isFavorite ? 'bg-red-500/30 scale-110' : 'bg-black/20 hover:bg-black/40'
                } text-white/80`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
              </button>
            </div>
          </div>

          {/* Spinning Pokeball Background */}
          <div className="absolute top-0 right-4 w-40 h-40 opacity-[.06] animate-spin-slow pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="2"/>
              <line x1="2" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth="2"/>
              <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </div>

          <div className="relative z-10 mt-2">
            <div className="flex items-center gap-2">
              <span className="text-white/50 text-sm font-mono font-bold">{formatPokedexNumber(pokemon.id)}</span>
              {(species?.isLegendary || species?.isMythical) && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-400/20 rounded-full">
                  <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                  <span className="text-yellow-200 text-[9px] font-bold">
                    {species.isLegendary ? 'Legendario' : 'Mítico'}
                  </span>
                </span>
              )}
            </div>
            <h2 className="text-3xl font-extrabold text-white mt-1 capitalize">{species?.nameEs || pokemon.name}</h2>
            {species?.genus && <p className="text-white/60 text-sm">{species.genus}</p>}
            <div className="flex gap-2 mt-2">
              {pokemon.types.map(t => (
                <span key={t.name} className="px-3 py-0.5 bg-black/20 backdrop-blur rounded-lg text-sm font-semibold text-white">
                  {t.nameEs}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── Image ── */}
        <div className="relative -mt-16 flex justify-center z-20 mb-1">
          {loading ? (
            <div className="w-40 h-40 skeleton rounded-full" />
          ) : (
            <img
              src={details?.sprites.artwork}
              alt={pokemon.name}
              className="w-44 h-44 object-contain drop-shadow-2xl animate-float"
            />
          )}
        </div>

        {/* ── Content ── */}
        <div className="px-4 pt-1 pb-6">
          {/* Tabs */}
          <div className="flex gap-0.5 mb-4 bg-white/[.03] rounded-xl p-0.5">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-bold transition-all ${
                  tab === t.id ? 'bg-white/10 text-white shadow' : 'text-white/30 hover:text-white/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="skeleton h-4 w-full"/>
              <div className="skeleton h-4 w-3/4"/>
              <div className="skeleton h-20 w-full mt-4"/>
            </div>
          ) : (
            <>
              {/* ── About Tab ── */}
              {tab === 'about' && (
                <div className="space-y-4 animate-fade-in-up">
                  <div className="bg-white/[.03] rounded-xl p-3.5 border border-white/5">
                    <p className="text-white/70 text-sm leading-relaxed">{species?.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <InfoBox icon={<Ruler className="w-4 h-4 text-blue-400"/>} label="Altura" value={`${details?.height} m`} />
                    <InfoBox icon={<Weight className="w-4 h-4 text-green-400"/>} label="Peso" value={`${details?.weight} kg`} />
                    <InfoBox icon={<Heart className="w-4 h-4 text-pink-400"/>} label="Felicidad" value={species?.baseHappiness ?? '—'} />
                    <InfoBox icon={<Shield className="w-4 h-4 text-amber-400"/>} label="Captura" value={species?.captureRate ?? '—'} />
                  </div>
                  {species?.habitat && (
                    <div className="bg-white/[.03] rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-1">Hábitat</p>
                      <p className="text-white/80 text-sm font-medium">{translateHabitat(species.habitat)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mb-2 flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3"/>Habilidades
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {details?.abilities.map(a => (
                        <span
                          key={a.name}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium capitalize ${
                            a.isHidden
                              ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                              : 'bg-white/[.05] text-white/60 border border-white/5'
                          }`}
                        >
                          {a.name.replace(/-/g,' ')}
                          {a.isHidden && <span className="text-[9px] ml-1 text-purple-400">(oculta)</span>}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Stats Tab ── */}
              {tab === 'stats' && (
                <div className="space-y-3 animate-fade-in-up">
                  {details?.stats.map((s, i) => (
                    <div key={s.name} className="animate-fade-in-up" style={{ animationDelay: `${i * 50}ms` }}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-wider">{s.nameEs}</span>
                        <span className="text-xs font-bold text-white/90 tabular-nums">{s.value}</span>
                      </div>
                      <div className="h-2 bg-white/[.04] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full stat-bar-fill"
                          style={{ width: `${Math.min((s.value/255)*100,100)}%`, backgroundColor: s.color, opacity: 0.85 }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold text-white/40 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-yellow-400"/>BST Total
                    </span>
                    <span className="text-xl font-extrabold text-white">
                      {details?.stats.reduce((s, x) => s + x.value, 0)}
                    </span>
                  </div>
                </div>
              )}

              {/* ── Evolution Tab ── */}
              {tab === 'evolution' && (
                <div className="animate-fade-in-up">
                  {evolution.length <= 1 ? (
                    <p className="text-center text-white/30 text-sm py-8">Este Pokémon no evoluciona</p>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      {evolution.map((evo, i) => (
                        <div key={evo.id} className="flex flex-col items-center">
                          {i > 0 && (
                            <div className="flex flex-col items-center my-1 text-white/20">
                              <ChevronDown className="w-5 h-5" />
                              {evo.minLevel && (
                                <span className="text-[9px] font-bold bg-white/5 px-2 py-0.5 rounded-full">
                                  Nv. {evo.minLevel}
                                </span>
                              )}
                              {evo.item && (
                                <span className="text-[9px] font-bold bg-white/5 px-2 py-0.5 rounded-full capitalize">
                                  {evo.item.replace(/-/g,' ')}
                                </span>
                              )}
                            </div>
                          )}
                          <div className={`flex flex-col items-center p-3 rounded-2xl transition-all ${
                            evo.id === pokemon.id ? 'bg-white/10 ring-1 ring-white/20 scale-105' : 'bg-white/[.03]'
                          }`}>
                            <img src={evo.sprite} alt={evo.name} className="w-20 h-20 object-contain" loading="lazy"/>
                            <p className="text-[11px] font-semibold text-white/70 capitalize mt-1">{evo.name}</p>
                            <p className="text-[9px] font-mono text-white/30">{formatPokedexNumber(evo.id)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── Locations Tab ── */}
              {tab === 'locations' && (
                <div className="animate-fade-in-up">
                  {!locations.length ? (
                    <p className="text-center text-white/30 text-sm py-8">No hay datos de ubicación disponibles para este Pokémon</p>
                  ) : (
                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {locations.slice(0, 25).map((loc, i) => (
                        <div key={i} className="bg-white/[.03] border border-white/5 rounded-xl p-3">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-3.5 h-3.5 text-red-400 mt-0.5 shrink-0" />
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold text-white/80 capitalize">{loc.location}</p>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {loc.versions.slice(0, 8).map((v, j) => (
                                  <span key={j} className="text-[9px] font-medium px-1.5 py-0.5 bg-white/5 rounded text-white/40">
                                    {translateVersion(v.version)} ({v.maxChance}%)
                                  </span>
                                ))}
                              </div>
                            </div>
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

function InfoBox({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2.5 bg-white/[.03] border border-white/5 rounded-xl p-3">
      <div className="w-9 h-9 rounded-lg bg-white/[.05] flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-[9px] text-white/30 uppercase tracking-wider font-bold">{label}</p>
        <p className="text-white font-bold text-sm">{value}</p>
      </div>
    </div>
  );
}
