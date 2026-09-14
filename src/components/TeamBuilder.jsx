import { useState } from 'react';
import { Trash2, ShieldAlert, Plus, X, Download, Upload, Copy, Check } from 'lucide-react';
import { formatPokedexNumber, getTypeColor, calculateTeamWeaknesses } from '../utils/helpers';
import { playSound } from '../services/audioService';

export default function TeamBuilder({ team, onRemoveFromTeam, onClearTeam, onSelectPokemon, onImportTeam, onClose }) {
  const [showExportModal, setShowExportModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importText, setImportText] = useState('');
  const [copied, setCopied] = useState(false);

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

  // Generar formato Pokémon Showdown
  const generateShowdownExport = () => {
    return team.map(poke => {
      const typeStr = poke.types.map(t => t.nameEs).join('/');
      return `${poke.name} (${poke.types[0]?.nameEs || 'Normal'})
Ability: Synchronize
EVs: 252 Atk / 4 SpD / 252 Spe
Jolly Nature
- Tackle
- Protect`;
    }).join('\n\n');
  };

  const handleCopyShowdown = () => {
    navigator.clipboard.writeText(generateShowdownExport());
    setCopied(true);
    playSound.click();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportShowdown = () => {
    if (!importText.trim()) return;
    // Extraer nombres de las primeras líneas de bloques
    const blocks = importText.split(/\n\n+/);
    const importedNames = blocks.map(b => {
      const firstLine = b.trim().split('\n')[0];
      const name = firstLine.split('(')[0].trim().toLowerCase();
      return name;
    }).filter(Boolean);

    if (onImportTeam) {
      onImportTeam(importedNames);
      playSound.fanfare();
      setShowImportModal(false);
      setImportText('');
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

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {team.length > 0 && (
            <button
              onClick={() => {
                playSound.click();
                setShowExportModal(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Exportar Showdown
            </button>
          )}

          <button
            onClick={() => {
              playSound.click();
              setShowImportModal(true);
            }}
            aria-label="Importar Showdown"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            Importar Showdown
          </button>

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
              Volver
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

      {/* Análisis de Debilidades y Resistencias */}
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

      {/* Modal Exportar Showdown */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" /> Exportar a Pokémon Showdown
              </h3>
              <button onClick={() => setShowExportModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <textarea
              readOnly
              rows={8}
              value={generateShowdownExport()}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs font-mono text-cyan-300 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCopyShowdown}
                className="flex items-center gap-1.5 px-4 py-2 bg-cyan-500 text-slate-900 font-bold rounded-xl text-xs"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? '¡Copiado!' : 'Copiar al Portapapeles'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Importar Showdown */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-amber-400" /> Importar desde Pokémon Showdown
              </h3>
              <button onClick={() => setShowImportModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-white/50 mb-3">Pega la plantilla de equipo de Pokémon Showdown:</p>
            <textarea
              rows={8}
              value={importText}
              onChange={e => setImportText(e.target.value)}
              placeholder={`Pikachu\nAbility: Static\nJolly Nature\n\nCharizard\nAbility: Blaze\nTimmi Nature`}
              className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-xs font-mono text-white placeholder-white/20 focus:outline-none mb-4"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleImportShowdown}
                className="flex items-center gap-1.5 px-4 py-2 bg-amber-400 text-slate-900 font-bold rounded-xl text-xs"
              >
                <Upload className="w-4 h-4" /> Cargar Equipo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
