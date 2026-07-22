'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { OverlayItem } from './PolygonSelector';
import { transformPolygonLatitude, computeGeodesicScaleFactor } from '@geoatlas/core';

interface TrueSizeCanvasProps {
  overlays: OverlayItem[];
  onUpdateOverlayCenter?: (id: string, newCenter: [number, number]) => void;
}

export const TrueSizeCanvas: React.FC<TrueSizeCanvasProps> = ({ overlays, onUpdateOverlayCenter }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [activeHoverInfo, setActiveHoverInfo] = useState<{
    name: string;
    area_sq_km?: number;
    lat: number;
    scalePercent: number;
  } | null>(null);

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
      center: [10, 20],
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

      const scale = computeGeodesicScaleFactor(targetOv.originCenter[1], newCenter[1]);
      const scalePercent = Math.round((1 / (scale * scale) - 1) * 100);

      setActiveHoverInfo({
        name: targetOv.name,
        area_sq_km: targetOv.area_sq_km,
        lat: Math.round(newCenter[1]),
        scalePercent,
      });

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
              'fill-opacity': 0.6,
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
              'line-color': '#ffffff',
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
    <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />

      {/* Floating Instructions Header */}
      <div className="absolute top-4 left-4 bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-center gap-2.5 shadow-xl">
        <span className="w-3 h-3 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-semibold">
          Click and drag any country shape directly across the map to compare true physical sizes!
        </span>
      </div>

      {/* Active Hover / Drag Metric Floating Panel */}
      {activeHoverInfo && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md px-5 py-3 rounded-2xl border border-slate-700 shadow-2xl flex items-center gap-6 text-slate-100 animate-fade-in">
          <div>
            <div className="text-xs text-slate-400 font-medium">Selected Country</div>
            <div className="text-sm font-bold text-cyan-400">{activeHoverInfo.name}</div>
          </div>
          {activeHoverInfo.area_sq_km && (
            <div className="border-l border-slate-800 pl-4">
              <div className="text-xs text-slate-400 font-medium">Actual Surface Area</div>
              <div className="text-sm font-bold text-emerald-400 font-mono">
                {activeHoverInfo.area_sq_km.toLocaleString()} sq km
              </div>
            </div>
          )}
          <div className="border-l border-slate-800 pl-4">
            <div className="text-xs text-slate-400 font-medium">Mercator Scale Distortion</div>
            <div className="text-sm font-bold text-amber-400 font-mono">
              {activeHoverInfo.scalePercent >= 0 ? `+${activeHoverInfo.scalePercent}%` : `${activeHoverInfo.scalePercent}%`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
