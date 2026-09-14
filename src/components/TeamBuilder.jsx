import { Trash2, ShieldAlert, ShieldCheck, Zap, Plus, X } from 'lucide-react';
import { formatPokedexNumber, getTypeColor, calculateTeamWeaknesses } from '../utils/helpers';
import { playSound } from '../services/audioService';

export default function TeamBuilder({ team, onRemoveFromTeam, onClearTeam, onSelectPokemon, onClose }) {
  const weaknesses = calculateTeamWeaknesses(team);
  const slots = Array.from({ length: 6 }).map((_, i) => team[i] || null);

  const handleRemove = (id) => {
    playSound.remove();
    onRemoveFromTeam(id);
  };

  const handleClear = () => {
    if (window.confirm('¿Seguro que deseas vaciar tu equipo?')) {
      playSound.remove();
      onClearTeam();
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto animate-fade-in-up">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white/[.03] p-4 rounded-2xl border border-white/5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-extrabold text-white">Mi Equipo Pokémon</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              {team.length} / 6
            </span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">
            Organiza tu alineación de 6 Pokémon y analiza sus fortalezas y debilidades.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {team.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Vaciar
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold text-white/50 bg-white/5 hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
              Volver a Pokédex
            </button>
          )}
        </div>
      </div>

      {/* Slots del Equipo */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
        {slots.map((poke, index) => {
          if (!poke) {
            return (
              <div
                key={index}
                className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-white/10 bg-white/[.01] min-h-[220px]"
              >
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/20 mb-2">
                  <Plus className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-white/20">Ranura {index + 1}</p>
                <p className="text-[10px] text-white/15 text-center mt-1">Añade desde la Pokédex</p>
              </div>
            );
          }

          const mainType = poke.types[0]?.name || 'normal';
          const color = getTypeColor(mainType);

          return (
            <div
              key={poke.id}
              className="relative group overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-3 transition-all duration-300 hover:border-white/20 hover:-translate-y-1"
              style={{ boxShadow: `0 4px 20px ${color}20` }}
            >
              {/* Botón quitar */}
              <button
                onClick={() => handleRemove(poke.id)}
                className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/40 text-white/40 hover:text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-all z-10"
                title="Quitar del equipo"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>

              <span className="text-[10px] font-mono text-white/25">
                {formatPokedexNumber(poke.id)}
              </span>

              <div
                className="cursor-pointer flex flex-col items-center my-2"
                onClick={() => onSelectPokemon(poke)}
              >
                <img
                  src={poke.sprite}
                  alt={poke.name}
                  className="w-24 h-24 object-contain drop-shadow-md group-hover:scale-105 transition-transform"
                />
                <h4 className="text-xs font-bold text-white capitalize mt-1 truncate max-w-full">
                  {poke.name}
                </h4>
              </div>

              <div className="flex justify-center gap-1">
                {poke.types.map(t => (
                  <span
                    key={t.name}
                    className={`type-${t.name} px-2 py-0.5 rounded-md text-[9px] font-bold text-white`}
                  >
                    {t.nameEs}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Análisis de Debilidades y Resistencias del Equipo */}
      {team.length > 0 && (
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
              Análisis de Cobertura y Vulnerabilidades
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
            {Object.entries(weaknesses).map(([typeKey, data]) => {
              const isDanger = data.weak >= 3;
              const isGood = data.resist >= 3;

              return (
                <div
                  key={typeKey}
                  className={`p-2.5 rounded-xl border transition-all ${
                    isDanger
                      ? 'bg-red-500/10 border-red-500/30'
                      : isGood
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : 'bg-white/[.02] border-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`type-${typeKey} px-2 py-[1px] rounded text-[9px] font-bold text-white`}>
                      {data.nameEs}
                    </span>
                    {isDanger && (
                      <span className="text-[9px] font-bold text-red-400">¡Alerta!</span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono mt-1 text-white/50">
                    <span className="text-red-400" title="Pokémon débiles a este tipo">
                      -{data.weak} débiles
                    </span>
                    <span className="text-emerald-400" title="Pokémon resistentes a este tipo">
                      +{data.resist} resist.
                    </span>
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
