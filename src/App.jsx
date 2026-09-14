import { useState, useEffect, useMemo, useCallback } from 'react';
import PokedexFrame from './components/PokedexFrame';
import VersionSelector from './components/VersionSelector';
import GenerationTabs from './components/GenerationTabs';
import Header from './components/Header';
import TypeFilter from './components/TypeFilter';
import PokemonGrid from './components/PokemonGrid';
import PokemonModal from './components/PokemonModal';
import TeamBuilder from './components/TeamBuilder';
import PokemonComparator from './components/PokemonComparator';
import WhosThatPokemon from './components/WhosThatPokemon';
import {
  fetchPokemonList,
  fetchPokemonCard,
  fetchPokemonDetails,
  fetchAllPokemonMasterList,
  POKEDEX_VERSIONS,
  GENERATIONS,
} from './services/pokeApi';
import { loadFavorites, saveFavorites, loadTeam, saveTeam } from './utils/helpers';
import { playSound } from './services/audioService';

const PAGE_SIZE = 36;

export default function App() {
  // Vista activa: 'pokedex' | 'team' | 'compare' | 'minigame'
  const [currentView, setCurrentView] = useState('pokedex');

  // Modelo de la Pokédex estética (Kanto, Johto, Hoenn...)
  const [currentVersion, setCurrentVersion] = useState(POKEDEX_VERSIONS[0]);

  // Generación seleccionada (Todas o Gen 1 a 9)
  const [selectedGen, setSelectedGen] = useState(GENERATIONS[0]);

  // Lista de Pokémon cargados en memoria
  const [allPokemon, setAllPokemon] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Lista maestra de los 1025 Pokémon
  const [masterList, setMasterList] = useState([]);

  // Búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [sortBy, setSortBy] = useState('id-asc');
  const [showFavorites, setShowFavorites] = useState(false);

  // Favoritos y Equipo (persistentes en localStorage)
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [team, setTeam] = useState(() => loadTeam());

  // Modal de detalles
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  // Estado para el comparador
  const [compareA, setCompareA] = useState(null);
  const [compareB, setCompareB] = useState(null);

  // Cargar lista maestra al inicio (para búsqueda instantánea nacional)
  useEffect(() => {
    fetchAllPokemonMasterList().then(list => setMasterList(list));
  }, []);

  // Cargar lote según la generación seleccionada
  const loadPokemonForGen = useCallback(async (gen, currentOffset, isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      else setLoadingMore(true);

      const [startId, endId] = gen.range;
      const effectiveOffset = isInitial ? startId - 1 : currentOffset;
      const countToFetch = Math.min(PAGE_SIZE, endId - effectiveOffset);

      if (countToFetch <= 0) {
        setHasMore(false);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      const listData = await fetchPokemonList(countToFetch, effectiveOffset);
      const nextOffset = effectiveOffset + countToFetch;
      setHasMore(nextOffset < endId);

      const cards = await Promise.all(
        listData.results.map(p => fetchPokemonCard(p.url))
      );

      setAllPokemon(prev => {
        if (isInitial) return cards;
        const existingIds = new Set(prev.map(p => p.id));
        const newCards = cards.filter(c => !existingIds.has(c.id));
        return [...prev, ...newCards];
      });

      setOffset(nextOffset);
    } catch (err) {
      console.error('Error cargando Pokémon:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    loadPokemonForGen(selectedGen, 0, true);
  }, [selectedGen, loadPokemonForGen]);

  const handleLoadMore = () => {
    if (!loadingMore && hasMore) {
      loadPokemonForGen(selectedGen, offset, false);
    }
  };

  // Toggle Favoritos
  const handleToggleFavorite = (id) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveFavorites(next);
      return next;
    });
  };

  // Gestión de Equipo (Máximo 6)
  const handleToggleTeam = (pokemon) => {
    setTeam(prev => {
      const exists = prev.some(p => p.id === pokemon.id);
      let next;
      if (exists) {
        next = prev.filter(p => p.id !== pokemon.id);
      } else {
        if (prev.length >= 6) {
          alert('¡Tu equipo ya tiene 6 Pokémon! Quita uno para añadir a este.');
          return prev;
        }
        next = [...prev, pokemon];
      }
      saveTeam(next);
      return next;
    });
  };

  const handleRemoveFromTeam = (id) => {
    setTeam(prev => {
      const next = prev.filter(p => p.id !== id);
      saveTeam(next);
      return next;
    });
  };

  const handleClearTeam = () => {
    setTeam([]);
    saveTeam([]);
  };

  const handleImportTeam = async (nameList = []) => {
    try {
      const importedCards = await Promise.all(
        nameList.slice(0, 6).map(name => fetchPokemonCard(name).catch(() => null))
      );
      const valid = importedCards.filter(Boolean);
      setTeam(valid);
      saveTeam(valid);
    } catch (err) {
      console.error('Error al importar equipo:', err);
    }
  };

  // Iniciar Comparador con un Pokémon
  const handleCompareWith = (pokemon) => {
    setCompareA(pokemon);
    setCompareB(null);
    setCurrentView('compare');
    playSound.fanfare();
  };

  // Pokémon aleatorio
  const handleRandom = async () => {
    playSound.select();
    const maxId = selectedGen.range[1] || 1025;
    const minId = selectedGen.range[0] || 1;
    const randomId = Math.floor(Math.random() * (maxId - minId + 1)) + minId;

    const existing = allPokemon.find(p => p.id === randomId);
    if (existing) {
      setSelectedPokemon(existing);
    } else {
      try {
        const details = await fetchPokemonDetails(randomId);
        setSelectedPokemon({
          id: details.id,
          name: details.name,
          types: details.types,
          sprite: details.sprites.artwork || details.sprites.front,
          shinySprite: details.sprites.shinyArtwork,
        });
      } catch (err) {
        console.error('Error al obtener Pokémon aleatorio:', err);
      }
    }
  };

  // Filtrado y ordenamiento
  const filteredAndSortedPokemon = useMemo(() => {
    let list = [...allPokemon];

    if (searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      const matchingMaster = masterList.filter(
        p => p.name.toLowerCase().includes(term) || String(p.id) === term
      );

      if (matchingMaster.length > 0) {
        const currentIds = new Set(list.map(p => p.id));
        const missingFromView = matchingMaster.filter(m => !currentIds.has(m.id));
        list = [...missingFromView.slice(0, 12), ...list];
      }

      list = list.filter(
        p => p.name.toLowerCase().includes(term) || String(p.id) === term
      );
    }

    if (showFavorites) {
      list = list.filter(p => favorites.has(p.id));
    }

    if (selectedType) {
      list = list.filter(p => p.types.some(t => t.name === selectedType));
    }

    list.sort((a, b) => {
      if (sortBy === 'id-asc') return a.id - b.id;
      if (sortBy === 'id-desc') return b.id - a.id;
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      return 0;
    });

    return list;
  }, [allPokemon, masterList, searchTerm, showFavorites, favorites, selectedType, sortBy]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setSelectedPokemon(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <PokedexFrame
      version={currentVersion}
      currentView={currentView}
      onSelectView={setCurrentView}
      teamCount={team.length}
    >
      <div className="max-w-7xl mx-auto flex flex-col min-h-screen">
        {/* Selector de Modelos de Pokédex */}
        <div className="px-4 pt-2.5 pb-1 border-b border-white/5 bg-black/20">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
              Chasis Pokédex:
            </span>
            <span className="text-[10px] font-mono text-white/40">
              Región de inspiración: {currentVersion.label} (Gen {currentVersion.gen})
            </span>
          </div>
          <VersionSelector
            currentVersion={currentVersion}
            onVersionChange={(v) => {
              playSound.click();
              setCurrentVersion(v);
            }}
          />
        </div>

        {/* Vista: Pokédex Principal */}
        {currentView === 'pokedex' && (
          <>
            <GenerationTabs
              selectedGen={selectedGen}
              onSelectGen={setSelectedGen}
            />

            <Header
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              totalCount={filteredAndSortedPokemon.length}
              onRandom={handleRandom}
              onToggleFavorites={() => {
                playSound.click();
                setShowFavorites(prev => !prev);
              }}
              showFavorites={showFavorites}
              favCount={favorites.size}
            />

            <TypeFilter
              selectedType={selectedType}
              onTypeChange={(t) => {
                playSound.click();
                setSelectedType(t);
              }}
              sortBy={sortBy}
              onSortChange={(s) => {
                playSound.click();
                setSortBy(s);
              }}
            />

            <div className="flex-1">
              <PokemonGrid
                pokemons={filteredAndSortedPokemon}
                loading={loading}
                onPokemonClick={setSelectedPokemon}
                hasMore={hasMore && !searchTerm && !selectedType && !showFavorites}
                onLoadMore={handleLoadMore}
                loadingMore={loadingMore}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                team={team}
                onToggleTeam={handleToggleTeam}
                onCompareWith={handleCompareWith}
              />
            </div>
          </>
        )}

        {/* Vista: Mi Equipo */}
        {currentView === 'team' && (
          <TeamBuilder
            team={team}
            onRemoveFromTeam={handleRemoveFromTeam}
            onClearTeam={handleClearTeam}
            onSelectPokemon={setSelectedPokemon}
            onImportTeam={handleImportTeam}
            onClose={() => setCurrentView('pokedex')}
          />
        )}

        {/* Vista: Comparador Versus ⚔️ */}
        {currentView === 'compare' && (
          <PokemonComparator
            initialPokeA={compareA}
            initialPokeB={compareB}
            masterList={masterList}
            onClose={() => setCurrentView('pokedex')}
          />
        )}

        {/* Vista: Mini-Juego Trivia */}
        {currentView === 'minigame' && (
          <WhosThatPokemon
            allPokemon={allPokemon}
            masterList={masterList}
          />
        )}

        {/* Footer */}
        <footer className="py-4 px-4 text-center border-t border-white/5 text-[11px] text-white/30">
          <p>Pokédex Interactiva estilo Pokémon Anime / Game Boy / Nintendo DS</p>
          <p className="mt-0.5">Soporte completo Gen I - IX (Kanto a Paldea #0001 - #1025) • Audio 8-Bit Web Audio API</p>
        </footer>
      </div>

      {/* Modal de detalles completos */}
      {selectedPokemon && (
        <PokemonModal
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
          isFavorite={favorites.has(selectedPokemon.id)}
          onToggleFavorite={handleToggleFavorite}
          isInTeam={team.some(p => p.id === selectedPokemon.id)}
          onToggleTeam={handleToggleTeam}
          onCompareWith={handleCompareWith}
        />
      )}
    </PokedexFrame>
  );
}
