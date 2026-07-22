'use client';

import React from 'react';
import { Layers, Sliders, MapPin, Maximize2, Activity } from 'lucide-react';
import { computeGeodesicArea } from '@geoatlas/core';

interface SpatialControlsProps {
  bufferRadiusKm: number;
  setBufferRadiusKm: (radius: number) => void;
  showBuffer: boolean;
  setShowBuffer: (show: boolean) => void;
  bufferGeometry?: any;
}

export const SpatialControls: React.FC<SpatialControlsProps> = ({
  bufferRadiusKm,
  setBufferRadiusKm,
  showBuffer,
  setShowBuffer,
  bufferGeometry,
}) => {
  const calculatedAreaSqKm = bufferGeometry ? computeGeodesicArea(bufferGeometry) : 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <Sliders className="text-cyan-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">Spatial Analytics Workbench</h3>
      </div>

      {/* Geodesic Buffer Tool */}
      <div className="flex flex-col gap-2.5 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
            <Maximize2 className="w-3.5 h-3.5 text-cyan-400" /> Geodesic Buffer Zone
          </label>
          <button
            onClick={() => setShowBuffer(!showBuffer)}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-mono transition font-semibold ${
              showBuffer
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                : 'bg-slate-800 text-slate-400'
            }`}
          >
            {showBuffer ? 'ENABLED' : 'DISABLED'}
          </button>
        </div>

        <div className="flex items-center gap-3 mt-1">
          <input
            type="range"
            min="10"
            max="1000"
            step="10"
            value={bufferRadiusKm}
            onChange={(e) => setBufferRadiusKm(Number(e.target.value))}
            className="flex-1 accent-cyan-400 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
          />
          <span className="text-xs font-mono font-bold text-cyan-400 shrink-0 w-16 text-right">
            {bufferRadiusKm} km
          </span>
        </div>
      </div>

      {/* Metric Readout Display */}
      {showBuffer && (
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Buffer Radius</div>
            <div className="text-sm font-bold text-slate-100 font-mono mt-0.5">{bufferRadiusKm} km</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Covered Area</div>
            <div className="text-sm font-bold text-emerald-400 font-mono mt-0.5">
              {calculatedAreaSqKm.toLocaleString()} sq km
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
