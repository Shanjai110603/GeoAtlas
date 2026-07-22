'use client';

import React from 'react';
import { PRESET_COLOR_PALETTES } from '@geoatlas/core';
import { Palette } from 'lucide-react';

interface ColorPalettePickerProps {
  activeColor: string;
  onSelectColor: (color: string) => void;
}

export const ColorPalettePicker: React.FC<ColorPalettePickerProps> = ({
  activeColor,
  onSelectColor,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2">
        <Palette className="text-emerald-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">Color Palette & Painting Tool</h3>
      </div>

      <div className="flex items-center gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
        <span className="text-xs text-slate-400 font-medium">Active Paint Color:</span>
        <input
          type="color"
          value={activeColor}
          onChange={(e) => onSelectColor(e.target.value)}
          className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
        />
        <span className="font-mono text-xs text-emerald-400 font-bold uppercase">{activeColor}</span>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Curated Harmonious Palettes
        </span>
        {PRESET_COLOR_PALETTES.map((pal) => (
          <div key={pal.name} className="flex flex-col gap-1.5">
            <span className="text-[11px] text-slate-300 font-medium">{pal.name}</span>
            <div className="flex gap-2">
              {pal.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => onSelectColor(c)}
                  className={`w-7 h-7 rounded-lg border transition ${
                    activeColor.toLowerCase() === c.toLowerCase()
                      ? 'border-white scale-110 shadow-lg'
                      : 'border-white/20 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
