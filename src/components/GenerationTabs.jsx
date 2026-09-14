import { GENERATIONS } from '../services/pokeApi';
import { playSound } from '../services/audioService';

export default function GenerationTabs({ selectedGen, onSelectGen }) {
  const handleClick = (gen) => {
    playSound.genSwitch();
    onSelectGen(gen);
  };

  return (
    <div className="px-4 pt-2 pb-1 border-b border-white/5">
      <div className="flex items-center gap-1.5 overflow-x-auto hide-scrollbar pb-1">
        {GENERATIONS.map(gen => {
          const isSelected = selectedGen.id === gen.id;
          return (
            <button
              key={gen.id}
              onClick={() => handleClick(gen)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isSelected
                  ? 'bg-white text-slate-900 shadow-lg scale-105'
                  : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70'
              }`}
            >
              <span>{gen.label}</span>
              <span className={`text-[10px] font-normal ${isSelected ? 'text-slate-600' : 'text-white/20'}`}>
                {gen.region}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
