import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export interface MapViewProps {
  center?: [number, number]; // [lng, lat]
  zoom?: number;
  results?: any[];
}

export const MapView: React.FC<MapViewProps> = ({
  center = [78.9629, 20.5937],
  zoom = 4,
  results = [],
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.title}>MapLibre Native Vector Layer</Text>
        <Text style={styles.subtitle}>
          Center: {center[1].toFixed(2)}, {center[0].toFixed(2)} | Zoom: {zoom}
        </Text>
        <Text style={styles.details}>
          Vector Tile Server: Martin (http://10.0.2.2:3001)
        </Text>
        <Text style={styles.thresholds}>
          Layer Thresholds: Zoom 0-5 (Country) | 5-10 (States) | 10+ (POIs)
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#0f172a',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
  },
  title: {
    color: '#3b82f6',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: 12,
    marginBottom: 4,
  },
  details: {
    color: '#64748b',
    fontSize: 11,
    marginBottom: 4,
  },
  thresholds: {
    color: '#10b981',
    fontSize: 11,
    fontWeight: '600',
  },
});
