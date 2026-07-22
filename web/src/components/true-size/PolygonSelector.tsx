'use client';

import React, { useState } from 'react';
import { apiClient } from '@geoatlas/core';
import { Search, Plus, Trash2, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export interface OverlayItem {
  id: string;
  name: string;
  color: string;
  geometry: any;
  area_sq_km?: number;
  originCenter: [number, number]; // [lng, lat]
  currentCenter: [number, number]; // [lng, lat]
}

interface PolygonSelectorProps {
  overlays: OverlayItem[];
  onAddOverlay: (overlay: OverlayItem) => void;
  onRemoveOverlay: (id: string) => void;
}

const COLOR_PALETTE = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

// Built-in presets for instant size comparison testing
const PRESET_OVERLAYS = [
  {
    id: 'preset_greenland',
    name: 'Greenland',
    color: '#ef4444',
    area_sq_km: 2166086,
    originCenter: [-42.6, 71.7] as [number, number],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-73.0, 78.0], [-20.0, 82.0], [-18.0, 70.0], [-40.0, 60.0], [-55.0, 60.0], [-73.0, 78.0]
      ]]
    }
  },
  {
    id: 'preset_india',
    name: 'India',
    color: '#3b82f6',
    area_sq_km: 3287263,
    originCenter: [78.9, 20.5] as [number, number],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [68.1, 23.5], [77.0, 35.5], [97.3, 28.0], [88.0, 21.5], [78.0, 8.0], [68.1, 23.5]
      ]]
    }
  },
  {
    id: 'preset_usa',
    name: 'United States',
    color: '#10b981',
    area_sq_km: 9833517,
    originCenter: [-98.5, 39.8] as [number, number],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-124.7, 48.3], [-66.9, 44.8], [-80.0, 25.1], [-117.1, 32.5], [-124.7, 48.3]
      ]]
    }
  },
  {
    id: 'preset_brazil',
    name: 'Brazil',
    color: '#f59e0b',
    area_sq_km: 8515767,
    originCenter: [-51.9, -14.2] as [number, number],
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-73.9, -4.2], [-34.7, -7.5], [-53.1, -33.7], [-70.0, -18.0], [-73.9, -4.2]
      ]]
    }
  }
];

export const PolygonSelector: React.FC<PolygonSelectorProps> = ({
  overlays,
  onAddOverlay,
  onRemoveOverlay,
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.searchPlaces(query, undefined, undefined, 5);
      setSearchResults(res.results);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (item: any) => {
    try {
      const detail = await apiClient.getAdminUnit(item.id);
      const color = COLOR_PALETTE[overlays.length % COLOR_PALETTE.length];
      
      const newOverlay: OverlayItem = {
        id: detail.admin_unit.id,
        name: detail.admin_unit.name,
        color,
        geometry: detail.admin_unit.geometry,
        area_sq_km: detail.admin_unit.area_sq_km,
        originCenter: [78.9629, 20.5937],
        currentCenter: [78.9629, 20.5937],
      };
      onAddOverlay(newOverlay);
      setSearchResults([]);
      setQuery('');
    } catch (err: any) {
      alert(`Could not load geometry for ${item.name}`);
    }
  };

  const handleAddPreset = (preset: typeof PRESET_OVERLAYS[0]) => {
    const color = COLOR_PALETTE[overlays.length % COLOR_PALETTE.length];
    onAddOverlay({
      id: `${preset.id}_${Date.now()}`,
      name: preset.name,
      color,
      geometry: preset.geometry,
      area_sq_km: preset.area_sq_km,
      originCenter: [...preset.originCenter] as [number, number],
      currentCenter: [...preset.originCenter] as [number, number],
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2">
        <Globe className="text-blue-500 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">True Size Overlay Studio</h3>
      </div>
      <p className="text-xs text-slate-400">
        Search or click a preset below to add country outlines. Drag the handles on the map across latitudes to compare true sizes!
      </p>

      {/* Preset Quick Add Buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-400" /> Quick Add Preset Shapes
        </span>
        <div className="grid grid-cols-2 gap-2">
          {PRESET_OVERLAYS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleAddPreset(preset)}
              className="flex items-center justify-between p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition"
            >
              <div>
                <div className="text-xs font-bold text-slate-200">{preset.name}</div>
                <div className="text-[10px] text-slate-400">{preset.area_sq_km.toLocaleString()} sq km</div>
              </div>
              <Plus className="w-3.5 h-3.5 text-blue-400" />
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mt-1">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search custom places..."
            className="pl-9 bg-slate-950 border-slate-800 text-sm"
          />
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          {loading ? '...' : 'Search'}
        </Button>
      </form>

      {searchResults.length > 0 && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-2 max-h-48 overflow-y-auto flex flex-col gap-1">
          {searchResults.map((res) => (
            <button
              key={res.id}
              onClick={() => handleSelect(res)}
              className="flex items-center justify-between p-2 hover:bg-slate-800/60 rounded-lg text-left text-xs transition"
            >
              <span className="font-medium text-slate-200">{res.name}</span>
              <Plus className="w-3.5 h-3.5 text-blue-400" />
            </button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-2 mt-2">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Active Comparison Overlays ({overlays.length})
        </span>
        {overlays.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Click a preset above or search to add country overlays to the map.
          </div>
        ) : (
          overlays.map((ov) => (
            <div
              key={ov.id}
              className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl"
            >
              <div className="flex items-center gap-3">
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: ov.color }}
                />
                <div>
                  <div className="text-xs font-bold text-slate-200">{ov.name}</div>
                  {ov.area_sq_km && (
                    <div className="text-[10px] text-emerald-400 font-mono">
                      {ov.area_sq_km.toLocaleString()} sq km
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => onRemoveOverlay(ov.id)}
                className="text-slate-500 hover:text-red-400 p-1 transition"
                title="Remove Overlay"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
