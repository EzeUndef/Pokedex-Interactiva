import { Volume2, VolumeX, Music, BookOpen, Users, Swords } from 'lucide-react';
import { isSfxEnabled, setSfxEnabled, toggleBgm, isBgmPlaying, playSound } from '../services/audioService';
import { useState } from 'react';

/**
 * PokedexFrame – chasis de la Pokédex con LEDs, bisagra y controles retro.
 */
export default function PokedexFrame({ children, version, currentView, onSelectView, teamCount }) {
  const [sfx, setSfx] = useState(isSfxEnabled());
  const [bgm, setBgm] = useState(isBgmPlaying());

  const handleToggleSfx = () => {
    const next = !sfx;
    setSfxEnabled(next);
    setSfx(next);
    if (next) playSound.click();
  };

  const handleToggleBgm = () => {
    const next = toggleBgm();
    setBgm(next);
    if (sfx) playSound.click();
  };

  const handleNav = (view) => {
    playSound.select();
    onSelectView(view);
  };

  return (
    <div className={`min-h-screen ${version.css}`}>
      {/* Top device bezel */}
      <div
        className="sticky top-0 z-50 px-4 py-2.5 flex items-center justify-between gap-3 shadow-md"
        style={{ background: 'var(--dex-primary)' }}
      >
        {/* Main LED and indicators */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-cyan-300 border-[3px] border-white/40 shadow-[0_0_15px_rgba(103,232,249,0.8)] animate-blink" />
            <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-white/70" />
          </div>
          <div className="flex gap-1.5">
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: '#ef4444', '--led-color': '#ef4444', animation: 'pulse-led 2s infinite' }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: '#facc15', '--led-color': '#facc15', animation: 'pulse-led 2s infinite 0.5s' }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ background: '#22c55e', '--led-color': '#22c55e', animation: 'pulse-led 2s infinite 1s' }}
            />
          </div>
        </div>

        {/* Center navigation tabs (Pokédex, Equipo, Comparador) */}
        <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl">
          <button
            onClick={() => handleNav('pokedex')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentView === 'pokedex'
                ? 'bg-white text-slate-900 shadow'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pokédex</span>
          </button>

          <button
            onClick={() => handleNav('team')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentView === 'team'
                ? 'bg-white text-slate-900 shadow'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Mi Equipo</span>
            <span className="px-1.5 py-[1px] rounded-full text-[9px] font-mono bg-red-500 text-white">
              {teamCount}
            </span>
          </button>

          <button
            onClick={() => handleNav('compare')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              currentView === 'compare'
                ? 'bg-white text-slate-900 shadow'
                : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            <Swords className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Comparador</span>
          </button>
        </div>

        {/* Audio controls (SFX + Chiptune BGM) */}
        <div className="flex items-center gap-1.5">
          {/* Chiptune Music Button */}
          <button
            onClick={handleToggleBgm}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
              bgm
                ? 'bg-amber-400 text-slate-900 shadow-md animate-pulse'
                : 'bg-black/30 text-white/70 hover:text-white'
            }`}
            title="Música Chiptune 8-bit"
          >
            <Music className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px]">Música</span>
          </button>

          {/* Sound FX Button */}
          <button
            onClick={handleToggleSfx}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
              sfx ? 'bg-black/30 text-white hover:bg-black/40' : 'bg-black/50 text-white/40'
            }`}
            title="Efectos de sonido"
          >
            {sfx ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Hinge line */}
      <div className="h-1.5" style={{ background: 'var(--dex-hinge)' }} />

      {/* Screen area */}
      <div
        className="min-h-[calc(100vh-56px)]"
        style={{ background: 'var(--dex-screen-bg)' }}
      >
        {children}
      </div>

      {/* Bottom bezel */}
      <div className="h-3" style={{ background: 'var(--dex-primary)' }} />
    </div>
  );
}
