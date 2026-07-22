'use client';

import React, { useState } from 'react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Navigation, Compass, ShieldAlert } from 'lucide-react';
import { Tabs } from '@/components/ui/Tabs';

export interface GISToolPanelProps {
  onRenderGeoJson?: (geojson: any, layerId: string) => void;
}

export const GISToolPanel: React.FC<GISToolPanelProps> = ({ onRenderGeoJson }) => {
  // Buffer state
  const [bufferLat, setBufferLat] = useState('13.0827');
  const [bufferLng, setBufferLng] = useState('80.2707');
  const [bufferRadius, setBufferRadius] = useState('5000');
  const [bufferResult, setBufferResult] = useState<string | null>(null);

  // Distance state
  const [distFrom, setDistFrom] = useState('13.0827,80.2707');
  const [distTo, setDistTo] = useState('11.0168,76.9558');
  const [distResult, setDistResult] = useState<number | null>(null);

  // Route state
  const [routeFrom, setRouteFrom] = useState('13.0418,80.2341');
  const [routeTo, setRouteTo] = useState('13.0732,80.2609');
  const [routeResult, setRouteResult] = useState<any | null>(null);

  const [loading, setLoading] = useState(false);

  const handleCalculateBuffer = async () => {
    setLoading(true);
    try {
      const res = await apiClient.gisBuffer(
        parseFloat(bufferLat),
        parseFloat(bufferLng),
        parseFloat(bufferRadius)
      );
      setBufferResult(`Buffer radius ${res.radius_meters}m computed`);
      if (onRenderGeoJson && res.buffer_geometry) {
        onRenderGeoJson({ type: 'Feature', geometry: res.buffer_geometry }, 'gis_buffer_layer');
      }
    } catch (err: any) {
      setBufferResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateDistance = async () => {
    setLoading(true);
    try {
      const [fromLat, fromLng] = distFrom.split(',').map((s) => parseFloat(s.trim()));
      const [toLat, toLng] = distTo.split(',').map((s) => parseFloat(s.trim()));
      const res = await apiClient.gisDistance(fromLat, fromLng, toLat, toLng);
      setDistResult(res.distance_meters);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCalculateRoute = async () => {
    setLoading(true);
    try {
      const [fromLat, fromLng] = routeFrom.split(',').map((s) => parseFloat(s.trim()));
      const [toLat, toLng] = routeTo.split(',').map((s) => parseFloat(s.trim()));
      const res = await apiClient.getRoute(fromLat, fromLng, toLat, toLng);
      setRouteResult(res);
      if (onRenderGeoJson && res.routes?.[0]?.geometry) {
        onRenderGeoJson(res.routes[0].geometry, 'gis_route_layer');
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    {
      id: 'buffer',
      label: 'Buffer',
      content: (
        <div className="flex flex-col gap-2 pt-2">
          <Input label="Latitude" value={bufferLat} onChange={(e) => setBufferLat(e.target.value)} />
          <Input label="Longitude" value={bufferLng} onChange={(e) => setBufferLng(e.target.value)} />
          <Input
            label="Radius (meters)"
            value={bufferRadius}
            onChange={(e) => setBufferRadius(e.target.value)}
          />
          <Button size="sm" isLoading={loading} onClick={handleCalculateBuffer} className="mt-1">
            Compute PostGIS Buffer
          </Button>
          {bufferResult && <p className="text-[11px] text-emerald-400 mt-1">{bufferResult}</p>}
        </div>
      ),
    },
    {
      id: 'distance',
      label: 'Distance',
      content: (
        <div className="flex flex-col gap-2 pt-2">
          <Input
            label="From (lat,lng)"
            value={distFrom}
            onChange={(e) => setDistFrom(e.target.value)}
          />
          <Input label="To (lat,lng)" value={distTo} onChange={(e) => setDistTo(e.target.value)} />
          <Button size="sm" isLoading={loading} onClick={handleCalculateDistance} className="mt-1">
            Compute Distance
          </Button>
          {distResult !== null && (
            <p className="text-[11px] text-emerald-400 mt-1 font-semibold">
              Distance: {(distResult / 1000).toFixed(2)} km ({distResult.toFixed(0)} meters)
            </p>
          )}
        </div>
      ),
    },
    {
      id: 'route',
      label: 'OSRM Route',
      content: (
        <div className="flex flex-col gap-2 pt-2">
          <Input
            label="From (lat,lng)"
            value={routeFrom}
            onChange={(e) => setRouteFrom(e.target.value)}
          />
          <Input label="To (lat,lng)" value={routeTo} onChange={(e) => setRouteTo(e.target.value)} />
          <Button size="sm" isLoading={loading} onClick={handleCalculateRoute} className="mt-1">
            Calculate OSRM Route
          </Button>
          {routeResult && routeResult.routes?.[0] && (
            <div className="text-[11px] text-emerald-400 mt-1 flex flex-col gap-0.5">
              <p>Distance: {(routeResult.routes[0].distance / 1000).toFixed(2)} km</p>
              <p>Est. Duration: {(routeResult.routes[0].duration / 60).toFixed(1)} mins</p>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <Card glass className="p-4 shadow-2xl border-slate-700/80">
      <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-slate-200 uppercase tracking-wider">
        <Compass size={14} className="text-blue-400" />
        Spatial Analysis Tools (PostGIS / OSRM)
      </div>
      <Tabs tabs={tabs} />
    </Card>
  );
};
