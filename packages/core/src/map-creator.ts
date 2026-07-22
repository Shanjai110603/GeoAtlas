export interface LegendItem {
  id: string;
  label: string;
  color: string;
}

export interface MapCreatorState {
  title: string;
  subtitle: string;
  activeColor: string;
  paintedRegions: Record<string, string>; // regionId -> hexColor
  legendItems: LegendItem[];
}

export const PRESET_COLOR_PALETTES = [
  { name: 'Vibrant Modern', colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'] },
  { name: 'Oceanic Blue', colors: ['#0284c7', '#0369a1', '#075985', '#0c4a6e', '#38bdf8', '#7dd3fc'] },
  { name: 'Emerald Forest', colors: ['#059669', '#047857', '#065f46', '#064e3b', '#34d399', '#6ee7b7'] },
  { name: 'Sunset Warmth', colors: ['#ea580c', '#c2410c', '#9a3412', '#7c2d12', '#fb923c', '#ffedd5'] },
];

export function createDefaultMapState(): MapCreatorState {
  return {
    title: 'Custom Regional Map',
    subtitle: 'Created with GeoAtlas Map Creator',
    activeColor: PRESET_COLOR_PALETTES[0].colors[0],
    paintedRegions: {},
    legendItems: [
      { id: '1', label: 'Category A', color: PRESET_COLOR_PALETTES[0].colors[0] },
      { id: '2', label: 'Category B', color: PRESET_COLOR_PALETTES[0].colors[1] },
      { id: '3', label: 'Category C', color: PRESET_COLOR_PALETTES[0].colors[2] },
    ],
  };
}
