'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { OverlayItem } from './PolygonSelector';
import { transformPolygonLatitude } from '@geoatlas/core';

interface TrueSizeCanvasProps {
  overlays: OverlayItem[];
}

export const TrueSizeCanvas: React.FC<TrueSizeCanvasProps> = ({ overlays }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [20, 20],
      zoom: 2,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map layers on overlay changes
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    const updateLayers = () => {
      // Remove previous overlay sources/layers
      const existingLayers = m.getStyle().layers || [];
      existingLayers.forEach((layer) => {
        if (layer.id.startsWith('truesize-layer-')) {
          m.removeLayer(layer.id);
        }
      });

      overlays.forEach((ov) => {
        const sourceId = `truesize-source-${ov.id}`;
        const fillLayerId = `truesize-layer-fill-${ov.id}`;
        const lineLayerId = `truesize-layer-line-${ov.id}`;

        if (!ov.geometry) return;

        // Transform geometry for current map center
        const transformedGeom = transformPolygonLatitude(
          ov.geometry,
          [78.9629, 20.5937],
          [m.getCenter().lng, m.getCenter().lat]
        );

        const geojsonData: any = {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              geometry: transformedGeom,
              properties: { name: ov.name },
            },
          ],
        };

        if (m.getSource(sourceId)) {
          (m.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojsonData);
        } else {
          m.addSource(sourceId, {
            type: 'geojson',
            data: geojsonData,
          });
        }

        if (!m.getLayer(fillLayerId)) {
          m.addLayer({
            id: fillLayerId,
            type: 'fill',
            source: sourceId,
            paint: {
              'fill-color': ov.color,
              'fill-opacity': 0.4,
            },
          });
        }

        if (!m.getLayer(lineLayerId)) {
          m.addLayer({
            id: lineLayerId,
            type: 'line',
            source: sourceId,
            paint: {
              'line-color': ov.color,
              'line-width': 2,
            },
          });
        }
      });
    };

    if (m.isStyleLoaded()) {
      updateLayers();
    } else {
      m.once('load', updateLayers);
    }
  }, [overlays]);

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        Geodesic Distortion Scale Correction Active
      </div>
    </div>
  );
};
