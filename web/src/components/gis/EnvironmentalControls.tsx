'use client';

import React from 'react';
import { CloudRain, Wind, Activity, Radio } from 'lucide-react';

interface EnvironmentalControlsProps {
  showRadar: boolean;
  setShowRadar: (show: boolean) => void;
  showAqi: boolean;
  setShowAqi: (show: boolean) => void;
  showEarthquakes: boolean;
  setShowEarthquakes: (show: boolean) => void;
}

export const EnvironmentalControls: React.FC<EnvironmentalControlsProps> = ({
  showRadar,
  setShowRadar,
  showAqi,
  setShowAqi,
  showEarthquakes,
  setShowEarthquakes,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2.5">
        <Radio className="text-amber-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">Live Environmental Overlays</h3>
      </div>

      <div className="flex flex-col gap-2">
        {/* Weather Radar Toggle */}
        <button
          onClick={() => setShowRadar(!showRadar)}
          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition ${
            showRadar
              ? 'bg-blue-600/20 border-blue-500/40 text-blue-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CloudRain className="w-4 h-4 text-blue-400" />
            <span>Precipitation & Weather Radar</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold">{showRadar ? 'ON' : 'OFF'}</span>
        </button>

        {/* Air Quality Index (AQI) Toggle */}
        <button
          onClick={() => setShowAqi(!showAqi)}
          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition ${
            showAqi
              ? 'bg-emerald-600/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Wind className="w-4 h-4 text-emerald-400" />
            <span>Air Quality Index (AQI Sensors)</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold">{showAqi ? 'ON' : 'OFF'}</span>
        </button>

        {/* Seismic / USGS Earthquakes Toggle */}
        <button
          onClick={() => setShowEarthquakes(!showEarthquakes)}
          className={`flex items-center justify-between p-3 rounded-xl border text-xs font-medium transition ${
            showEarthquakes
              ? 'bg-red-600/20 border-red-500/40 text-red-300'
              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <Activity className="w-4 h-4 text-red-400" />
            <span>USGS Real-Time Seismic Alerts</span>
          </div>
          <span className="font-mono text-[10px] uppercase font-bold">{showEarthquakes ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </div>
  );
};
