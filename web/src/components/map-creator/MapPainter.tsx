'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { LegendItem } from '@geoatlas/core';

interface MapPainterProps {
  title: string;
  subtitle: string;
  activeColor: string;
  paintedRegions: Record<string, string>;
  legendItems: LegendItem[];
  onPaintRegion: (regionId: string, color: string) => void;
}

export const MapPainter: React.FC<MapPainterProps> = ({
  title,
  subtitle,
  activeColor,
  paintedRegions,
  legendItems,
  onPaintRegion,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [78.9629, 20.5937], // India default center
      zoom: 4,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      if (!map.current) return;

      // Add click handler to paint vector admin features
      map.current.on('click', (e) => {
        const features = map.current?.queryRenderedFeatures(e.point);
        if (features && features.length > 0) {
          const target = features[0];
          const regionId = (target.id || target.properties?.name || `region_${Math.random()}`).toString();
          onPaintRegion(regionId, activeColor);
        }
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [activeColor, onPaintRegion]);

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-10 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 max-w-sm">
        <h2 className="text-base font-bold text-slate-100">{title}</h2>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 right-4 z-10 bg-slate-900/90 backdrop-blur-md p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2 max-w-xs min-w-[160px]">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Legend Key</span>
        {legendItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded border border-white/20" style={{ backgroundColor: item.color }} />
            <span className="text-xs text-slate-200 font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Map Canvas */}
      <div ref={mapContainer} className="w-full h-full flex-1" />
    </div>
  );
};
