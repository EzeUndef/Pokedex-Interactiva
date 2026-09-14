import { useState, useEffect, useMemo } from 'react';
import { Skull, Plus, Trash2, Heart, Shield, Award, CheckSquare, Square, Search, X, MapPin } from 'lucide-react';
import { playSound } from '../services/audioService';

const GAME_PRESETS = [
  {
    id: 'firered',
    name: 'Rojo Fuego / Verde Hoja',
    gymCaps: [
      { name: 'Gimnasio 1: Brock', cap: 14 },
      { name: 'Gimnasio 2: Misty', cap: 21 },
      { name: 'Gimnasio 3: Lt. Surge', cap: 24 },
      { name: 'Gimnasio 4: Erika', cap: 29 },
      { name: 'Gimnasio 5: Koga', cap: 43 },
      { name: 'Gimnasio 6: Sabrina', cap: 43 },
      { name: 'Gimnasio 7: Blaine', cap: 47 },
      { name: 'Gimnasio 8: Giovanni', cap: 50 },
      { name: 'Alto Mando: Lance / Campeón', cap: 63 },
    ],
  },
  {
    id: 'emerald',
    name: 'Esmeralda',
    gymCaps: [
      { name: 'Gimnasio 1: Roxanne', cap: 15 },
      { name: 'Gimnasio 2: Brawly', cap: 19 },
      { name: 'Gimnasio 3: Wattson', cap: 24 },
      { name: 'Gimnasio 4: Flannery', cap: 29 },
      { name: 'Gimnasio 5: Norman', cap: 31 },
      { name: 'Gimnasio 6: Winona', cap: 33 },
      { name: 'Gimnasio 7: Tate & Liza', cap: 42 },
      { name: 'Gimnasio 8: Juan', cap: 46 },
      { name: 'Alto Mando: Wallace', cap: 58 },
    ],
  },
  {
    id: 'platinum',
    name: 'Platino',
    gymCaps: [
      { name: 'Gimnasio 1: Roark', cap: 14 },
      { name: 'Gimnasio 2: Gardenia', cap: 22 },
      { name: 'Gimnasio 3: Fantina', cap: 26 },
      { name: 'Gimnasio 4: Maylene', cap: 32 },
      { name: 'Gimnasio 5: Crasher Wake', cap: 37 },
      { name: 'Gimnasio 6: Byron', cap: 41 },
      { name: 'Gimnasio 7: Candice', cap: 44 },
      { name: 'Gimnasio 8: Volkner', cap: 50 },
      { name: 'Alto Mando: Cynthia', cap: 62 },
    ],
  },
  {
    id: 'custom',
    name: 'Juego Personalizado',
    gymCaps: [],
  },
];

const STANDARD_RULES = [
  'Solo puedes capturar el primer Pokémon que encuentres en cada ruta.',
  'Si un Pokémon se debilita, se considera muerto y debes ponerlo en la caja cementerio o liberarlo.',
  'Debes ponerle mote a cada Pokémon para crear un vínculo afectivo.',
  'Cláusula de duplicados (Dupes Clause): Puedes ignorar Pokémon de especies que ya hayas capturado.',
  'Cláusula de Shiny: Si aparece un Pokémon variocolor, puedes capturarlo sin importar la regla de la ruta.',
  'Límite de Nivel (Level Cap): El nivel máximo de tu equipo no debe superar al del líder de gimnasio activo.',
];

const NUZLOCKE_KEY = 'pokedex_nuzlocke_tracker';

export default function NuzlockeTracker({ masterList = [], onClose }) {
  const [selectedGame, setSelectedGame] = useState(GAME_PRESETS[0]);
  const [encounters, setEncounters] = useState([]);
  const [checkedRules, setCheckedRules] = useState([0, 1, 2]);

  // Formulario para nuevo encuentro
  const [newRoute, setNewRoute] = useState('');
  const [newPokeName, setNewPokeName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newStatus, setNewStatus] = useState('alive'); // 'alive' | 'dead' | 'boxed' | 'failed'
  const [newDeathCause, setNewDeathCause] = useState('');

  // Auto-complete para nuevo encuentro
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPokeObj, setSelectedPokeObj] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Cargar estado guardado
  useEffect(() => {
    try {
      const raw = localStorage.getItem(NUZLOCKE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.gameId) {
          const game = GAME_PRESETS.find(g => g.id === parsed.gameId) || GAME_PRESETS[0];
          setSelectedGame(game);
        }
        if (parsed.encounters) setEncounters(parsed.encounters);
        if (parsed.rules) setCheckedRules(parsed.rules);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Guardar estado
  const saveTrackerState = (game, encList, rulesList) => {
    const data = {
      gameId: game.id,
      encounters: encList,
      rules: rulesList,
    };
    localStorage.setItem(NUZLOCKE_KEY, JSON.stringify(data));
  };

  const matches = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const term = searchQuery.toLowerCase().trim();
    return masterList.filter(p => p.name.toLowerCase().includes(term) || String(p.id) === term).slice(0, 6);
  }, [searchQuery, masterList]);

  const handleAddEncounter = (e) => {
    e.preventDefault();
    if (!newRoute.trim()) return;

    const newEnc = {
      id: Date.now(),
      route: newRoute.trim(),
      pokeId: selectedPokeObj?.id || 1,
      pokeName: selectedPokeObj?.name || newPokeName.trim() || 'Desconocido',
      nickname: newNickname.trim() || selectedPokeObj?.name || 'Mote',
      status: newStatus,
      deathCause: newDeathCause.trim(),
      sprite: selectedPokeObj ? `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selectedPokeObj.id}.png` : '',
    };

    const nextList = [newEnc, ...encounters];
    setEncounters(nextList);
    saveTrackerState(selectedGame, nextList, checkedRules);

    playSound.add();

    // Reset form
    setNewRoute('');
    setNewPokeName('');
    setNewNickname('');
    setSearchQuery('');
    setSelectedPokeObj(null);
    setNewStatus('alive');
    setNewDeathCause('');
  };

  const handleDeleteEncounter = (id) => {
    playSound.remove();
    const nextList = encounters.filter(e => e.id !== id);
    setEncounters(nextList);
    saveTrackerState(selectedGame, nextList, checkedRules);
  };

  const handleStatusChange = (id, status) => {
    playSound.click();
    const nextList = encounters.map(e => e.id === id ? { ...e, status } : e);
    setEncounters(nextList);
    saveTrackerState(selectedGame, nextList, checkedRules);
  };

  const toggleRule = (idx) => {
    playSound.click();
    const nextRules = checkedRules.includes(idx)
      ? checkedRules.filter(r => r !== idx)
      : [...checkedRules, idx];
    setCheckedRules(nextRules);
    saveTrackerState(selectedGame, encounters, nextRules);
  };

  const aliveList = encounters.filter(e => e.status === 'alive');
  const deadList = encounters.filter(e => e.status === 'dead');

  return (
    <div className="p-4 max-w-6xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 bg-white/[.03] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 flex items-center justify-center text-white shadow-lg">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Nuzlocke Tracker</h2>
            <p className="text-xs text-white/40">Gestiona tus rutas, límites de nivel y el cementerio de tu partida Nuzlocke.</p>
          </div>
        </div>

        {/* Seleccionar Juego */}
        <div className="flex items-center gap-2">
          <select
            value={selectedGame.id}
            onChange={e => {
              const game = GAME_PRESETS.find(g => g.id === e.target.value) || GAME_PRESETS[0];
              setSelectedGame(game);
              saveTrackerState(game, encounters, checkedRules);
            }}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-bold cursor-pointer"
          >
            {GAME_PRESETS.map(g => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </select>

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

      {/* Nivel Caps de Líderes de Gimnasio */}
      {selectedGame.gymCaps.length > 0 && (
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4 mb-6">
          <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Límites de Nivel (Gym Caps) — {selectedGame.name}
          </h3>
          <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
            {selectedGame.gymCaps.map((gym, idx) => (
              <div key={idx} className="shrink-0 bg-white/[.02] border border-white/5 px-3 py-1.5 rounded-xl text-center">
                <p className="text-[10px] text-white/40 font-semibold">{gym.name}</p>
                <p className="text-xs font-mono font-bold text-amber-300 mt-0.5">Nv. {gym.cap}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reglas Nuzlocke Activas */}
      <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4 mb-6">
        <h3 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Reglas de la Partida</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {STANDARD_RULES.map((rule, idx) => {
            const isChecked = checkedRules.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleRule(idx)}
                className={`flex items-start gap-2 p-2 rounded-xl text-left text-xs transition-all ${
                  isChecked ? 'bg-white/10 text-white font-medium' : 'bg-white/[.02] text-white/30 hover:bg-white/5'
                }`}
              >
                {isChecked ? <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" /> : <Square className="w-4 h-4 text-white/20 shrink-0 mt-0.5" />}
                <span>{rule}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Añadir Nuevo Encuentro en Ruta */}
      <form onSubmit={handleAddEncounter} className="bg-white/[.03] border border-white/5 rounded-2xl p-4 mb-6">
        <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Registrar Encuentro en Nueva Ruta
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Ruta */}
          <input
            type="text"
            required
            value={newRoute}
            onChange={e => setNewRoute(e.target.value)}
            placeholder="Nombre de la Ruta / Zona (ej. Ruta 1)"
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30"
          />

          {/* Buscador de Pokémon */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Buscar Pokémon capturado..."
              className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30"
            />
            {showDropdown && matches.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden max-h-40 overflow-y-auto">
                {matches.map(m => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      setSelectedPokeObj(m);
                      setSearchQuery(m.name);
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-1.5 text-xs text-white/80 hover:bg-white/10 capitalize flex justify-between"
                  >
                    <span>{m.name}</span>
                    <span className="text-[10px] text-white/30">#{m.id}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Mote */}
          <input
            type="text"
            value={newNickname}
            onChange={e => setNewNickname(e.target.value)}
            placeholder="Mote del Pokémon"
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/30"
          />

          {/* Estado */}
          <select
            value={newStatus}
            onChange={e => setNewStatus(e.target.value)}
            className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-bold"
          >
            <option value="alive">Vivo / En equipo</option>
            <option value="boxed">En la caja PC</option>
            <option value="dead">Debilitado (Muerto)</option>
            <option value="failed">Huyó / Fallido</option>
          </select>
        </div>

        <button
          type="submit"
          className="mt-3 flex items-center justify-center gap-1.5 w-full sm:w-auto px-6 py-2 bg-cyan-500 text-slate-900 font-extrabold rounded-xl text-xs hover:scale-105 transition-all"
        >
          <Plus className="w-4 h-4" /> Registrar Encuentro
        </button>
      </form>

      {/* Cementerio y Lista de Encuentros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Vivos / En Equipo */}
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Heart className="w-4 h-4 text-emerald-400" /> Vivos / En Equipo ({aliveList.length})
          </h3>

          {!aliveList.length ? (
            <p className="text-xs text-white/30 text-center py-6">No hay encuentros registrados aún.</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {aliveList.map(enc => (
                <div key={enc.id} className="flex items-center justify-between p-3 bg-white/[.02] border border-white/5 rounded-xl">
                  <div className="flex items-center gap-3">
                    {enc.sprite ? (
                      <img src={enc.sprite} alt={enc.nickname} className="w-10 h-10 object-contain" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/30">
                        PK
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-extrabold text-white capitalize">{enc.nickname}</p>
                      <p className="text-[10px] text-white/40 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-cyan-400" /> {enc.route} ({enc.pokeName})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStatusChange(enc.id, 'dead')}
                      className="px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg text-[10px] font-bold"
                      title="Marcar como muerto"
                    >
                      ☠️ Muerto
                    </button>
                    <button
                      onClick={() => handleDeleteEncounter(enc.id)}
                      className="p-1.5 text-white/20 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cementerio 🪦 */}
        <div className="bg-white/[.03] border border-white/5 rounded-2xl p-4">
          <h3 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Skull className="w-4 h-4 text-red-400" /> Cementerio 🪦 ({deadList.length})
          </h3>

          {!deadList.length ? (
            <p className="text-xs text-white/30 text-center py-6">¡Ningún Pokémon ha caído todavía!</p>
          ) : (
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {deadList.map(enc => (
                <div key={enc.id} className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    {enc.sprite ? (
                      <img src={enc.sprite} alt={enc.nickname} className="w-10 h-10 object-contain grayscale opacity-60" />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center text-xs font-bold text-red-300">
                        🪦
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-extrabold text-red-300 line-through capitalize">{enc.nickname}</p>
                      <p className="text-[10px] text-white/40">{enc.route} • {enc.pokeName}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteEncounter(enc.id)}
                    className="p-1.5 text-white/20 hover:text-red-400"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
