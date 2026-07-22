'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { SAMPLE_SEISMIC_ALERTS, SAMPLE_AQI_STATIONS } from '@geoatlas/core';

interface GisCanvasProps {
  bufferRadiusKm: number;
  showBuffer: boolean;
  showEarthquakes: boolean;
  showAqi: boolean;
  showRadar: boolean;
  bufferCenter: [number, number]; // [lng, lat]
  bufferGeometry?: any;
}

export const GisCanvas: React.FC<GisCanvasProps> = ({
  bufferRadiusKm,
  showBuffer,
  showEarthquakes,
  showAqi,
  showRadar,
  bufferCenter,
  bufferGeometry,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://tiles.openfreemap.org/styles/bright',
      center: bufferCenter,
      zoom: 3,
    });

    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update Map Layers for Buffer, Weather Radar, AQI, and Earthquakes
  useEffect(() => {
    if (!map.current) return;
    const m = map.current;

    const renderLayers = () => {
      // 1. Buffer Layer
      if (showBuffer && bufferGeometry) {
        const sourceId = 'gis-buffer-source';
        const fillLayerId = 'gis-buffer-fill';
        const lineLayerId = 'gis-buffer-line';

        const geojsonData: any = {
          type: 'FeatureCollection',
          features: [{ type: 'Feature', geometry: bufferGeometry, properties: {} }],
        };

        if (m.getSource(sourceId)) {
          (m.getSource(sourceId) as maplibregl.GeoJSONSource).setData(geojsonData);
        } else {
          m.addSource(sourceId, { type: 'geojson', data: geojsonData });
          m.addLayer({
            id: fillLayerId,
            type: 'fill',
            source: sourceId,
            paint: { 'fill-color': '#00f0ff', 'fill-opacity': 0.35 },
          });
          m.addLayer({
            id: lineLayerId,
            type: 'line',
            source: sourceId,
            paint: { 'line-color': '#00f0ff', 'line-width': 2.5 },
          });
        }
      } else if (m.getLayer('gis-buffer-fill')) {
        m.removeLayer('gis-buffer-fill');
        m.removeLayer('gis-buffer-line');
        m.removeSource('gis-buffer-source');
      }

      // 2. Earthquakes Source & Layer
      if (showEarthquakes) {
        const eqSourceId = 'gis-eq-source';
        const eqLayerId = 'gis-eq-layer';

        const eqGeoJson: any = {
          type: 'FeatureCollection',
          features: SAMPLE_SEISMIC_ALERTS.map((eq) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: eq.coordinates },
            properties: { title: eq.title, mag: eq.magnitude },
          })),
        };

        if (m.getSource(eqSourceId)) {
          (m.getSource(eqSourceId) as maplibregl.GeoJSONSource).setData(eqGeoJson);
        } else {
          m.addSource(eqSourceId, { type: 'geojson', data: eqGeoJson });
          m.addLayer({
            id: eqLayerId,
            type: 'circle',
            source: eqSourceId,
            paint: {
              'circle-radius': 12,
              'circle-color': '#ef4444',
              'circle-opacity': 0.8,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });
        }
      } else if (m.getLayer('gis-eq-layer')) {
        m.removeLayer('gis-eq-layer');
        m.removeSource('gis-eq-source');
      }

      // 3. Air Quality Index (AQI) Layer
      if (showAqi) {
        const aqiSourceId = 'gis-aqi-source';
        const aqiLayerId = 'gis-aqi-layer';

        const aqiGeoJson: any = {
          type: 'FeatureCollection',
          features: SAMPLE_AQI_STATIONS.map((aqi) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: aqi.coordinates },
            properties: { val: aqi.aqiValue, cat: aqi.category },
          })),
        };

        if (m.getSource(aqiSourceId)) {
          (m.getSource(aqiSourceId) as maplibregl.GeoJSONSource).setData(aqiGeoJson);
        } else {
          m.addSource(aqiSourceId, { type: 'geojson', data: aqiGeoJson });
          m.addLayer({
            id: aqiLayerId,
            type: 'circle',
            source: aqiSourceId,
            paint: {
              'circle-radius': 10,
              'circle-color': '#10b981',
              'circle-opacity': 0.85,
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            },
          });
        }
      } else if (m.getLayer('gis-aqi-layer')) {
        m.removeLayer('gis-aqi-layer');
        m.removeSource('gis-aqi-source');
      }
    };

    if (m.isStyleLoaded()) {
      renderLayers();
    } else {
      m.once('load', renderLayers);
    }
  }, [bufferRadiusKm, showBuffer, showEarthquakes, showAqi, showRadar, bufferGeometry]);

  return (
    <div className="relative w-full h-full min-h-[600px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl">
      <div ref={mapContainer} className="w-full h-full" />
    </div>
  );
};
