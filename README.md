# 🔴 Pokédex Interactiva (Kanto a Paldea)

Una aplicación web moderna e interactiva inspirada en los dispositivos físicos de la serie y videojuegos de Pokémon (Game Boy, GBA, Nintendo DS y Switch), con información completa en **español latino**, soporte para los **1025 Pokémon (Gen 1 a 9)**, herramientas competitivas y sonido retro.

---

## ✨ Funcionalidades Principales

### 1. ⚔️ Comparador Avanzado con Naturalezas y Niveles Competitivos
- **Selección Libre de Combatientes**: Buscador predictivo con autocompletado para elegir libremente cualquier Pokémon vs cualquier Pokémon.
- **25 Naturalezas Oficiales** (*Firme, Alegre, Modesta, Miedosa, Osada, Serena, etc.*):
  - Aplica los modificadores oficiales (+10% ▲ verde / -10% ▼ rojo) sobre la estadística correspondiente.
- **Selector de Modo de Nivel**:
  - **Stats Base**: Valores base directos (BST).
  - **Nivel 50 (VGC / Competitivo)**: Estadísticas reales calculadas con la fórmula matemática oficial.
  - **Nivel 100**: Estadísticas reales al nivel máximo.
- **Gráficos de Radar Hexagonal SVG**: Comparación geométrica visual de los atributos.

### 2. ✨ Toggle Variocolor (Shiny)
- Alterna entre los sprites oficiales estándar y sus variantes Shiny con destellos animados en tarjetas, modal y comparador.

### 3. 📊 Gráficos de Radar Hexagonal SVG
- Visualización de polígonos dinámicos en SVG para representar el balance de estadísticas base en la ficha y comparativa.

### 4. 📜 Movimientos y MTs/MOs
- Pestaña de ataques en la ficha del Pokémon con desglose por método (nivel, MT/MO, tutor, huevo).

### 5. 🧬 Formas Regionales y Alternativas
- Selector de variedades (Alola, Galar, Hisui, Paldea, Megas, Gigamax) dentro de la ficha de la especie.

### 6. 🎮 Mini-Juego "¿Quién es ese Pokémon?"
- Trivia interactiva con silueta en negro, 4 opciones de respuesta, sonido retro y contador de racha.

### 7. 📤 Importador y Exportador Pokémon Showdown
- Exportación e importación directa del equipo de 6 Pokémon en formato texto estándar para Pokémon Showdown.

### 8. 🌍 Base de Datos Nacional Completa (1 al 1025)
- Selector de Generaciones de la Gen I a la IX y Nacional.
- Búsqueda global instantánea con indexación en memoria.

### 9. 🛡️ Team Builder (Creador de Equipos)
- Matriz de análisis de debilidades y resistencias del equipo de 6 con persistencia en `localStorage`.

### 10. 🔊 Audio 8-Bit & Gritos Oficiales
- Sintetizador 8-bit nativo con Web Audio API (efectos de sonido y música chiptune BGM) más gritos de audio oficiales.

### 11. ⚡ Soporte PWA / Offline
- Incluye `manifest.json` y `sw.js` (Service Worker) para instalación nativa y caché sin conexión.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Peticiones HTTP**: [Axios](https://axios-http.com/)
- **Audio**: [Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API)
- **Fuente de Datos**: [PokéAPI v2](https://pokeapi.co/)

---

## 🚀 Instalación y Ejecución

```bash
cd "/home/ecuellar/Documentos/Pokedex Interactiva"
npm run dev
```

Abre en tu navegador:
`http://localhost:5174/` (o `http://localhost:5173/`)

---

## 📁 Estructura del Código

```
Pokedex Interactiva/
├── index.html                   # Entrada HTML con fuentes Google Fonts y PWA Service Worker
├── manifest.json                # PWA Web App Manifest
├── sw.js                        # Service Worker de caché offline
├── package.json                 # Dependencias y scripts
├── vite.config.js               # Configuración del bundler Vite
├── tailwind.config.js           # Configuración de clases y paleta Tailwind
└── src/
    ├── main.jsx                 # Render inicial de React
    ├── App.jsx                  # Coordinador de estado, vistas, filtros y 1025 Pokémon
    ├── index.css                # Variables CSS por modelo de Pokédex, animaciones y tipos
    ├── services/
    │   ├── pokeApi.js           # Cliente API, lista maestra de 1025, tabla de tipos y generaciones
    │   ├── audioService.js      # Sintetizador Web Audio API de SFX y chiptune BGM
    │   └── natureService.js     # Base de datos de 25 naturalezas y fórmulas de cálculo
    ├── utils/
    │   └── helpers.js           # Almacenamiento local, cálculos de efectividad y formateo
    └── components/
        ├── PokedexFrame.jsx     # Chasis físico, LEDs animados, bisagra y controles de audio
        ├── VersionSelector.jsx  # Selector de modelos de chasis de Pokédex
        ├── GenerationTabs.jsx   # Selector de generación (Gen I a IX y Nacional)
        ├── Header.jsx           # Buscador, botón aleatorio y favoritos
        ├── TypeFilter.jsx       # Selector de los 18 tipos elementales y ordenamiento
        ├── PokemonGrid.jsx      # Cuadrícula responsive con skeleton loaders
        ├── PokemonCard.jsx      # Tarjeta con acciones rápidas (equipo, comparar, favorito, shiny)
        ├── PokemonModal.jsx     # Ficha detallada (Info, Stats, Radar, Ataques, Evolución, Ubicaciones)
        ├── TeamBuilder.jsx      # Creador de equipos de 6 con análisis de tipos e import/export Showdown
        ├── PokemonComparator.jsx# Modo Versus con selector de Naturalezas (Base/50/100) y Radar
        ├── StatRadarChart.jsx   # Gráfico de radar poligonal dinámico en SVG
        └── WhosThatPokemon.jsx  # Mini-Juego interactivo de adivinanza de siluetas
```

---

## 📄 Créditos y Licencia

- Los datos, sprites y sonidos pertenecen a **Nintendo, Game Freak y The Pokémon Company**.
- Datos provistos gratuitamente por la comunidad a través de [PokéAPI](https://pokeapi.co/).
- Proyecto desarrollado con fines educativos y de entretenimiento.
