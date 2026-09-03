import { useState, useEffect, useMemo, useCallback } from 'react';
import Header from './components/Header';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import PokemonModal from './components/PokemonModal';
import { fetchPokemonList, fetchPokemonCard } from './services/pokeApi';

const PAGE_SIZE = 40;

export default function App() {
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Cargar Pokémon iniciales
  const loadPokemon = useCallback(async (currentOffset, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const listData = await fetchPokemonList(PAGE_SIZE, currentOffset);
      setHasMore(!!listData.next);

      // Cargar detalles de cada Pokémon en paralelo
      const pokemonDetails = await Promise.all(
        listData.results.map((p) => fetchPokemonCard(p.url))
      );

      setAllPokemon((prev) =>
        isInitial ? pokemonDetails : [...prev, ...pokemonDetails]
      );
      setOffset(currentOffset + PAGE_SIZE);
    } catch (error) {
      console.error('Error cargando Pokémon:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPokemon(0, true);
  }, [loadPokemon]);

  const handleLoadMore = () => {
    loadPokemon(offset, false);
  };

  // Filtrar Pokémon
  const filteredPokemon = useMemo(() => {
    let result = allPokemon;

    // Filtrar por tipo
    if (selectedType) {
      result = result.filter((p) =>
        p.types.some((t) => t.name === selectedType)
      );
    }

    // Filtrar por búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          String(p.id).includes(term)
      );
    }

    return result;
  }, [allPokemon, searchTerm, selectedType]);

  // Cerrar modal con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPokemon(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Bloquear scroll cuando hay modal
  useEffect(() => {
    if (selectedPokemon) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPokemon]);

  return (
    <div className="min-h-screen">
      <Header
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        totalCount={filteredPokemon.length}
      />

      <TypeFilter
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <PokemonGrid
        pokemons={filteredPokemon}
        loading={loading}
        onPokemonClick={setSelectedPokemon}
        hasMore={hasMore && !searchTerm && !selectedType}
        onLoadMore={handleLoadMore}
        loadingMore={loadingMore}
      />

      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-slate-500 text-xs">
        <p>Datos obtenidos de <a href="https://pokeapi.co" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 transition-colors">PokéAPI</a></p>
        <p className="mt-1">Pokédex Interactiva © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
