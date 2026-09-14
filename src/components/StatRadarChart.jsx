import React from 'react';
import { STAT_TRANSLATIONS } from '../services/pokeApi';

/**
 * StatRadarChart — Gráfico de Radar Hexagonal en SVG para visualizar los 6 atributos.
 */
export default function StatRadarChart({ stats = [], maxStat = 200, size = 260, color = '#22d3ee' }) {
  const center = size / 2;
  const radius = size * 0.38;
  const statKeys = ['hp', 'attack', 'defense', 'speed', 'special-defense', 'special-attack'];

  // Convertir lista de stats en mapa ordenado
  const statMap = {};
  stats.forEach(s => {
    statMap[s.name] = s.value;
  });

  const numPoints = statKeys.length;
  const angleStep = (Math.PI * 2) / numPoints;

  // Calcular vértices de los polígonos guía (25%, 50%, 75%, 100%)
  const getPolygonPoints = (factor) => {
    return statKeys.map((_, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const x = center + radius * factor * Math.cos(angle);
      const y = center + radius * factor * Math.sin(angle);
      return `${x},${y}`;
    }).join(' ');
  };

  // Vértices del Pokémon según sus stats
  const pokePoints = statKeys.map((key, i) => {
    const val = statMap[key] || 0;
    const factor = Math.min(val / maxStat, 1);
    const angle = i * angleStep - Math.PI / 2;
    const x = center + radius * factor * Math.cos(angle);
    const y = center + radius * factor * Math.sin(angle);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center py-2">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
        {/* Polígonos de fondo (Líneas guía) */}
        {[0.25, 0.5, 0.75, 1.0].map((factor, idx) => (
          <polygon
            key={idx}
            points={getPolygonPoints(factor)}
            fill="none"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeWidth="1"
          />
        ))}

        {/* Ejes desde el centro a cada esquina */}
        {statKeys.map((_, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const x2 = center + radius * Math.cos(angle);
          const y2 = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x2}
              y2={y2}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Polígono relleno con el perfil del Pokémon */}
        <polygon
          points={pokePoints}
          fill={color}
          fillOpacity="0.35"
          stroke={color}
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Vértices y Etiquetas */}
        {statKeys.map((key, i) => {
          const val = statMap[key] || 0;
          const factor = Math.min(val / maxStat, 1);
          const angle = i * angleStep - Math.PI / 2;
          const px = center + radius * factor * Math.cos(angle);
          const py = center + radius * factor * Math.sin(angle);

          // Posición de la etiqueta fuera del hexágono
          const labelRadius = radius + 22;
          const lx = center + labelRadius * Math.cos(angle);
          const ly = center + labelRadius * Math.sin(angle);

          const nameEs = STAT_TRANSLATIONS[key] || key;

          return (
            <g key={key}>
              {/* Punto en el vértice */}
              <circle cx={px} cy={py} r="3.5" fill={color} stroke="#0f0f1a" strokeWidth="1.5" />

              {/* Texto fuera del hexágono */}
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="central"
                fill="rgba(255, 255, 255, 0.7)"
                fontSize="9"
                fontWeight="700"
                fontFamily="Inter, sans-serif"
              >
                {nameEs} <tspan fill="#ffffff" fontWeight="800">({val})</tspan>
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
