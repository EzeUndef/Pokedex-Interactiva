/**
 * Obtiene un gradiente de fondo según el tipo principal del Pokémon.
 */
export function getTypeGradient(typeName) {
  const gradients = {
    normal: 'from-[#919AA2] to-[#6d7680]',
    fire: 'from-[#FF9D55] to-[#e06830]',
    water: 'from-[#5090D6] to-[#3a6db5]',
    electric: 'from-[#F4D23C] to-[#d4b020]',
    grass: 'from-[#63BC5A] to-[#3d9636]',
    ice: 'from-[#73CEC0] to-[#4aafa0]',
    fighting: 'from-[#CE416B] to-[#a02050]',
    poison: 'from-[#B567CE] to-[#8a40a5]',
    ground: 'from-[#D97845] to-[#b55c30]',
    flying: 'from-[#89AAE3] to-[#6088c5]',
    psychic: 'from-[#FA7179] to-[#d04555]',
    bug: 'from-[#91C12F] to-[#6d9418]',
    rock: 'from-[#C5B78C] to-[#a09060]',
    ghost: 'from-[#5269AD] to-[#3a4d8a]',
    dragon: 'from-[#0B6DC3] to-[#074d8a]',
    dark: 'from-[#5A5465] to-[#3d3748]',
    steel: 'from-[#5A8EA2] to-[#3d6d80]',
    fairy: 'from-[#EC8FE6] to-[#c560be]',
  };
  return gradients[typeName] || gradients.normal;
}

/**
 * Obtiene un color de fondo sólido para el tipo.
 */
export function getTypeBgColor(typeName) {
  const colors = {
    normal: '#919AA2',
    fire: '#FF9D55',
    water: '#5090D6',
    electric: '#F4D23C',
    grass: '#63BC5A',
    ice: '#73CEC0',
    fighting: '#CE416B',
    poison: '#B567CE',
    ground: '#D97845',
    flying: '#89AAE3',
    psychic: '#FA7179',
    bug: '#91C12F',
    rock: '#C5B78C',
    ghost: '#5269AD',
    dragon: '#0B6DC3',
    dark: '#5A5465',
    steel: '#5A8EA2',
    fairy: '#EC8FE6',
  };
  return colors[typeName] || colors.normal;
}

/**
 * Capitaliza la primera letra.
 */
export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Formatea el número del Pokédex con ceros a la izquierda.
 */
export function formatPokedexNumber(id) {
  return `#${String(id).padStart(3, '0')}`;
}

/**
 * Traducciones de generaciones.
 */
export const GENERATION_NAMES = {
  'generation-i': { label: 'Gen I', range: [1, 151] },
  'generation-ii': { label: 'Gen II', range: [152, 251] },
  'generation-iii': { label: 'Gen III', range: [252, 386] },
  'generation-iv': { label: 'Gen IV', range: [387, 493] },
  'generation-v': { label: 'Gen V', range: [494, 649] },
  'generation-vi': { label: 'Gen VI', range: [650, 721] },
  'generation-vii': { label: 'Gen VII', range: [722, 809] },
  'generation-viii': { label: 'Gen VIII', range: [810, 905] },
  'generation-ix': { label: 'Gen IX', range: [906, 1025] },
};

/**
 * Obtiene la generación por ID.
 */
export function getGenerationById(id) {
  for (const [key, val] of Object.entries(GENERATION_NAMES)) {
    if (id >= val.range[0] && id <= val.range[1]) return key;
  }
  return null;
}
