import { useState, useEffect } from 'react';
import { HelpCircle, RefreshCw, Trophy, Flame, CheckCircle, XCircle } from 'lucide-react';
import { fetchPokemonDetails } from '../services/pokeApi';
import { playSound } from '../services/audioService';

export default function WhosThatPokemon({ allPokemon = [], masterList = [] }) {
  const [currentPokemon, setCurrentPokemon] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  // Cargar una nueva ronda
  const loadNewRound = async () => {
    try {
      setLoading(true);
      setIsRevealed(false);
      setSelectedOption(null);

      // Elegir ID aleatorio entre 1 y 1025
      const targetId = Math.floor(Math.random() * 1025) + 1;
      const targetDetails = await fetchPokemonDetails(targetId);

      // Buscar el nombre en español si existe o el default
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${targetId}`).then(r => r.json()).catch(() => null);
      const nameEs = speciesRes?.names?.find(n => n.language.name === 'es')?.name || targetDetails.name;

      const targetObj = {
        id: targetDetails.id,
        name: targetDetails.name,
        nameEs: nameEs,
        sprite: targetDetails.sprites.artwork || targetDetails.sprites.front,
      };

      // Generar 3 distractores
      const distractorOptions = [];
      while (distractorOptions.length < 3) {
        const randId = Math.floor(Math.random() * 1025) + 1;
        if (randId !== targetId && !distractorOptions.some(d => d.id === randId)) {
          const item = masterList.find(m => m.id === randId) || { id: randId, name: `pokemon-${randId}` };
          distractorOptions.push({ id: randId, nameEs: item.name });
        }
      }

      // Mezclar opciones
      const allOpts = [...distractorOptions, { id: targetObj.id, nameEs: targetObj.nameEs }].sort(() => Math.random() - 0.5);

      setCurrentPokemon(targetObj);
      setOptions(allOpts);
    } catch (err) {
      console.error('Error en mini-juego:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNewRound();
  }, []);

  const handleGuess = (option) => {
    if (isRevealed) return;

    setSelectedOption(option);
    setIsRevealed(true);

    const isCorrect = option.id === currentPokemon.id;

    if (isCorrect) {
      playSound.fanfare();
      setScore(prev => prev + 100);
      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
    } else {
      playSound.remove();
      setStreak(0);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto animate-fade-in-up">
      {/* Marcador Superior */}
      <div className="flex items-center justify-between gap-3 mb-6 bg-white/[.03] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-yellow-500 flex items-center justify-center text-white shadow-lg">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">¿Quién es ese Pokémon?</h2>
            <p className="text-xs text-white/40">¡Adivina la silueta y acumula tu racha de victorias!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono font-bold">
          <div className="flex items-center gap-1 text-amber-400">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Racha: {streak}</span>
          </div>
          <div className="flex items-center gap-1 text-yellow-300">
            <Trophy className="w-4 h-4" />
            <span>Mejor: {bestStreak}</span>
          </div>
        </div>
      </div>

      {/* Tarjeta de Silueta y Pregunta */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 border border-white/10 p-8 flex flex-col items-center shadow-2xl mb-6">
        {/* Banner retro estilo anime */}
        <div className="absolute top-3 left-3 bg-red-600/80 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow">
          Trivia Pokémon 8-Bit
        </div>

        <div className="relative w-56 h-56 flex items-center justify-center my-4">
          {loading ? (
            <div className="w-48 h-48 skeleton rounded-full" />
          ) : (
            <img
              src={currentPokemon?.sprite}
              alt="Silueta"
              className={`w-52 h-52 object-contain transition-all duration-700 ${
                isRevealed
                  ? 'brightness-100 drop-shadow-2xl animate-bounce-in'
                  : 'brightness-0 invert-0 contrast-200 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]'
              }`}
            />
          )}
        </div>

        {/* Revelación del Nombre */}
        {isRevealed && (
          <div className="animate-fade-in-up text-center mb-2">
            <p className="text-2xl font-black text-white capitalize">
              ¡Es <span className="text-yellow-400">{currentPokemon?.nameEs || currentPokemon?.name}</span>!
            </p>
          </div>
        )}

        {/* Opciones de Respuesta */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full mt-4">
          {options.map((opt) => {
            let btnStyle = 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:border-white/20';

            if (isRevealed) {
              if (opt.id === currentPokemon.id) {
                btnStyle = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 font-bold scale-[1.02] shadow-lg shadow-emerald-500/20';
              } else if (selectedOption?.id === opt.id) {
                btnStyle = 'bg-red-500/20 border-red-500/50 text-red-300 font-bold';
              } else {
                btnStyle = 'bg-white/[.02] border-white/5 text-white/20 opacity-50';
              }
            }

            return (
              <button
                key={opt.id}
                onClick={() => handleGuess(opt)}
                disabled={isRevealed || loading}
                className={`flex items-center justify-between px-5 py-3 rounded-2xl border text-sm font-semibold capitalize transition-all duration-300 ${btnStyle}`}
              >
                <span>{opt.nameEs}</span>
                {isRevealed && opt.id === currentPokemon.id && (
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                {isRevealed && selectedOption?.id === opt.id && opt.id !== currentPokemon.id && (
                  <XCircle className="w-4 h-4 text-red-400" />
                )}
              </button>
            );
          })}
        </div>

        {/* Botón Siguiente Ronda */}
        {isRevealed && (
          <div className="mt-6 animate-fade-in-up">
            <button
              onClick={() => {
                playSound.click();
                loadNewRound();
              }}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-red-500 to-yellow-500 text-slate-900 font-extrabold rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            >
              <RefreshCw className="w-4 h-4" />
              Siguiente Pokémon
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
