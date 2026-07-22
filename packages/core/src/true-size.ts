export interface GeoPolygon {
  type: string;
  coordinates: number[][][] | number[][][][];
}

export function computeGeodesicScaleFactor(originLat: number, targetLat: number): number {
  const rad = Math.PI / 180;
  const cosOrigin = Math.cos(originLat * rad);
  const cosTarget = Math.cos(targetLat * rad);
  if (cosOrigin === 0) return 1;
  return cosTarget / cosOrigin;
}

export function transformPolygonLatitude(
  geometry: GeoPolygon,
  originCenter: [number, number], // [lng, lat]
  targetCenter: [number, number]  // [lng, lat]
): GeoPolygon {
  const scale = computeGeodesicScaleFactor(originCenter[1], targetCenter[1]);
  const deltaLng = targetCenter[0] - originCenter[0];
  const deltaLat = targetCenter[1] - originCenter[1];

  const scaleCoordinates = (ring: number[][]) =>
    ring.map(([lng, lat]) => {
      // Offset from origin center, scale geodesically, then add target center offset
      const relLng = (lng - originCenter[0]) * scale;
      const relLat = (lat - originCenter[1]) * scale;
      return [originCenter[0] + deltaLng + relLng, originCenter[1] + deltaLat + relLat];
    });

  if (geometry.type === 'Polygon') {
    return {
      type: 'Polygon',
      coordinates: (geometry.coordinates as number[][][]).map(scaleCoordinates),
    };
  } else if (geometry.type === 'MultiPolygon') {
    return {
      type: 'MultiPolygon',
      coordinates: (geometry.coordinates as number[][][][]).map((poly) =>
        poly.map(scaleCoordinates)
      ),
    };
  }

  return geometry;
}
