'use client';

import React, { useState } from 'react';
import { apiClient } from '@geoatlas/core';
import { Search, Plus, Trash2, Globe, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DETAILED_COUNTRY_PRESETS, DetailedCountryPreset } from '@/lib/country-geometries';

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

  const handleAddPreset = (preset: DetailedCountryPreset) => {
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
        Click a country preset below or search to overlay country boundaries on the map. Click and drag country shapes directly across latitudes to compare true sizes!
      </p>

      {/* High-Detail Preset Buttons */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> High-Precision Country Outlines
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DETAILED_COUNTRY_PRESETS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleAddPreset(preset)}
              className="flex flex-col p-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl text-left transition gap-1 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition">{preset.name}</span>
                <Plus className="w-3 h-3 text-blue-400" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono">{preset.area_sq_km.toLocaleString()} sq km</div>
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
            Click a country preset above or search to add country overlays to the map.
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
