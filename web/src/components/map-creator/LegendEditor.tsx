'use client';

import React from 'react';
import { LegendItem } from '@geoatlas/core';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface LegendEditorProps {
  title: string;
  subtitle: string;
  legendItems: LegendItem[];
  onChangeTitle: (title: string) => void;
  onChangeSubtitle: (subtitle: string) => void;
  onUpdateLegendItem: (id: string, label: string, color: string) => void;
  onAddLegendItem: () => void;
  onRemoveLegendItem: (id: string) => void;
}

export const LegendEditor: React.FC<LegendEditorProps> = ({
  title,
  subtitle,
  legendItems,
  onChangeTitle,
  onChangeSubtitle,
  onUpdateLegendItem,
  onAddLegendItem,
  onRemoveLegendItem,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-4 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2">
        <Layers className="text-blue-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">Map Legend & Headings</h3>
      </div>

      <div className="flex flex-col gap-3">
        <div>
          <label className="text-xs text-slate-400 font-semibold mb-1 block">Map Title</label>
          <Input
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            className="bg-slate-950 border-slate-800 text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 font-semibold mb-1 block">Subtitle / Caption</label>
          <Input
            value={subtitle}
            onChange={(e) => onChangeSubtitle(e.target.value)}
            className="bg-slate-950 border-slate-800 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Legend Key Categories
          </span>
          <Button variant="secondary" size="sm" onClick={onAddLegendItem} className="h-7 text-xs px-2 gap-1">
            <Plus className="w-3 h-3" /> Add Key
          </Button>
        </div>

        {legendItems.map((item) => (
          <div key={item.id} className="flex items-center gap-2 bg-slate-950 p-2 rounded-xl border border-slate-800">
            <input
              type="color"
              value={item.color}
              onChange={(e) => onUpdateLegendItem(item.id, item.label, e.target.value)}
              className="w-6 h-6 rounded border-none cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={item.label}
              onChange={(e) => onUpdateLegendItem(item.id, e.target.value, item.color)}
              className="bg-transparent border-none text-xs text-slate-200 focus:outline-none flex-1 font-medium"
            />
            {legendItems.length > 1 && (
              <button
                onClick={() => onRemoveLegendItem(item.id)}
                className="text-slate-500 hover:text-red-400 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
