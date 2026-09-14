import { useState, useEffect, useMemo } from 'react';
import { Swords, Shuffle, Trophy, X, Search, Sparkles, ArrowUp, ArrowDown, Sliders } from 'lucide-react';
import { fetchPokemonDetails } from '../services/pokeApi';
import { formatPokedexNumber, getTypeColor, getDefenseEffectiveness } from '../utils/helpers';
import { NATURES, calculateRealStat, getNatureStatEffect } from '../services/natureService';
import StatRadarChart from './StatRadarChart';
import { playSound } from '../services/audioService';

export default function PokemonComparator({ initialPokeA, initialPokeB, masterList = [], onClose }) {
  const [pokeA, setPokeA] = useState(null);
  const [pokeB, setPokeB] = useState(null);

  const [natureA, setNatureA] = useState(NATURES[0]);
  const [natureB, setNatureB] = useState(NATURES[0]);

  // Nivel personalizado independiente para cada Pokémon (1 a 100)
  const [levelA, setLevelA] = useState(50);
  const [levelB, setLevelB] = useState(50);

  // Modo: 'custom' (Nivel personalizado) | 'base' (Stats Base)
  const [useCustomLevel, setUseCustomLevel] = useState(true);

  const [shinyA, setShinyA] = useState(false);
  const [shinyB, setShinyB] = useState(false);

  // Buscadores independientes para A y B
  const [searchA, setSearchA] = useState('');
  const [searchB, setSearchB] = useState('');
  const [showDropdownA, setShowDropdownA] = useState(false);
  const [showDropdownB, setShowDropdownB] = useState(false);

  const loadPokemon = async (idOrName, target) => {
    try {
      const details = await fetchPokemonDetails(idOrName);
      if (target === 'A') setPokeA(details);
      else setPokeB(details);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (initialPokeA) loadPokemon(initialPokeA.id, 'A');
    else loadPokemon(25, 'A'); // Pikachu por defecto

    if (initialPokeB) loadPokemon(initialPokeB.id, 'B');
    else loadPokemon(6, 'B'); // Charizard por defecto
  }, []);

  const handleRandomize = (target) => {
    playSound.click();
    const randomId = Math.floor(Math.random() * 1025) + 1;
    loadPokemon(randomId, target);
  };

  const matchesA = useMemo(() => {
    if (!searchA.trim()) return [];
    const term = searchA.toLowerCase().trim();
    return masterList.filter(p => p.name.toLowerCase().includes(term) || String(p.id) === term).slice(0, 6);
  }, [searchA, masterList]);

  const matchesB = useMemo(() => {
    if (!searchB.trim()) return [];
    const term = searchB.toLowerCase().trim();
    return masterList.filter(p => p.name.toLowerCase().includes(term) || String(p.id) === term).slice(0, 6);
  }, [searchB, masterList]);

  // Obtener estadísticas ajustadas con nivel independiente y naturaleza
  const getAdjustedStats = (poke, nature, level) => {
    if (!poke) return [];

    return poke.stats.map(s => {
      let finalVal = s.value;
      if (useCustomLevel) {
        finalVal = calculateRealStat(s.value, s.name, level, nature);
      }
      return {
        name: s.name,
        nameEs: s.nameEs,
        baseValue: s.value,
        finalValue: finalVal,
        natureEffect: useCustomLevel ? getNatureStatEffect(nature, s.name) : 0,
      };
    });
  };

  const statsA = useMemo(() => getAdjustedStats(pokeA, natureA, levelA), [pokeA, natureA, levelA, useCustomLevel]);
  const statsB = useMemo(() => getAdjustedStats(pokeB, natureB, levelB), [pokeB, natureB, levelB, useCustomLevel]);

  const totalA = statsA.reduce((sum, s) => sum + s.finalValue, 0);
  const totalB = statsB.reduce((sum, s) => sum + s.finalValue, 0);

  // Efectividad de Tipos
  const effDefA = pokeA ? getDefenseEffectiveness(pokeA.types) : {};
  const effDefB = pokeB ? getDefenseEffectiveness(pokeB.types) : {};

  let maxDmgAtoB = 1;
  pokeA?.types.forEach(t => {
    const mult = effDefB[t.name] ?? 1;
    if (mult > maxDmgAtoB) maxDmgAtoB = mult;
  });

  let maxDmgBtoA = 1;
  pokeB?.types.forEach(t => {
    const mult = effDefA[t.name] ?? 1;
    if (mult > maxDmgBtoA) maxDmgBtoA = mult;
  });

  const getSpriteUrl = (poke, isShiny) => {
    if (!poke) return '';
    if (isShiny) {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/shiny/${poke.id}.png`;
    }
    return poke.sprites.artwork;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 bg-white/[.03] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white shadow-lg">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Comparador Versus (Nuzlocke / PvP)</h2>
            <p className="text-xs text-white/40">Compara Pokémon configurando nivel independiente y naturalezas para combate Nuzlocke.</p>
          </div>
        </div>

        {/* Modo de Cálculo: Nivel Personalizado vs Stats Base */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSound.click();
              setUseCustomLevel(prev => !prev);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              useCustomLevel
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
                : 'bg-white/5 text-white/40 border-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            {useCustomLevel ? 'Nivel Personalizado (Nuzlocke)' : 'Stats Base Únicamente'}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white/50 bg-white/5 hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
              Volver
            </button>
          )}
        </div>
      </div>

      {/* Grid de Combatientes A y B con Nivel e Independencia */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* COMBATIENTE A */}
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4 relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Combatiente 1</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShinyA(prev => !prev)}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                  shinyA ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' : 'bg-white/5 text-white/40 border-white/5'
                }`}
              >
                <Sparkles className="w-3 h-3" /> Shiny
              </button>
              <button
                onClick={() => handleRandomize('A')}
                className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white bg-white/5 px-2 py-1 rounded-lg"
              >
                <Shuffle className="w-3 h-3" /> Azar
              </button>
            </div>
          </div>

          {/* Autocomplete Buscador A */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchA}
              onChange={e => {
                setSearchA(e.target.value);
                setShowDropdownA(true);
              }}
              onFocus={() => setShowDropdownA(true)}
              placeholder="Buscar Pokémon A..."
              className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />

            {showDropdownA && matchesA.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                {matchesA.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      loadPokemon(m.id, 'A');
                      setSearchA('');
                      setShowDropdownA(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 capitalize flex items-center justify-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] font-mono text-white/30">{formatPokedexNumber(m.id)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ficha Pokémon A */}
          {pokeA && (
            <div className="flex items-center gap-4 mb-4">
              <img
                src={getSpriteUrl(pokeA, shinyA)}
                alt={pokeA.name}
                className="w-24 h-24 object-contain drop-shadow-xl animate-float shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/30">{formatPokedexNumber(pokeA.id)}</span>
                  {useCustomLevel && (
                    <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-500/10 px-2 py-0.5 rounded-md border border-cyan-500/20">
                      Nv. {levelA}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white capitalize truncate">{pokeA.name}</h3>
                <div className="flex gap-1.5 mt-1">
                  {pokeA.types.map(t => (
                    <span key={t.name} className={`type-${t.name} px-2 py-0.5 rounded-md text-[10px] font-bold text-white`}>
                      {t.nameEs}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selector de Nivel y Naturaleza A */}
          {useCustomLevel && (
            <div className="space-y-2 bg-white/[.02] p-3 rounded-xl border border-white/5">
              {/* Slider de Nivel para Pokémon A */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-white/50 uppercase tracking-wider text-[10px]">
                    Nivel del Pokémon:
                  </span>
                  <span className="font-mono font-bold text-cyan-400 text-xs">Nv. {levelA}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={levelA}
                  onChange={e => setLevelA(parseInt(e.target.value, 10))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              {/* Selector de Naturaleza A */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                  Naturaleza:
                </label>
                <select
                  value={natureA.id}
                  onChange={e => {
                    const found = NATURES.find(n => n.id === e.target.value);
                    setNatureA(found || NATURES[0]);
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold cursor-pointer"
                >
                  {NATURES.map(n => (
                    <option key={n.id} value={n.id}>
                      {n.nameEs} ({n.desc})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* COMBATIENTE B */}
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4 relative">
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Combatiente 2</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setShinyB(prev => !prev)}
                className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${
                  shinyB ? 'bg-yellow-400/20 text-yellow-300 border-yellow-400/30' : 'bg-white/5 text-white/40 border-white/5'
                }`}
              >
                <Sparkles className="w-3 h-3" /> Shiny
              </button>
              <button
                onClick={() => handleRandomize('B')}
                className="flex items-center gap-1 text-[10px] font-bold text-white/40 hover:text-white bg-white/5 px-2 py-1 rounded-lg"
              >
                <Shuffle className="w-3 h-3" /> Azar
              </button>
            </div>
          </div>

          {/* Autocomplete Buscador B */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchB}
              onChange={e => {
                setSearchB(e.target.value);
                setShowDropdownB(true);
              }}
              onFocus={() => setShowDropdownB(true)}
              placeholder="Buscar Pokémon B..."
              className="w-full pl-8 pr-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-white/30 focus:outline-none"
            />
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/30" />

            {showDropdownB && matchesB.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                {matchesB.map(m => (
                  <button
                    key={m.id}
                    onClick={() => {
                      loadPokemon(m.id, 'B');
                      setSearchB('');
                      setShowDropdownB(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/10 capitalize flex items-center justify-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] font-mono text-white/30">{formatPokedexNumber(m.id)}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ficha Pokémon B */}
          {pokeB && (
            <div className="flex items-center gap-4 mb-4">
              <img
                src={getSpriteUrl(pokeB, shinyB)}
                alt={pokeB.name}
                className="w-24 h-24 object-contain drop-shadow-xl animate-float shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-white/30">{formatPokedexNumber(pokeB.id)}</span>
                  {useCustomLevel && (
                    <span className="text-xs font-bold text-rose-400 font-mono bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                      Nv. {levelB}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-black text-white capitalize truncate">{pokeB.name}</h3>
                <div className="flex gap-1.5 mt-1">
                  {pokeB.types.map(t => (
                    <span key={t.name} className={`type-${t.name} px-2 py-0.5 rounded-md text-[10px] font-bold text-white`}>
                      {t.nameEs}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Selector de Nivel y Naturaleza B */}
          {useCustomLevel && (
            <div className="space-y-2 bg-white/[.02] p-3 rounded-xl border border-white/5">
              {/* Slider de Nivel para Pokémon B */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-white/50 uppercase tracking-wider text-[10px]">
                    Nivel del Pokémon:
                  </span>
                  <span className="font-mono font-bold text-rose-400 text-xs">Nv. {levelB}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={levelB}
                  onChange={e => setLevelB(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>

              {/* Selector de Naturaleza B */}
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-white/40 block mb-1">
                  Naturaleza:
                </label>
                <select
                  value={natureB.id}
                  onChange={e => {
                    const found = NATURES.find(n => n.id === e.target.value);
                    setNatureB(found || NATURES[0]);
                  }}
                  className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-semibold cursor-pointer"
                >
                  {NATURES.map(n => (
                    <option key={n.id} value={n.id}>
                      {n.nameEs} ({n.desc})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Gráficos de Radar Hexagonal Lado a Lado */}
      {pokeA && pokeB && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-xs font-bold text-cyan-400 mb-2 capitalize">
              Radar — {pokeA.name} {useCustomLevel ? `(Nv. ${levelA})` : ''}
            </span>
            <StatRadarChart
              stats={statsA.map(s => ({ name: s.name, value: s.finalValue }))}
              maxStat={useCustomLevel ? Math.max(300, levelA * 4) : 200}
              size={240}
              color="#22d3ee"
            />
          </div>

          <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4 flex flex-col items-center">
            <span className="text-xs font-bold text-rose-400 mb-2 capitalize">
              Radar — {pokeB.name} {useCustomLevel ? `(Nv. ${levelB})` : ''}
            </span>
            <StatRadarChart
              stats={statsB.map(s => ({ name: s.name, value: s.finalValue }))}
              maxStat={useCustomLevel ? Math.max(300, levelB * 4) : 200}
              size={240}
              color="#fb7185"
            />
          </div>
        </div>
      )}

      {/* Comparativa Detallada de Stats */}
      {pokeA && pokeB && (
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider">
              {useCustomLevel ? `Estadísticas Calculadas (Nv. ${levelA} vs Nv. ${levelB})` : 'Estadísticas Base (BST)'}
            </h4>
            <div className="flex items-center gap-2 text-xs font-mono font-bold">
              {totalA > totalB ? (
                <span className="text-cyan-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Ganador Total: {pokeA.name} ({totalA})
                </span>
              ) : totalB > totalA ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Ganador Total: {pokeB.name} ({totalB})
                </span>
              ) : (
                <span className="text-white/50">Empate en Total ({totalA})</span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            {statsA.map((stA, idx) => {
              const stB = statsB[idx] || { finalValue: 0, natureEffect: 0 };
              const isWinA = stA.finalValue > stB.finalValue;
              const isWinB = stB.finalValue > stA.finalValue;

              return (
                <div key={stA.name} className="bg-white/[.02] p-3 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    {/* Val A */}
                    <span className={`flex items-center gap-1 ${isWinA ? 'text-cyan-400 font-extrabold' : 'text-white/70'}`}>
                      {stA.finalValue}
                      {stA.natureEffect > 0 && <ArrowUp className="w-3 h-3 text-emerald-400" title="+10% Naturaleza" />}
                      {stA.natureEffect < 0 && <ArrowDown className="w-3 h-3 text-red-400" title="-10% Naturaleza" />}
                      {isWinA && '👑'}
                    </span>

                    <span className="text-white/40 uppercase tracking-wider font-mono text-[11px]">
                      {stA.nameEs}
                    </span>

                    {/* Val B */}
                    <span className={`flex items-center gap-1 ${isWinB ? 'text-rose-400 font-extrabold' : 'text-white/70'}`}>
                      {isWinB && '👑'}
                      {stB.natureEffect > 0 && <ArrowUp className="w-3 h-3 text-emerald-400" title="+10% Naturaleza" />}
                      {stB.natureEffect < 0 && <ArrowDown className="w-3 h-3 text-red-400" title="-10% Naturaleza" />}
                      {stB.finalValue}
                    </span>
                  </div>

                  {/* Barras Lado a Lado */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-2 bg-white/[.04] rounded-full overflow-hidden flex justify-end">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((stA.finalValue / (useCustomLevel ? Math.max(300, levelA * 4) : 200)) * 100, 100)}%`,
                          background: isWinA ? '#22d3ee' : '#64748b',
                        }}
                      />
                    </div>
                    <div className="h-2 bg-white/[.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((stB.finalValue / (useCustomLevel ? Math.max(300, levelB * 4) : 200)) * 100, 100)}%`,
                          background: isWinB ? '#fb7185' : '#64748b',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
