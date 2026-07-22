import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { apiClient } from '@geoatlas/core';
import { MapView } from '../../src/components/map/MapView';
import { cachePlace, getCachedPlace } from '../../src/lib/offline-cache';
import { MapPin, Globe } from 'lucide-react-native';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      setLoading(true);

      // Check SQLite 24h read cache first
      const cached = await getCachedPlace(id as string);
      if (cached) {
        setData(cached);
        setIsCached(true);
        setLoading(false);
      }

      // Fetch fresh network data
      try {
        const fresh = await apiClient.getAdminUnit(id as string);
        setData(fresh.admin_unit);
        setIsCached(false);
        await cachePlace(id as string, fresh.admin_unit);
      } catch (_) {
        try {
          const freshEntity = await apiClient.getEntity(id as string);
          setData(freshEntity.entity);
          setIsCached(false);
          await cachePlace(id as string, freshEntity.entity);
        } catch (_) {}
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading geographic data...</Text>
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Location data not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MapPin color="#3b82f6" size={24} />
          <Text style={styles.title}>{data.name}</Text>
        </View>

        {data.native_name && (
          <Text style={styles.nativeTitle}>({data.native_name})</Text>
        )}

        <View style={styles.metaRow}>
          {data.country_code && (
            <View style={styles.badge}>
              <Globe color="#3b82f6" size={12} />
              <Text style={styles.badgeText}>{data.country_code}</Text>
            </View>
          )}
          {data.local_term && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{data.local_term}</Text>
            </View>
          )}
          {isCached && (
            <View style={[styles.badge, { borderColor: '#10b981' }]}>
              <Text style={[styles.badgeText, { color: '#10b981' }]}>SQLite Offline Cached</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView zoom={8} results={[data]} />
      </View>

      {data.area_sq_km && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Total Surface Area</Text>
          <Text style={styles.cardValue}>{data.area_sq_km.toLocaleString()} sq km</Text>
        </View>
      )}

      {data.attributes && (
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Spatial Attributes</Text>
          <Text style={styles.jsonText}>{JSON.stringify(data.attributes, null, 2)}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16, gap: 16 },
  loadingContainer: { flex: 1, backgroundColor: '#090d16', justifyContent: 'center', alignItems: 'center' },
  loadingText: { color: '#94a3b8', marginTop: 8, fontSize: 13 },
  errorText: { color: '#ef4444', fontSize: 14 },
  header: { gap: 6 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#f8fafc' },
  nativeTitle: { fontSize: 16, color: '#94a3b8', fontFamily: 'NotoSansTamil_400Regular' },
  metaRow: { flexDirection: 'row', gap: 8, marginTop: 4 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b' },
  badgeText: { fontSize: 11, color: '#94a3b8', fontFamily: 'mono' },
  mapContainer: { height: 260, borderRadius: 16, overflow: 'hidden' },
  card: { backgroundColor: '#0f172a', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1e293b' },
  cardLabel: { fontSize: 11, color: '#94a3b8', uppercase: true, fontWeight: 'bold' },
  cardValue: { fontSize: 18, color: '#f8fafc', fontWeight: 'bold', marginTop: 4 },
  jsonText: { fontSize: 11, color: '#94a3b8', fontFamily: 'mono', marginTop: 6 },
});
