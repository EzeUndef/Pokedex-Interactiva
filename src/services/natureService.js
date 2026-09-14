// Base de datos de las 25 naturalezas de Pokémon y cálculos competitivos oficiales

export const NATURES = [
  { id: 'hardy', nameEs: 'Fuerte', increased: null, decreased: null, desc: 'Neutra' },
  { id: 'lonely', nameEs: 'Huraña', increased: 'attack', decreased: 'defense', desc: '+Ataque, -Defensa' },
  { id: 'brave', nameEs: 'Audaz', increased: 'attack', decreased: 'speed', desc: '+Ataque, -Velocidad' },
  { id: 'adamant', nameEs: 'Firme', increased: 'attack', decreased: 'special-attack', desc: '+Ataque, -At. Especial' },
  { id: 'naughty', nameEs: 'Pícara', increased: 'attack', decreased: 'special-defense', desc: '+Ataque, -Def. Especial' },

  { id: 'bold', nameEs: 'Osada', increased: 'defense', decreased: 'attack', desc: '+Defensa, -Ataque' },
  { id: 'docile', nameEs: 'Dócil', increased: null, decreased: null, desc: 'Neutra' },
  { id: 'relaxed', nameEs: 'Plácida', increased: 'defense', decreased: 'speed', desc: '+Defensa, -Velocidad' },
  { id: 'impish', nameEs: 'Agitada', increased: 'defense', decreased: 'special-attack', desc: '+Defensa, -At. Especial' },
  { id: 'lax', nameEs: 'Floja', increased: 'defense', decreased: 'special-defense', desc: '+Defensa, -Def. Especial' },

  { id: 'timid', nameEs: 'Miedosa', increased: 'speed', decreased: 'attack', desc: '+Velocidad, -Ataque' },
  { id: 'hasty', nameEs: 'Activa', increased: 'speed', decreased: 'defense', desc: '+Velocidad, -Defensa' },
  { id: 'serious', nameEs: 'Seria', increased: null, decreased: null, desc: 'Neutra' },
  { id: 'jolly', nameEs: 'Alegre', increased: 'speed', decreased: 'special-attack', desc: '+Velocidad, -At. Especial' },
  { id: 'naive', nameEs: 'Ingenua', increased: 'speed', decreased: 'special-defense', desc: '+Velocidad, -Def. Especial' },

  { id: 'modest', nameEs: 'Modesta', increased: 'special-attack', decreased: 'attack', desc: '+At. Especial, -Ataque' },
  { id: 'mild', nameEs: 'Afable', increased: 'special-attack', decreased: 'defense', desc: '+At. Especial, -Defensa' },
  { id: 'quiet', nameEs: 'Mansa', increased: 'special-attack', decreased: 'speed', desc: '+At. Especial, -Velocidad' },
  { id: 'bashful', nameEs: 'Tímida', increased: null, decreased: null, desc: 'Neutra' },
  { id: 'rash', nameEs: 'Alocada', increased: 'special-attack', decreased: 'special-defense', desc: '+At. Especial, -Def. Especial' },

  { id: 'calm', nameEs: 'Serena', increased: 'special-defense', decreased: 'attack', desc: '+Def. Especial, -Ataque' },
  { id: 'gentle', nameEs: 'Amable', increased: 'special-defense', decreased: 'defense', desc: '+Def. Especial, -Defensa' },
  { id: 'sassy', nameEs: 'Grosera', increased: 'special-defense', decreased: 'speed', desc: '+Def. Especial, -Velocidad' },
  { id: 'careful', nameEs: 'Cauta', increased: 'special-defense', decreased: 'special-attack', desc: '+Def. Especial, -At. Especial' },
  { id: 'quirky', nameEs: 'Rara', increased: null, decreased: null, desc: 'Neutra' },
];

/**
 * Calcula el valor real de una estadística según el nivel, naturaleza e IVs/EVs estándar (31 IVs, 0 EVs o 252).
 */
export function calculateRealStat(baseStat, statName, level = 50, nature = NATURES[0], iv = 31, ev = 0) {
  if (statName === 'hp') {
    if (baseStat === 1) return 1; // Shedinja
    return Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + level + 10;
  }

  const raw = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level) / 100) + 5;
  let natureMod = 1.0;

  if (nature && nature.increased === statName && nature.decreased !== statName) {
    natureMod = 1.1;
  } else if (nature && nature.decreased === statName && nature.increased !== statName) {
    natureMod = 0.9;
  }

  return Math.floor(raw * natureMod);
}

/**
 * Obtiene el multiplicador que la naturaleza aplica a una estadística específica.
 */
export function getNatureStatEffect(nature, statName) {
  if (!nature) return 0;
  if (nature.increased === statName && nature.decreased !== statName) return 1; // +10%
  if (nature.decreased === statName && nature.increased !== statName) return -1; // -10%
  return 0; // Neutro
}
