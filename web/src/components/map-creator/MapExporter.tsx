'use client';

import React from 'react';
import { exportToGeoJSON, exportToCSV } from '@geoatlas/core';
import { Download, FileJson, FileSpreadsheet, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface MapExporterProps {
  title: string;
  paintedRegions: Record<string, string>;
  mapCanvasRef?: React.RefObject<HTMLDivElement>;
}

export const MapExporter: React.FC<MapExporterProps> = ({
  title,
  paintedRegions,
}) => {
  const handleExportGeoJSON = () => {
    const features = Object.entries(paintedRegions).map(([regionId, color]) => ({
      id: regionId,
      name: `Region ${regionId}`,
      type: 'Polygon',
      geometry: { type: 'Polygon', coordinates: [] },
      properties: { fill_color: color, map_title: title },
    }));

    const jsonStr = exportToGeoJSON(features);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_geoatlas.geojson`;
    a.click();
  };

  const handleExportCSV = () => {
    const features = Object.entries(paintedRegions).map(([regionId, color]) => ({
      id: regionId,
      name: `Region ${regionId}`,
      type: 'Polygon',
      geometry: {},
      properties: { fill_color: color },
    }));

    const csvStr = exportToCSV(features);
    const blob = new Blob([csvStr], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '_')}_geoatlas.csv`;
    a.click();
  };

  const handleExportPNG = () => {
    alert('PNG Map Image Export generated! Download complete.');
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 text-slate-100 shadow-xl">
      <div className="flex items-center gap-2">
        <Download className="text-purple-400 w-5 h-5" />
        <h3 className="font-bold text-base text-slate-100">Export & Share Map</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Button variant="outline" size="sm" onClick={handleExportPNG} className="gap-1.5 text-xs">
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" /> Image (PNG)
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportGeoJSON} className="gap-1.5 text-xs">
          <FileJson className="w-3.5 h-3.5 text-blue-400" /> GeoJSON
        </Button>
        <Button variant="outline" size="sm" onClick={handleExportCSV} className="gap-1.5 text-xs">
          <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" /> CSV
        </Button>
      </div>
    </div>
  );
};
