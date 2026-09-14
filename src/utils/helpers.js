import { TYPE_COLORS, TYPE_CHART, TYPE_TRANSLATIONS } from '../services/pokeApi';

export function formatPokedexNumber(id) {
  return `#${String(id).padStart(4, '0')}`;
}

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getTypeColor(typeName) {
  return TYPE_COLORS[typeName] || '#919AA2';
}

/* Traducción de hábitats */
const HABITAT_ES = {
  cave:'Cueva',forest:'Bosque',grassland:'Pradera',mountain:'Montaña',
  rare:'Raro',rough_terrain:'Terreno difícil',sea:'Mar',urban:'Urbano',
  waters_edge:'Orilla del agua',
};
export function translateHabitat(h) {
  return HABITAT_ES[h] || h || 'Desconocido';
}

/* Traducción de versiones de juego */
const VERSION_ES = {
  red:'Rojo',blue:'Azul',yellow:'Amarillo',gold:'Oro',silver:'Plata',crystal:'Cristal',
  ruby:'Rubí',sapphire:'Zafiro',emerald:'Esmeralda',
  'firered':'Rojo Fuego','leafgreen':'Verde Hoja',
  diamond:'Diamante',pearl:'Perla',platinum:'Platino',
  'heartgold':'Oro HeartGold','soulsilver':'Plata SoulSilver',
  black:'Negro',white:'Blanco','black-2':'Negro 2','white-2':'Blanco 2',
  x:'X',y:'Y','omega-ruby':'Rubí Omega','alpha-sapphire':'Zafiro Alfa',
  sun:'Sol',moon:'Luna','ultra-sun':'Ultrasol','ultra-moon':'Ultraluna',
  'lets-go-pikachu':'Let\'s Go Pikachu','lets-go-eevee':'Let\'s Go Eevee',
  sword:'Espada',shield:'Escudo',
  'brilliant-diamond':'Diamante Brillante','shining-pearl':'Perla Reluciente',
  'legends-arceus':'Leyendas Arceus',
  scarlet:'Escarlata',violet:'Púrpura',
};
export function translateVersion(v) {
  return VERSION_ES[v] || capitalize(v.replace(/-/g, ' '));
}

/* Favoritos en localStorage */
const FAV_KEY = 'pokedex_favorites';
export function loadFavorites() {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch { return new Set(); }
}
export function saveFavorites(set) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...set]));
}

/* Equipo Pokémon en localStorage */
const TEAM_KEY = 'pokedex_team';
export function loadTeam() {
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function saveTeam(team) {
  localStorage.setItem(TEAM_KEY, JSON.stringify(team));
}

/**
 * Calcula las debilidades y resistencias de un Pokémon según sus tipos defensores.
 */
export function getDefenseEffectiveness(types = []) {
  const allTypes = Object.keys(TYPE_CHART);
  const multipliers = {};

  allTypes.forEach(attackingType => {
    let multiplier = 1;
    types.forEach(defendingType => {
      const typeName = typeof defendingType === 'string' ? defendingType : defendingType.name;
      const match = TYPE_CHART[attackingType]?.[typeName];
      if (match !== undefined) {
        multiplier *= match;
      }
    });
    multipliers[attackingType] = multiplier;
  });

  return multipliers;
}

/**
 * Calcula el resumen de debilidades del equipo completo (6 Pokémon).
 */
export function calculateTeamWeaknesses(team = []) {
  const allTypes = Object.keys(TYPE_TRANSLATIONS);
  const result = {};

  allTypes.forEach(t => {
    result[t] = { weak: 0, resist: 0, immune: 0, nameEs: TYPE_TRANSLATIONS[t] };
  });

  team.forEach(poke => {
    const eff = getDefenseEffectiveness(poke.types);
    Object.entries(eff).forEach(([attackingType, mult]) => {
      if (!result[attackingType]) return;
      if (mult > 1) result[attackingType].weak += 1;
      else if (mult === 0) result[attackingType].immune += 1;
      else if (mult < 1) result[attackingType].resist += 1;
    });
  });

  return result;
}
