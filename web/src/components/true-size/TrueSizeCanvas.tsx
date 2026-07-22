'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { OverlayItem } from './PolygonSelector';
import { transformPolygonLatitude } from '@geoatlas/core';

interface TrueSizeCanvasProps {
  overlays: OverlayItem[];
  onUpdateOverlayCenter?: (id: string, newCenter: [number, number]) => void;
}

export const TrueSizeCanvas: React.FC<TrueSizeCanvasProps> = ({ overlays, onUpdateOverlayCenter }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<Record<string, maplibregl.Marker>>({});

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [10, 20],
      zoom: 2,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      Object.values(markersRef.current).forEach((m) => m.remove());
      markersRef.current = {};
      map.current?.remove();
    };
  }, []);

  // Update map layers and draggable markers whenever overlays change
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    const renderOverlays = () => {
      // Clean up markers for removed overlays
      const currentOverlayIds = new Set(overlays.map((o) => o.id));
      Object.keys(markersRef.current).forEach((id) => {
        if (!currentOverlayIds.has(id)) {
          markersRef.current[id].remove();
          delete markersRef.current[id];
        }
      });

      overlays.forEach((ov) => {
        if (!ov.geometry) return;

        const sourceId = `truesize-source-${ov.id}`;
        const fillLayerId = `truesize-layer-fill-${ov.id}`;
        const lineLayerId = `truesize-layer-line-${ov.id}`;

        const center = ov.currentCenter || ov.originCenter;

        // Transform geometry for current position
        const transformedGeom = transformPolygonLatitude(
          ov.geometry,
          ov.originCenter,
          center
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
              'fill-opacity': 0.45,
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
              'line-width': 2.5,
            },
          });
        }

        // Add or update Draggable Marker
        if (!markersRef.current[ov.id]) {
          const marker = new maplibregl.Marker({
            draggable: true,
            color: ov.color,
          })
            .setLngLat(center)
            .addTo(m);

          marker.on('drag', () => {
            const lngLat = marker.getLngLat();
            const updatedCenter: [number, number] = [lngLat.lng, lngLat.lat];
            
            // Re-transform polygon on drag
            const realTimeGeom = transformPolygonLatitude(
              ov.geometry,
              ov.originCenter,
              updatedCenter
            );

            const updatedData: any = {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: realTimeGeom,
                  properties: { name: ov.name },
                },
              ],
            };

            if (m.getSource(sourceId)) {
              (m.getSource(sourceId) as maplibregl.GeoJSONSource).setData(updatedData);
            }

            if (onUpdateOverlayCenter) {
              onUpdateOverlayCenter(ov.id, updatedCenter);
            }
          });

          markersRef.current[ov.id] = marker;
        } else {
          markersRef.current[ov.id].setLngLat(center);
        }
      });
    };

    if (m.isStyleLoaded()) {
      renderOverlays();
    } else {
      m.once('load', renderOverlays);
    }
  }, [overlays, onUpdateOverlayCenter]);

  return (
    <div className="relative w-full h-full min-h-[550px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Click and drag pin handles to compare true size across latitudes!</span>
      </div>
    </div>
  );
};
