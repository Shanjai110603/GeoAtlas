export interface SpatialFeature {
  id: string;
  name: string;
  type: string;
  geometry: any;
  properties: Record<string, any>;
}

export function exportToGeoJSON(features: SpatialFeature[]): string {
  const geojson = {
    type: 'FeatureCollection',
    features: features.map((f) => ({
      type: 'Feature',
      id: f.id,
      properties: { name: f.name, ...f.properties },
      geometry: f.geometry,
    })),
  };
  return JSON.stringify(geojson, null, 2);
}

export function parseGeoJSON(jsonString: string): SpatialFeature[] {
  try {
    const parsed = JSON.parse(jsonString);
    const rawFeatures = parsed.type === 'FeatureCollection' ? parsed.features : [parsed];
    return rawFeatures.map((f: any, idx: number) => ({
      id: f.id || `feature_${idx + 1}`,
      name: f.properties?.name || f.properties?.NAME || `Feature ${idx + 1}`,
      type: f.geometry?.type || 'Unknown',
      geometry: f.geometry,
      properties: f.properties || {},
    }));
  } catch (err: any) {
    throw new Error(`Invalid GeoJSON format: ${err.message}`);
  }
}

export function exportToCSV(features: SpatialFeature[]): string {
  const headers = ['id', 'name', 'type', 'properties'];
  const rows = features.map((f) => [
    `"${f.id}"`,
    `"${f.name.replace(/"/g, '""')}"`,
    `"${f.type}"`,
    `"${JSON.stringify(f.properties).replace(/"/g, '""')}"`,
  ]);
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
