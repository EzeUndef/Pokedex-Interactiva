# 🔴 Pokédex Interactiva (Kanto a Paldea)

Una aplicación web moderna e interactiva inspirada en los dispositivos físicos de la serie y videojuegos de Pokémon (Game Boy, GBA, Nintendo DS y Switch), con información completa en **español latino**, soporte para los **1025 Pokémon (Gen 1 a 9)**, herramientas competitivas y sonido retro.

---

## ✨ Funcionalidades Principales

### 1. 🌍 Base de Datos Nacional Completa (1 al 1025)
- **Todas las 9 Generaciones**:
  - **Gen I (Kanto)**: #0001 - #0151
  - **Gen II (Johto)**: #0152 - #0251
  - **Gen III (Hoenn)**: #0252 - #0386
  - **Gen IV (Sinnoh)**: #0387 - #0493
  - **Gen V (Unova / Teselia)**: #0494 - #0649
  - **Gen VI (Kalos)**: #0650 - #0721
  - **Gen VII (Alola)**: #0722 - #0809
  - **Gen VIII (Galar)**: #0810 - #0905
  - **Gen IX (Paldea)**: #0906 - #1025
  - **Nacional**: Exploración fluida de toda la Pokédex.
- **Búsqueda Global Instantánea**: Indexación en memoria de los 1025 Pokémon que permite encontrar cualquier especie en milisegundos por nombre o número de Pokédex, sin importar en qué generación te encuentres.

### 2. 🎮 9 Modelos de Pokédex Seleccionables
El chasis del dispositivo se adapta visualmente según la región seleccionada:
- **Kanto (Gen I)**: Rojo clásico con lente azul parpadeante.
- **Johto (Gen II)**: Azul cobalto y dorados de Oro/Plata/Cristal.
- **Hoenn (Gen III)**: Verde esmeralda de Rubí/Zafiro/Esmeralda.
- **Sinnoh (Gen IV)**: Púrpura y cian estilo pantalla dual Nintendo DS.
- **Unova (Gen V)**: Magenta y cian moderno.
- **Kalos (Gen VI)**: Naranja y verde lima holográfico.
- **Alola (Gen VII)**: Estilo Rotom Dex con pantalla de alta tecnología.
- **Galar (Gen VIII)**: Índigo y carmesí estilo smartphone/Rotom Phone.
- **Paldea (Gen IX)**: Fucsia y ámbar de última generación.

### 3. 🛡️ Creador de Equipos (Team Builder)
- Crea y organiza tu equipo de combate de hasta **6 Pokémon**.
- **Análisis de Vulnerabilidades**: Matriz que calcula cuántos miembros son débiles, resistentes o inmunes a cada uno de los 18 tipos elementales.
- Alertas visuales si tu equipo comparte 3 o más debilidades contra un mismo tipo.
- Persistencia automática en el navegador vía `localStorage`.

### 4. ⚔️ Comparador Pokémon (Modo Versus)
- Enfrentamiento cara a cara entre 2 Pokémon:
  - Gráficos de barras enfrentados con corona de victoria 👑 en cada estadística base (PS, Ataque, Defensa, At. Especial, Def. Especial, Velocidad).
  - Declaración del ganador por **BST** (Base Stat Total).
  - Cálculo de **Efectividad Elemental**: Calcula el multiplicador de daño que cada uno causaría al otro (Súper eficaz x2 / x4, No muy eficaz x0.5 / x0.25 o Sin efecto x0).
  - Botón de generación aleatoria para descubrir enfrentamientos curiosos.

### 5. 📍 Lugares de Captura en los Juegos
- Cada ficha de Pokémon incluye la pestaña **"Ubicaciones"**, que consulta la API para detallar las rutas, cuevas, lagos y zonas de encuentro en cada versión de juego (Rojo Fuego, Esmeralda, Platino, etc.) con sus porcentajes de aparición y métodos (hierba, pesca, surf).

### 6. 🔊 Audio Oficial y Motor Retro 8-Bit
- **Grito Oficial de cada Pokémon**: Reproducción del audio del rugido/grito oficial provisto por PokéAPI.
- **Efectos de Sonido Retro (SFX)**: Sintetizados proceduralmente con **Web Audio API** (bips de botones, selección, añadir al equipo, fanfarria de victoria).
- **Música Chiptune de Fondo (BGM)**: Melodía retro estilo Game Boy que puedes encender/pausar desde el bisel de la Pokédex.

### 7. 🧬 Cadena Evolutiva Visual
- Muestra la línea completa de evoluciones con sprites oficiales, niveles mínimos requeridos o piedras/objetos evolutivos necesarios.

### 8. 🌐 Todo en Español Latino
- Descripciones de la Pokédex en español oficial.
- Nombres de tipos traducidos (Planta, Fuego, Agua, Hada, Siniestro, etc.).
- Estadísticas en español (PS, Ataque, Defensa, At. Esp, Def. Esp, Velocidad).
- Hábitats, categorías y versiones de juegos traducidas.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- **Estilos**: [Tailwind CSS 3](https://tailwindcss.com/)
- **Iconografía**: [Lucide React](https://lucide.dev/)
- **Peticiones HTTP**: [Axios](https://axios-http.com/)
- **Audio**: [Web Audio API](https://developer.mozilla.org/es/docs/Web/API/Web_Audio_API) (Sintetizador 8-bit nativo sin dependencias externas)
- **Fuente de Datos**: [PokéAPI v2](https://pokeapi.co/)

---

## 🚀 Instalación y Ejecución

### Requisitos previos
- [Node.js](https://nodejs.org/) v18 o superior.
- Gestor de paquetes `npm`.

### Pasos

1. Clonar o acceder a la carpeta del proyecto:
   ```bash
   cd "/home/ecuellar/Documentos/Pokedex Interactiva"
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```
   http://localhost:5173/
   ```

5. Para compilar a producción:
   ```bash
   npm run build
   ```

---

## 📁 Estructura del Código

```
Pokedex Interactiva/
├── index.html                   # Entrada HTML con fuentes Google Fonts (Inter, JetBrains Mono)
├── package.json                 # Dependencias y scripts
├── vite.config.js               # Configuración del bundler Vite
├── tailwind.config.js           # Configuración de clases y paleta Tailwind
├── public/
│   └── pokeball.svg             # Favicon vectorial de Pokébola
└── src/
    ├── main.jsx                 # Render inicial de React
    ├── App.jsx                  # Coordinador de estado, vistas, filtros y 1025 Pokémon
    ├── index.css                # Variables CSS por modelo de Pokédex, animaciones y tipos
    ├── services/
    │   ├── pokeApi.js           # Cliente API, lista maestra de 1025, tabla de tipos y generaciones
    │   └── audioService.js      # Sintetizador Web Audio API de SFX y chiptune BGM
    ├── utils/
    │   └── helpers.js           # Almacenamiento local, cálculos de efectividad y formateo
    └── components/
        ├── PokedexFrame.jsx     # Chasis físico, LEDs animados, bisagra y controles de audio
        ├── VersionSelector.jsx  # Selector de modelos de chasis de Pokédex
        ├── GenerationTabs.jsx   # Selector de generación (Gen I a IX y Nacional)
        ├── Header.jsx           # Buscador, botón aleatorio y favoritos
        ├── TypeFilter.jsx       # Selector de los 18 tipos elementales y ordenamiento
        ├── PokemonGrid.jsx      # Cuadrícula responsive con skeleton loaders
        ├── PokemonCard.jsx      # Tarjeta con acciones rápidas (equipo, comparar, favorito)
        ├── PokemonModal.jsx     # Ficha detallada (Info, Stats, Evolución, Ubicaciones, Grito)
        ├── TeamBuilder.jsx      # Creador de equipos de 6 con análisis de vulnerabilidades
        └── PokemonComparator.jsx# Modo Versus cara a cara con cálculo de efectividad
```

---

## 🔮 Cosas a Mejorar / Roadmap Futuro

Ideas y funcionalidades recomendadas para futuras iteraciones del proyecto:

1. **✨ Toggle de Versión Variocolor (Shiny)**:
   - Añadir un botón o estrella en la tarjeta y modal para alternar entre el sprite regular y el sprite Shiny con destellos animados.

2. **⚔️ Movimientos y MTs/MOs**:
   - Agregar una pestaña de "Movimientos" en el modal que liste los ataques que aprende por nivel, MT/DT o tutor, con su potencia, precisión y descripción en español.

3. **🧬 Formas Regionales y Formas Alternativas**:
   - Incluir selector para Formas de Alola, Galar, Hisui, Paldea, Megaevoluciones, Formas Gigamax y formas especiales (ej. Rotom, Deoxys, Ogerpon).

4. **🎮 Mini-Juego "¿Quién es ese Pokémon?"**:
   - Modo de juego casual con la silueta en negro del Pokémon, sonido clásico del anime y opciones de respuesta con puntuación y rachas.

5. **📤 Exportador / Importador de Equipos (Formato Showdown)**:
   - Capacidad de copiar el equipo en formato texto estándar de Pokémon Showdown para compartirlo o importarlo directamente.

6. **⚡ Soporte Offline (PWA / Service Worker)**:
   - Convertir la Pokédex en una Progressive Web App (PWA) con caché local de sprites e información para consultarla sin conexión a internet.

7. **📊 Gráfico de Radar para Estadísticas**:
   - Renderizar las estadísticas base en un gráfico poligonal de radar hexagonal además de las barras horizontales.

---

## 📄 Créditos y Licencia

- Los datos, sprites y sonidos pertenecen a **Nintendo, Game Freak y The Pokémon Company**.
- Datos provistos gratuitamente por la comunidad a través de [PokéAPI](https://pokeapi.co/).
- Proyecto desarrollado con fines educativos y de entretenimiento.
