'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { PolygonSelector, OverlayItem } from '@/components/true-size/PolygonSelector';
import { TrueSizeCanvas } from '@/components/true-size/TrueSizeCanvas';

export default function TrueSizePage() {
  const [overlays, setOverlays] = useState<OverlayItem[]>([]);

  const handleAddOverlay = (newOverlay: OverlayItem) => {
    setOverlays((prev) => [...prev.filter((o) => o.id !== newOverlay.id), newOverlay]);
  };

  const handleRemoveOverlay = (id: string) => {
    setOverlays((prev) => prev.filter((o) => o.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 flex flex-col gap-6">
          <PolygonSelector
            overlays={overlays}
            onAddOverlay={handleAddOverlay}
            onRemoveOverlay={handleRemoveOverlay}
          />
        </div>

        <div className="lg:col-span-8 h-[650px] lg:h-auto">
          <TrueSizeCanvas overlays={overlays} />
        </div>
      </main>
    </div>
  );
}
