'use client';

import React, { useState } from 'react';
import { apiClient } from '@geoatlas/core';
import { Search, Plus, Trash2, Globe, Sparkles, Filter } from 'lucide-react';
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

const COLOR_PALETTE = ['#00f0ff', '#ff007f', '#ffe600', '#00ff66', '#a855f7', '#f97316', '#38bdf8', '#ec4899'];
const CONTINENTS = ['All', 'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania'];

export const PolygonSelector: React.FC<PolygonSelectorProps> = ({
  overlays,
  onAddOverlay,
  onRemoveOverlay,
}) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedContinent, setSelectedContinent] = useState('All');

  const filteredPresets = DETAILED_COUNTRY_PRESETS.filter((p) =>
    selectedContinent === 'All' ? true : p.continent.includes(selectedContinent)
  );

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.searchPlaces(query, undefined, undefined, 6);
      setSearchResults(res.results);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectSearchResult = async (item: any) => {
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
      alert(`Could not load boundary geometry for ${item.name}`);
    }
  };

  const handleAddPreset = async (preset: DetailedCountryPreset) => {
    const color = COLOR_PALETTE[overlays.length % COLOR_PALETTE.length];

    // Query Phase 1 PostGIS DB API for 100% exact official Natural Earth / geoBoundaries MultiPolygon geometry
    try {
      const searchRes = await apiClient.searchPlaces(preset.name, undefined, undefined, 1);
      if (searchRes.results && searchRes.results.length > 0) {
        const detail = await apiClient.getAdminUnit(searchRes.results[0].id);
        if (detail.admin_unit && detail.admin_unit.geometry) {
          onAddOverlay({
            id: `${preset.id}_${Date.now()}`,
            name: detail.admin_unit.name || preset.name,
            color,
            geometry: detail.admin_unit.geometry,
            area_sq_km: detail.admin_unit.area_sq_km || preset.area_sq_km,
            originCenter: [...preset.originCenter] as [number, number],
            currentCenter: [...preset.originCenter] as [number, number],
          });
          return;
        }
      }
    } catch (_) {
      // PostGIS API fallback
    }

    // High-precision embedded preset geometry fallback
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

  const handleSelectDropdownChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    if (!presetId) return;
    const preset = DETAILED_COUNTRY_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      handleAddPreset(preset);
      e.target.value = '';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2">
        <Globe className="text-cyan-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">Worldwide True Size Studio</h3>
      </div>
      <p className="text-xs text-slate-400">
        Select or search any country in the world below. Click and drag country boundaries directly on the map canvas to compare true physical sizes!
      </p>

      {/* Worldwide Country Select Dropdown */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3 h-3 text-cyan-400" /> Select Country from World Catalog
        </label>
        <select
          onChange={handleSelectDropdownChange}
          defaultValue=""
          className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-xl p-2.5 focus:outline-none focus:border-cyan-500 font-medium"
        >
          <option value="" disabled>-- Select a Country to Compare --</option>
          {DETAILED_COUNTRY_PRESETS.map((country) => (
            <option key={country.id} value={country.id}>
              {country.name} ({country.area_sq_km.toLocaleString()} sq km) — {country.continent}
            </option>
          ))}
        </select>
      </div>

      {/* Continent Filter Chips */}
      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Quick Add by Continent
        </span>
        <div className="flex flex-wrap gap-1.5">
          {CONTINENTS.map((cont) => (
            <button
              key={cont}
              onClick={() => setSelectedContinent(cont)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                selectedContinent === cont
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cont}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
          {filteredPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleAddPreset(preset)}
              className="flex items-center justify-between p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition group"
            >
              <div>
                <div className="text-xs font-bold text-slate-200 group-hover:text-cyan-400 transition">{preset.name}</div>
                <div className="text-[10px] text-slate-400 font-mono">{preset.area_sq_km.toLocaleString()} sq km</div>
              </div>
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          ))}
        </div>
      </div>

      {/* Search Input for Custom Places */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search custom places & districts..."
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
              onClick={() => handleSelectSearchResult(res)}
              className="flex items-center justify-between p-2 hover:bg-slate-800/60 rounded-lg text-left text-xs transition"
            >
              <span className="font-medium text-slate-200">{res.name}</span>
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          ))}
        </div>
      )}

      {/* Active Overlays List */}
      <div className="flex flex-col gap-2 mt-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Active Comparison Overlays ({overlays.length})
        </span>
        {overlays.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
            Select a country above or use search to add comparison shapes to the map.
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
