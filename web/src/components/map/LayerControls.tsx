'use client';

import React, { useState } from 'react';
import { Layers, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react';

export interface LayerControlsProps {
  activeLayers: Record<string, boolean>;
  onToggleLayer: (layerId: string) => void;
}

export const LayerControls: React.FC<LayerControlsProps> = ({ activeLayers, onToggleLayer }) => {
  const [collapsed, setCollapsed] = useState(true);

  const layersList = [
    { id: 'countries', label: 'Country Boundaries (Zoom 0-5)' },
    { id: 'states', label: 'State & District Boundaries (Zoom 5-10)' },
    { id: 'districts', label: 'Local Entity Details (Zoom 10+)' },
    { id: 'hospitals', label: 'Hospitals & Medical' },
    { id: 'schools', label: 'Schools & Universities' },
    { id: 'businesses', label: 'Business Directory' },
  ];

  return (
    <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-all text-xs w-64">
      <button
        onClick={() => setCollapsed((v) => !v)}
        className="w-full px-3.5 py-2.5 flex items-center justify-between font-semibold text-slate-200 hover:bg-slate-900/60 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Layers size={14} className="text-blue-400" />
          Map Layers
        </span>
        {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      {!collapsed && (
        <div className="p-3 border-t border-slate-800/80 flex flex-col gap-2 bg-slate-900/40">
          {layersList.map((layer) => {
            const isActive = !!activeLayers[layer.id];
            return (
              <label
                key={layer.id}
                className="flex items-center justify-between cursor-pointer text-slate-300 hover:text-slate-100 p-1 rounded hover:bg-slate-800/40 transition-colors"
              >
                <span>{layer.label}</span>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={() => onToggleLayer(layer.id)}
                  className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-blue-500"
                />
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};
