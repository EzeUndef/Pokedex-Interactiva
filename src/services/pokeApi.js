import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const TYPE_TRANSLATIONS = {
  normal:'Normal',fire:'Fuego',water:'Agua',electric:'Eléctrico',grass:'Planta',
  ice:'Hielo',fighting:'Lucha',poison:'Veneno',ground:'Tierra',flying:'Volador',
  psychic:'Psíquico',bug:'Bicho',rock:'Roca',ghost:'Fantasma',dragon:'Dragón',
  dark:'Siniestro',steel:'Acero',fairy:'Hada',
};

export const STAT_TRANSLATIONS = {
  hp:'PS',attack:'Ataque',defense:'Defensa',
  'special-attack':'At. Esp.','special-defense':'Def. Esp.',speed:'Velocidad',
};

export const STAT_COLORS = {
  hp:'#FF5959',attack:'#F5AC78',defense:'#FAE078',
  'special-attack':'#9DB7F5','special-defense':'#A7DB8D',speed:'#FA92B2',
};

export const TYPE_COLORS = {
  normal:'#919AA2',fire:'#FF9D55',water:'#5090D6',electric:'#F4D23C',
  grass:'#63BC5A',ice:'#73CEC0',fighting:'#CE416B',poison:'#B567CE',
  ground:'#D97845',flying:'#89AAE3',psychic:'#FA7179',bug:'#91C12F',
  rock:'#C5B78C',ghost:'#5269AD',dragon:'#0B6DC3',dark:'#5A5465',
  steel:'#5A8EA2',fairy:'#EC8FE6',
};

/* ── Pokédex versions / skins ── */
export const POKEDEX_VERSIONS = [
  { id: 'kanto',  label: 'Kanto',  gen: 'I',    css: 'pokedex-kanto',  range: [1, 151] },
  { id: 'johto',  label: 'Johto',  gen: 'II',   css: 'pokedex-johto',  range: [152, 251] },
  { id: 'hoenn',  label: 'Hoenn',  gen: 'III',  css: 'pokedex-hoenn',  range: [252, 386] },
  { id: 'sinnoh', label: 'Sinnoh', gen: 'IV',   css: 'pokedex-sinnoh', range: [387, 493] },
  { id: 'unova',  label: 'Unova',  gen: 'V',    css: 'pokedex-unova',  range: [494, 649] },
  { id: 'kalos',  label: 'Kalos',  gen: 'VI',   css: 'pokedex-kalos',  range: [650, 721] },
  { id: 'alola',  label: 'Alola',  gen: 'VII',  css: 'pokedex-alola',  range: [722, 809] },
  { id: 'galar',  label: 'Galar',  gen: 'VIII', css: 'pokedex-galar',  range: [810, 905] },
  { id: 'paldea', label: 'Paldea', gen: 'IX',   css: 'pokedex-paldea', range: [906, 1025] },
];

/* ── Generaciones de Pokémon (Kanto a Paldea) ── */
export const GENERATIONS = [
  { id: 'all',  label: 'Todas',   range: [1, 1025], region: 'Nacional' },
  { id: 'gen1', label: 'Gen I',   range: [1, 151],    region: 'Kanto' },
  { id: 'gen2', label: 'Gen II',  range: [152, 251],  region: 'Johto' },
  { id: 'gen3', label: 'Gen III', range: [252, 386],  region: 'Hoenn' },
  { id: 'gen4', label: 'Gen IV',  range: [387, 493],  region: 'Sinnoh' },
  { id: 'gen5', label: 'Gen V',   range: [494, 649],  region: 'Unova / Teselia' },
  { id: 'gen6', label: 'Gen VI',  range: [650, 721],  region: 'Kalos' },
  { id: 'gen7', label: 'Gen VII', range: [722, 809],  region: 'Alola' },
  { id: 'gen8', label: 'Gen VIII',range: [810, 905],  region: 'Galar' },
  { id: 'gen9', label: 'Gen IX',  range: [906, 1025], region: 'Paldea' },
];

/* ── Tabla de Efectividades Elementales (Daño que recibe el defensor) ── */
export const TYPE_CHART = {
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
  fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
  water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
  ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
  flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
  rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 },
};

/* ── API calls ── */

let masterListCache = null;

/**
 * Obtiene la lista completa de los 1025 Pokémon (ID, Nombre y Sprite oficial).
 */
export async function fetchAllPokemonMasterList() {
  if (masterListCache) return masterListCache;
  try {
    const { data } = await axios.get(`${BASE_URL}/pokemon`, { params: { limit: 1025, offset: 0 } });
    masterListCache = data.results.map((p, idx) => {
      const id = idx + 1;
      return {
        id,
        name: p.name,
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
        types: [], // Se enriquece al cargar el card o el modal
      };
    });
    return masterListCache;
  } catch (err) {
    console.error('Error cargando lista maestra de Pokémon:', err);
    return [];
  }
}

export async function fetchPokemonList(limit = 40, offset = 0) {
  const { data } = await axios.get(`${BASE_URL}/pokemon`, { params: { limit, offset } });
  return data;
}

export async function fetchPokemonDetails(idOrName) {
  const { data } = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
  return {
    id: data.id,
    name: data.name,
    height: data.height / 10,
    weight: data.weight / 10,
    types: data.types.map(t => ({
      name: t.type.name,
      nameEs: TYPE_TRANSLATIONS[t.type.name] || t.type.name,
    })),
    stats: data.stats.map(s => ({
      name: s.stat.name,
      nameEs: STAT_TRANSLATIONS[s.stat.name] || s.stat.name,
      value: s.base_stat,
      color: STAT_COLORS[s.stat.name] || '#888',
    })),
    sprites: {
      front: data.sprites.front_default,
      artwork: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
      showdown: data.sprites.other?.showdown?.front_default || null,
    },
    abilities: data.abilities.map(a => ({ name: a.ability.name, isHidden: a.is_hidden })),
    cries: data.cries,
    gameIndices: data.game_indices?.map(g => g.version.name) || [],
  };
}

export async function fetchPokemonSpecies(id) {
  const { data } = await axios.get(`${BASE_URL}/pokemon-species/${id}`);

  const flavorEntry = data.flavor_text_entries.find(e => e.language.name === 'es');
  const description = flavorEntry
    ? flavorEntry.flavor_text.replace(/\f|\n|\r/g, ' ')
    : 'Descripción no disponible en español.';

  const nameEntry = data.names.find(n => n.language.name === 'es');
  const genusEntry = data.genera.find(g => g.language.name === 'es');

  return {
    nameEs: nameEntry?.name || data.name,
    description,
    genus: genusEntry?.genus || '',
    color: data.color?.name || 'gray',
    habitat: data.habitat?.name || null,
    generation: data.generation?.name || '',
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
    captureRate: data.capture_rate,
    baseHappiness: data.base_happiness,
    growthRate: data.growth_rate?.name || null,
    evolutionChainUrl: data.evolution_chain?.url || null,
  };
}

export async function fetchEvolutionChain(url) {
  const { data } = await axios.get(url);
  const chain = [];
  function traverse(node) {
    const id = extractId(node.species.url);
    chain.push({
      name: node.species.name, id,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      minLevel: node.evolution_details?.[0]?.min_level || null,
      trigger: node.evolution_details?.[0]?.trigger?.name || null,
      item: node.evolution_details?.[0]?.item?.name || null,
    });
    node.evolves_to.forEach(traverse);
  }
  traverse(data.chain);
  return chain;
}

export async function fetchLocationAreas(id) {
  try {
    const { data } = await axios.get(`${BASE_URL}/pokemon/${id}/encounters`);
    return data.map(enc => ({
      location: enc.location_area.name.replace(/-/g, ' '),
      versions: enc.version_details.map(v => ({
        version: v.version.name,
        maxChance: v.max_chance,
        methods: v.encounter_details.map(d => ({
          method: d.method.name.replace(/-/g, ' '),
          minLevel: d.min_level,
          maxLevel: d.max_level,
          chance: d.chance,
        })),
      })),
    }));
  } catch {
    return [];
  }
}

export async function fetchPokemonCard(urlOrId) {
  const endpoint = typeof urlOrId === 'number' || !String(urlOrId).startsWith('http')
    ? `${BASE_URL}/pokemon/${urlOrId}`
    : urlOrId;
  const { data } = await axios.get(endpoint);
  return {
    id: data.id,
    name: data.name,
    types: data.types.map(t => ({
      name: t.type.name,
      nameEs: TYPE_TRANSLATIONS[t.type.name] || t.type.name,
    })),
    stats: data.stats.map(s => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
    sprite: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
  };
}

function extractId(url) {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
}
