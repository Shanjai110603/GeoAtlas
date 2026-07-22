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

  // Active drag state ref
  const draggingState = useRef<{
    activeOverlayId: string | null;
    startLngLat: [number, number];
    startCenter: [number, number];
  }>({
    activeOverlayId: null,
    startLngLat: [0, 0],
    startCenter: [0, 0],
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: [10, 25],
      zoom: 2.2,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    const m = map.current;

    // Global mousemove for direct shape dragging across map
    const handleMouseMove = (e: maplibregl.MapMouseEvent) => {
      const state = draggingState.current;
      if (!state.activeOverlayId) return;

      const deltaLng = e.lngLat.lng - state.startLngLat[0];
      const deltaLat = e.lngLat.lat - state.startLngLat[1];

      const newCenter: [number, number] = [
        state.startCenter[0] + deltaLng,
        state.startCenter[1] + deltaLat,
      ];

      const targetOv = overlays.find((o) => o.id === state.activeOverlayId);
      if (!targetOv || !targetOv.geometry) return;

      const sourceId = `truesize-source-${targetOv.id}`;
      const transformedGeom = transformPolygonLatitude(
        targetOv.geometry,
        targetOv.originCenter,
        newCenter
      );

      const updatedData: any = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: transformedGeom,
            properties: { name: targetOv.name },
          },
        ],
      };

      if (m.getSource(sourceId)) {
        (m.getSource(sourceId) as maplibregl.GeoJSONSource).setData(updatedData);
      }
    };

    // Global mouseup to release dragged country shape
    const handleMouseUp = (e: maplibregl.MapMouseEvent) => {
      const state = draggingState.current;
      if (!state.activeOverlayId) return;

      const deltaLng = e.lngLat.lng - state.startLngLat[0];
      const deltaLat = e.lngLat.lat - state.startLngLat[1];
      const finalCenter: [number, number] = [
        state.startCenter[0] + deltaLng,
        state.startCenter[1] + deltaLat,
      ];

      if (onUpdateOverlayCenter) {
        onUpdateOverlayCenter(state.activeOverlayId, finalCenter);
      }

      state.activeOverlayId = null;
      m.getCanvas().style.cursor = '';
    };

    m.on('mousemove', handleMouseMove);
    m.on('mouseup', handleMouseUp);

    return () => {
      m.off('mousemove', handleMouseMove);
      m.off('mouseup', handleMouseUp);
      map.current?.remove();
    };
  }, [overlays, onUpdateOverlayCenter]);

  // Update map layers and attach click-and-drag directly to country shapes on map
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    const renderOverlays = () => {
      overlays.forEach((ov) => {
        if (!ov.geometry) return;

        const sourceId = `truesize-source-${ov.id}`;
        const fillLayerId = `truesize-layer-fill-${ov.id}`;
        const lineLayerId = `truesize-layer-line-${ov.id}`;

        const center = ov.currentCenter || ov.originCenter;
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
              'fill-opacity': 0.55,
            },
          });

          // Direct click-and-drag interaction handlers on the country map shape
          m.on('mouseenter', fillLayerId, () => {
            m.getCanvas().style.cursor = 'grab';
          });

          m.on('mouseleave', fillLayerId, () => {
            if (!draggingState.current.activeOverlayId) {
              m.getCanvas().style.cursor = '';
            }
          });

          m.on('mousedown', fillLayerId, (e) => {
            e.preventDefault();
            m.getCanvas().style.cursor = 'grabbing';
            draggingState.current = {
              activeOverlayId: ov.id,
              startLngLat: [e.lngLat.lng, e.lngLat.lat],
              startCenter: [...(ov.currentCenter || ov.originCenter)] as [number, number],
            };
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
      });
    };

    if (m.isStyleLoaded()) {
      renderOverlays();
    } else {
      m.once('load', renderOverlays);
    }
  }, [overlays]);

  return (
    <div className="relative w-full h-full min-h-[580px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-slate-800 text-[11px] text-slate-300 flex items-center gap-2 shadow-lg">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Click and drag country shapes directly on the map to compare true sizes!</span>
      </div>
    </div>
  );
};
