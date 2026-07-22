export interface GeoJsonGeometry {
  type: 'Point' | 'Polygon' | 'MultiPolygon';
  coordinates: any;
}

export interface GisAnalysisResult {
  operation: 'buffer' | 'intersect' | 'union' | 'distance' | 'area';
  outputGeometry?: GeoJsonGeometry;
  distanceKm?: number;
  areaSqKm?: number;
  perimeterKm?: number;
}

// Geodesic Haversine Distance (in kilometers)
export function computeDistance(pointA: [number, number], pointB: [number, number]): number {
  const R = 6371; // Earth's mean radius in km
  const rad = Math.PI / 180;
  const dLat = (pointB[1] - pointA[1]) * rad;
  const dLng = (pointB[0] - pointA[0]) * rad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(pointA[1] * rad) * Math.cos(pointB[1] * rad) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c * 100) / 100;
}

// Geodesic Buffer Ring Generation (N km radius around center point [lng, lat])
export function computeBuffer(
  centerPoint: [number, number],
  radiusKm: number,
  steps: number = 32
): GeoJsonGeometry {
  const R = 6371;
  const rad = Math.PI / 180;
  const lat = centerPoint[1] * rad;
  const lng = centerPoint[0] * rad;
  const d = radiusKm / R;

  const ring: number[][] = [];

  for (let i = 0; i <= steps; i++) {
    const bearing = (i * 360) / steps * rad;
    const bLat = Math.asin(
      Math.sin(lat) * Math.cos(d) + Math.cos(lat) * Math.sin(d) * Math.cos(bearing)
    );
    const bLng =
      lng +
      Math.atan2(
        Math.sin(bearing) * Math.sin(d) * Math.cos(lat),
        Math.cos(d) - Math.sin(lat) * Math.sin(bLat)
      );

    ring.push([bLng / rad, bLat / rad]);
  }

  return {
    type: 'Polygon',
    coordinates: [ring],
  };
}

// Approximate Geodesic Surface Area of a Polygon (in sq km)
export function computeGeodesicArea(geometry: GeoJsonGeometry): number {
  const R = 6371;
  const rad = Math.PI / 180;

  const calculateRingArea = (ring: number[][]) => {
    let area = 0;
    if (ring.length < 3) return 0;

    for (let i = 0; i < ring.length - 1; i++) {
      const p1 = ring[i];
      const p2 = ring[i + 1];
      area += (p2[0] - p1[0]) * rad * (2 + Math.sin(p1[1] * rad) + Math.sin(p2[1] * rad));
    }

    return Math.abs((area * R * R) / 2);
  };

  if (geometry.type === 'Polygon') {
    return Math.round(calculateRingArea(geometry.coordinates[0]));
  } else if (geometry.type === 'MultiPolygon') {
    let total = 0;
    for (const poly of geometry.coordinates) {
      total += calculateRingArea(poly[0]);
    }
    return Math.round(total);
  }

  return 0;
}

// Spatial Union Envelope of two GeoJSON Polygons
export function computeUnion(polyA: GeoJsonGeometry, polyB: GeoJsonGeometry): GeoJsonGeometry {
  const ringsA = polyA.type === 'Polygon' ? [polyA.coordinates[0]] : polyA.coordinates.map((p: any) => p[0]);
  const ringsB = polyB.type === 'Polygon' ? [polyB.coordinates[0]] : polyB.coordinates.map((p: any) => p[0]);

  return {
    type: 'MultiPolygon',
    coordinates: [ringsA, ringsB],
  };
}
