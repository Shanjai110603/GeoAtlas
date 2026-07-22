'use client';

import React, { useState } from 'react';
import { GisCanvas } from '@/components/gis/GisCanvas';
import { SpatialControls } from '@/components/gis/SpatialControls';
import { EnvironmentalControls } from '@/components/gis/EnvironmentalControls';
import { computeBuffer } from '@geoatlas/core';

export default function GisToolsPage() {
  const [bufferRadiusKm, setBufferRadiusKm] = useState(250);
  const [showBuffer, setShowBuffer] = useState(true);
  const [showEarthquakes, setShowEarthquakes] = useState(true);
  const [showAqi, setShowAqi] = useState(true);
  const [showRadar, setShowRadar] = useState(false);

  const bufferCenter: [number, number] = [78.96, 20.59]; // India center
  const bufferGeom = computeBuffer(bufferCenter, bufferRadiusKm);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Page Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Advanced GIS & Environmental Workbench
          </h1>
          <p className="text-xs text-slate-400">
            Perform real-time geodesic buffer calculations, vector spatial analysis, and monitor live weather radar, AQI sensors, and seismic hazards.
          </p>
        </div>

        {/* Studio Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Controls Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <SpatialControls
              bufferRadiusKm={bufferRadiusKm}
              setBufferRadiusKm={setBufferRadiusKm}
              showBuffer={showBuffer}
              setShowBuffer={setShowBuffer}
              bufferGeometry={bufferGeom}
            />
            <EnvironmentalControls
              showRadar={showRadar}
              setShowRadar={setShowRadar}
              showAqi={showAqi}
              setShowAqi={setShowAqi}
              showEarthquakes={showEarthquakes}
              setShowEarthquakes={setShowEarthquakes}
            />
          </div>

          {/* Interactive Map Canvas */}
          <div className="lg:col-span-3">
            <GisCanvas
              bufferRadiusKm={bufferRadiusKm}
              showBuffer={showBuffer}
              showEarthquakes={showEarthquakes}
              showAqi={showAqi}
              showRadar={showRadar}
              bufferCenter={bufferCenter}
              bufferGeometry={bufferGeom}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
