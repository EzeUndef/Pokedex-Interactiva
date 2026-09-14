import { useState, useEffect } from 'react';
import { Swords, Shuffle, ArrowRight, Trophy, Zap, X } from 'lucide-react';
import { fetchPokemonDetails, STAT_TRANSLATIONS, STAT_COLORS } from '../services/pokeApi';
import { formatPokedexNumber, getTypeColor, getDefenseEffectiveness } from '../utils/helpers';
import { playSound } from '../services/audioService';

export default function PokemonComparator({ initialPokeA, initialPokeB, allPokemon, onClose }) {
  const [pokeA, setPokeA] = useState(null);
  const [pokeB, setPokeB] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar detalles completos al seleccionar
  const loadPokemon = async (idOrName, target) => {
    try {
      setLoading(true);
      const details = await fetchPokemonDetails(idOrName);
      if (target === 'A') setPokeA(details);
      else setPokeB(details);
      playSound.click();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPokeA) loadPokemon(initialPokeA.id, 'A');
    else if (allPokemon.length > 0) loadPokemon(allPokemon[0].id, 'A');

    if (initialPokeB) loadPokemon(initialPokeB.id, 'B');
    else if (allPokemon.length > 1) loadPokemon(allPokemon[3].id, 'B');
  }, []);

  const handleRandomize = (target) => {
    const randomId = Math.floor(Math.random() * 1025) + 1;
    loadPokemon(randomId, target);
  };

  const bstA = pokeA ? pokeA.stats.reduce((acc, s) => acc + s.value, 0) : 0;
  const bstB = pokeB ? pokeB.stats.reduce((acc, s) => acc + s.value, 0) : 0;

  // Comparativa de tipos: cuánto daño hace A a B y viceversa
  const effDefA = pokeA ? getDefenseEffectiveness(pokeA.types) : {};
  const effDefB = pokeB ? getDefenseEffectiveness(pokeB.types) : {};

  // Máximo multiplicador que A puede hacer a B
  let maxDmgAtoB = 1;
  pokeA?.types.forEach(t => {
    const mult = effDefB[t.name] ?? 1;
    if (mult > maxDmgAtoB) maxDmgAtoB = mult;
  });

  // Máximo multiplicador que B puede hacer a A
  let maxDmgBtoA = 1;
  pokeB?.types.forEach(t => {
    const mult = effDefA[t.name] ?? 1;
    if (mult > maxDmgBtoA) maxDmgBtoA = mult;
  });

  return (
    <div className="p-4 max-w-5xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white/[.03] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-red-500 flex items-center justify-center text-white shadow-lg">
            <Swords className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Comparador Pokémon</h2>
            <p className="text-xs text-white/40">Compara estadísticas, tipos y ventajas frente a frente.</p>
          </div>
        </div>

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

      {/* Grid de Combatientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Pokémon A */}
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">Combatiente 1</span>
            <button
              onClick={() => handleRandomize('A')}
              className="flex items-center gap-1 text-[11px] font-bold text-white/40 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg transition-all"
            >
              <Shuffle className="w-3 h-3" /> Azar
            </button>
          </div>

          {pokeA ? (
            <div className="flex items-center gap-4">
              <img
                src={pokeA.sprites.artwork}
                alt={pokeA.name}
                className="w-28 h-28 object-contain drop-shadow-xl animate-float"
              />
              <div>
                <span className="text-xs font-mono text-white/30">{formatPokedexNumber(pokeA.id)}</span>
                <h3 className="text-2xl font-black text-white capitalize">{pokeA.name}</h3>
                <div className="flex gap-1.5 mt-1.5">
                  {pokeA.types.map(t => (
                    <span key={t.name} className={`type-${t.name} px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white`}>
                      {t.nameEs}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-mono font-bold text-cyan-400 mt-2">
                  BST Total: {bstA}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center text-white/20">Cargando...</div>
          )}
        </div>

        {/* Pokémon B */}
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Combatiente 2</span>
            <button
              onClick={() => handleRandomize('B')}
              className="flex items-center gap-1 text-[11px] font-bold text-white/40 hover:text-white bg-white/5 px-2.5 py-1 rounded-lg transition-all"
            >
              <Shuffle className="w-3 h-3" /> Azar
            </button>
          </div>

          {pokeB ? (
            <div className="flex items-center gap-4">
              <img
                src={pokeB.sprites.artwork}
                alt={pokeB.name}
                className="w-28 h-28 object-contain drop-shadow-xl animate-float"
              />
              <div>
                <span className="text-xs font-mono text-white/30">{formatPokedexNumber(pokeB.id)}</span>
                <h3 className="text-2xl font-black text-white capitalize">{pokeB.name}</h3>
                <div className="flex gap-1.5 mt-1.5">
                  {pokeB.types.map(t => (
                    <span key={t.name} className={`type-${t.name} px-2.5 py-0.5 rounded-md text-[10px] font-bold text-white`}>
                      {t.nameEs}
                    </span>
                  ))}
                </div>
                <p className="text-xs font-mono font-bold text-rose-400 mt-2">
                  BST Total: {bstB}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-28 flex items-center justify-center text-white/20">Cargando...</div>
          )}
        </div>
      </div>

      {/* Ventaja de Tipos */}
      {pokeA && pokeB && (
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4 mb-6">
          <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Efectividad Elemental</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-white/[.02] p-3 rounded-xl">
              <p className="text-white/80">
                <strong className="capitalize text-cyan-400">{pokeA.name}</strong> ataca a <strong className="capitalize">{pokeB.name}</strong>:
              </p>
              <p className="mt-1 font-mono font-bold">
                {maxDmgAtoB > 1 ? (
                  <span className="text-emerald-400">¡Súper eficaz! ({maxDmgAtoB}x de daño)</span>
                ) : maxDmgAtoB === 0 ? (
                  <span className="text-red-400">Sin efecto (0x)</span>
                ) : maxDmgAtoB < 1 ? (
                  <span className="text-amber-400">No muy eficaz ({maxDmgAtoB}x)</span>
                ) : (
                  <span className="text-white/50">Daño normal (1x)</span>
                )}
              </p>
            </div>

            <div className="bg-white/[.02] p-3 rounded-xl">
              <p className="text-white/80">
                <strong className="capitalize text-rose-400">{pokeB.name}</strong> ataca a <strong className="capitalize">{pokeA.name}</strong>:
              </p>
              <p className="mt-1 font-mono font-bold">
                {maxDmgBtoA > 1 ? (
                  <span className="text-emerald-400">¡Súper eficaz! ({maxDmgBtoA}x de daño)</span>
                ) : maxDmgBtoA === 0 ? (
                  <span className="text-red-400">Sin efecto (0x)</span>
                ) : maxDmgBtoA < 1 ? (
                  <span className="text-amber-400">No muy eficaz ({maxDmgBtoA}x)</span>
                ) : (
                  <span className="text-white/50">Daño normal (1x)</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Comparativa de Estadísticas Base */}
      {pokeA && pokeB && (
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-xs font-bold text-white/50 uppercase tracking-wider">
              Comparativa de Estadísticas
            </h4>
            <div className="flex items-center gap-2 text-xs font-mono">
              {bstA > bstB ? (
                <span className="text-cyan-400 font-bold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Ganador en BST: {pokeA.name}
                </span>
              ) : bstB > bstA ? (
                <span className="text-rose-400 font-bold flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Ganador en BST: {pokeB.name}
                </span>
              ) : (
                <span className="text-white/50">Empate en BST</span>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {pokeA.stats.map((statA, i) => {
              const statB = pokeB.stats[i] || { value: 0 };
              const isWinA = statA.value > statB.value;
              const isWinB = statB.value > statA.value;

              return (
                <div key={statA.name} className="bg-white/[.02] p-3 rounded-xl">
                  <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                    <span className={isWinA ? 'text-cyan-400 font-extrabold' : 'text-white/60'}>
                      {statA.value} {isWinA && '👑'}
                    </span>
                    <span className="text-white/40 uppercase tracking-wider font-mono">
                      {statA.nameEs}
                    </span>
                    <span className={isWinB ? 'text-rose-400 font-extrabold' : 'text-white/60'}>
                      {isWinB && '👑'} {statB.value}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {/* Barra A (inversa) */}
                    <div className="h-2 bg-white/[.04] rounded-full overflow-hidden flex justify-end">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((statA.value / 255) * 100, 100)}%`,
                          background: isWinA ? '#22d3ee' : '#64748b',
                        }}
                      />
                    </div>

                    {/* Barra B */}
                    <div className="h-2 bg-white/[.04] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${Math.min((statB.value / 255) * 100, 100)}%`,
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
