import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Mapa de tipos inglés → español
const TYPE_TRANSLATIONS = {
  normal: 'Normal',
  fire: 'Fuego',
  water: 'Agua',
  electric: 'Eléctrico',
  grass: 'Planta',
  ice: 'Hielo',
  fighting: 'Lucha',
  poison: 'Veneno',
  ground: 'Tierra',
  flying: 'Volador',
  psychic: 'Psíquico',
  bug: 'Bicho',
  rock: 'Roca',
  ghost: 'Fantasma',
  dragon: 'Dragón',
  dark: 'Siniestro',
  steel: 'Acero',
  fairy: 'Hada',
};

// Mapa de stats inglés → español
const STAT_TRANSLATIONS = {
  hp: 'PS',
  attack: 'Ataque',
  defense: 'Defensa',
  'special-attack': 'At. Esp.',
  'special-defense': 'Def. Esp.',
  speed: 'Velocidad',
};

// Colores de las barras de stats
const STAT_COLORS = {
  hp: '#FF5959',
  attack: '#F5AC78',
  defense: '#FAE078',
  'special-attack': '#9DB7F5',
  'special-defense': '#A7DB8D',
  speed: '#FA92B2',
};

/**
 * Obtiene una lista de Pokémon con datos básicos.
 */
export async function fetchPokemonList(limit = 20, offset = 0) {
  const { data } = await axios.get(`${BASE_URL}/pokemon`, {
    params: { limit, offset },
  });
  return data;
}

/**
 * Obtiene los datos detallados de un Pokémon por ID o nombre.
 */
export async function fetchPokemonDetails(idOrName) {
  const { data } = await axios.get(`${BASE_URL}/pokemon/${idOrName}`);
  return {
    id: data.id,
    name: data.name,
    height: data.height / 10,
    weight: data.weight / 10,
    types: data.types.map((t) => ({
      name: t.type.name,
      nameEs: TYPE_TRANSLATIONS[t.type.name] || t.type.name,
    })),
    stats: data.stats.map((s) => ({
      name: s.stat.name,
      nameEs: STAT_TRANSLATIONS[s.stat.name] || s.stat.name,
      value: s.base_stat,
      color: STAT_COLORS[s.stat.name] || '#a0a0a0',
    })),
    sprites: {
      front: data.sprites.front_default,
      artwork:
        data.sprites.other?.['official-artwork']?.front_default ||
        data.sprites.front_default,
      dreamWorld:
        data.sprites.other?.dream_world?.front_default || null,
      showdown:
        data.sprites.other?.showdown?.front_default || null,
    },
    abilities: data.abilities.map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
    cries: data.cries,
  };
}

/**
 * Obtiene la info de la especie (incluye descripciones en español).
 */
export async function fetchPokemonSpecies(id) {
  const { data } = await axios.get(`${BASE_URL}/pokemon-species/${id}`);

  const flavorEntry = data.flavor_text_entries.find(
    (entry) => entry.language.name === 'es'
  );
  const description = flavorEntry
    ? flavorEntry.flavor_text.replace(/\f|\n|\r/g, ' ')
    : 'Descripción no disponible en español.';

  const nameEntry = data.names.find((n) => n.language.name === 'es');
  const nameEs = nameEntry ? nameEntry.name : data.name;

  const genusEntry = data.genera.find((g) => g.language.name === 'es');
  const genus = genusEntry ? genusEntry.genus : '';

  return {
    nameEs,
    description,
    genus,
    color: data.color?.name || 'gray',
    habitat: data.habitat?.name || 'desconocido',
    generation: data.generation?.name || '',
    isLegendary: data.is_legendary,
    isMythical: data.is_mythical,
    captureRate: data.capture_rate,
    baseHappiness: data.base_happiness,
    evolutionChainUrl: data.evolution_chain?.url || null,
  };
}

/**
 * Obtiene la cadena evolutiva y devuelve un array plano.
 */
export async function fetchEvolutionChain(url) {
  const { data } = await axios.get(url);
  const chain = [];

  function traverse(node) {
    const id = extractIdFromUrl(node.species.url);
    chain.push({
      name: node.species.name,
      id,
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

function extractIdFromUrl(url) {
  const parts = url.replace(/\/$/, '').split('/');
  return parseInt(parts[parts.length - 1], 10);
}

/**
 * Obtiene datos básicos para la card.
 */
export async function fetchPokemonCard(url) {
  const { data } = await axios.get(url);
  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t) => ({
      name: t.type.name,
      nameEs: TYPE_TRANSLATIONS[t.type.name] || t.type.name,
    })),
    sprite:
      data.sprites.other?.['official-artwork']?.front_default ||
      data.sprites.front_default,
  };
}

export { TYPE_TRANSLATIONS, STAT_TRANSLATIONS, STAT_COLORS };
