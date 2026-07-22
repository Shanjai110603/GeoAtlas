'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SearchResult } from '@/lib/types';
import { LayerControls } from './LayerControls';
import { GISToolPanel } from './GISToolPanel';

export interface MapViewProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  results?: SearchResult[];
  onSelectFeature?: (feature: any) => void;
  className?: string;
}

const TILE_SERVER_URL = process.env.NEXT_PUBLIC_TILE_URL || 'http://localhost:3001';

export const MapView: React.FC<MapViewProps> = ({
  center = [78.9629, 20.5937], // India default center
  zoom = 4,
  results = [],
  onSelectFeature,
  className = 'h-full w-full',
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  const [activeLayers, setActiveLayers] = useState<Record<string, boolean>>({
    countries: true,
    states: true,
    districts: true,
    hospitals: true,
    schools: true,
    businesses: true,
  });

  const [showGisTools, setShowGisTools] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright', // OpenFreeMap basemap
      center,
      zoom,
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');

    map.on('load', () => {
      // Vector tiles source from self-hosted Martin tile server reading from PostGIS
      try {
        map.addSource('admin_levels_source', {
          type: 'vector',
          tiles: [`${TILE_SERVER_URL}/admin_levels/{z}/{x}/{y}`],
        });

        // Zoom-dependent rendering setup
        // Country level (zoom 0 to 5)
        map.addLayer({
          id: 'admin_level_country',
          type: 'line',
          source: 'admin_levels_source',
          'source-layer': 'admin_levels',
          minzoom: 0,
          maxzoom: 5,
          paint: {
            'line-color': '#3b82f6',
            'line-width': 2,
          },
        });

        // State/District level (zoom 5 to 10)
        map.addLayer({
          id: 'admin_level_state',
          type: 'line',
          source: 'admin_levels_source',
          'source-layer': 'admin_levels',
          minzoom: 5,
          maxzoom: 10,
          paint: {
            'line-color': '#10b981',
            'line-width': 1.5,
            'line-dasharray': [2, 2],
          },
        });

        // Local entity details (zoom 10+)
        map.addLayer({
          id: 'admin_level_local',
          type: 'line',
          source: 'admin_levels_source',
          'source-layer': 'admin_levels',
          minzoom: 10,
          paint: {
            'line-color': '#8b5cf6',
            'line-width': 1,
          },
        });
      } catch (err) {
        console.warn('Tile server layer initialization warning:', err);
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update center when prop changes
  useEffect(() => {
    if (mapRef.current && center) {
      mapRef.current.flyTo({ center, zoom });
    }
  }, [center, zoom]);

  // Update result markers
  useEffect(() => {
    if (!mapRef.current) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    results.forEach((item) => {
      if (item.geometry && item.geometry.type === 'Point') {
        const [lng, lat] = item.geometry.coordinates;
        const el = document.createElement('div');
        el.className = 'w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg cursor-pointer flex items-center justify-center text-[10px] text-white font-bold hover:scale-125 transition-transform';
        el.innerText = item.name.charAt(0);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(
            new maplibregl.Popup({ offset: 25 }).setHTML(
              `<strong style="color: #0f172a">${item.name}</strong><br/><span style="color: #64748b; font-size: 11px;">${item.entity_type || 'location'}</span>`
            )
          )
          .addTo(mapRef.current!);

        markersRef.current.push(marker);
      }
    });
  }, [results]);

  const handleToggleLayer = (layerId: string) => {
    setActiveLayers((prev) => {
      const next = { ...prev, [layerId]: !prev[layerId] };
      if (mapRef.current) {
        const mapLayerId = `admin_level_${layerId}`;
        if (mapRef.current.getLayer(mapLayerId)) {
          mapRef.current.setLayoutProperty(
            mapLayerId,
            'visibility',
            next[layerId] ? 'visible' : 'none'
          );
        }
      }
      return next;
    });
  };

  const handleDrawGeoJson = (geojson: any, layerId: string) => {
    if (!mapRef.current) return;

    const map = mapRef.current;
    if (map.getSource(layerId)) {
      (map.getSource(layerId) as maplibregl.GeoJSONSource).setData(geojson);
    } else {
      map.addSource(layerId, {
        type: 'geojson',
        data: geojson,
      });

      if (geojson.geometry?.type === 'Polygon' || geojson.type === 'Feature') {
        map.addLayer({
          id: layerId,
          type: 'fill',
          source: layerId,
          paint: {
            'fill-color': '#3b82f6',
            'fill-opacity': 0.3,
          },
        });
      } else if (geojson.geometry?.type === 'LineString' || geojson.routes) {
        map.addLayer({
          id: layerId,
          type: 'line',
          source: layerId,
          paint: {
            'line-color': '#10b981',
            'line-width': 4,
          },
        });
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="h-full w-full rounded-2xl overflow-hidden shadow-inner" />

      {/* Layer Controls Panel */}
      <div className="absolute top-4 left-4 z-10">
        <LayerControls activeLayers={activeLayers} onToggleLayer={handleToggleLayer} />
      </div>

      {/* GIS Tools Panel Trigger */}
      <div className="absolute bottom-4 left-4 z-10">
        <button
          onClick={() => setShowGisTools((v) => !v)}
          className="px-3.5 py-2 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl text-xs font-semibold text-blue-400 hover:bg-slate-900 transition-all shadow-lg"
        >
          {showGisTools ? 'Hide GIS Tools' : 'Spatial Tools (Buffer/Distance/Route)'}
        </button>
      </div>

      {/* GIS Tools Panel */}
      {showGisTools && (
        <div className="absolute bottom-14 left-4 z-10 w-80 max-w-[90vw]">
          <GISToolPanel onRenderGeoJson={handleDrawGeoJson} />
        </div>
      )}
    </div>
  );
};
