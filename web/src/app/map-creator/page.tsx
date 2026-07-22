'use client';

import React, { useState } from 'react';
import { ColorPalettePicker } from '@/components/map-creator/ColorPalettePicker';
import { LegendEditor } from '@/components/map-creator/LegendEditor';
import { MapExporter } from '@/components/map-creator/MapExporter';
import { MapPainter } from '@/components/map-creator/MapPainter';
import { createDefaultMapState, LegendItem } from '@geoatlas/core';

export default function MapCreatorPage() {
  const defaultState = createDefaultMapState();
  const [title, setTitle] = useState(defaultState.title);
  const [subtitle, setSubtitle] = useState(defaultState.subtitle);
  const [activeColor, setActiveColor] = useState(defaultState.activeColor);
  const [paintedRegions, setPaintedRegions] = useState<Record<string, string>>({});
  const [legendItems, setLegendItems] = useState<LegendItem[]>(defaultState.legendItems);

  const handlePaintRegion = (regionId: string, color: string) => {
    setPaintedRegions((prev) => ({
      ...prev,
      [regionId]: color,
    }));
  };

  const handleUpdateLegendItem = (id: string, label: string, color: string) => {
    setLegendItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label, color } : item))
    );
  };

  const handleAddLegendItem = () => {
    const newId = (legendItems.length + 1).toString();
    setLegendItems((prev) => [
      ...prev,
      { id: newId, label: `Category ${newId}`, color: '#3b82f6' },
    ]);
  };

  const handleRemoveLegendItem = (id: string) => {
    setLegendItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <ColorPalettePicker
            activeColor={activeColor}
            onSelectColor={setActiveColor}
          />

          <LegendEditor
            title={title}
            subtitle={subtitle}
            legendItems={legendItems}
            onChangeTitle={setTitle}
            onChangeSubtitle={setSubtitle}
            onUpdateLegendItem={handleUpdateLegendItem}
            onAddLegendItem={handleAddLegendItem}
            onRemoveLegendItem={handleRemoveLegendItem}
          />

          <MapExporter
            title={title}
            paintedRegions={paintedRegions}
          />
        </div>

        <div className="lg:col-span-8 h-[650px] lg:h-auto">
          <MapPainter
            title={title}
            subtitle={subtitle}
            activeColor={activeColor}
            paintedRegions={paintedRegions}
            legendItems={legendItems}
            onPaintRegion={handlePaintRegion}
          />
        </div>
      </main>
    </div>
  );
}
