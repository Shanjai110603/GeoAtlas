import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { apiClient } from '@geoatlas/core';

export default function CompareScreen() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    setLoading(true);
    try {
      // Compare Tamil Nadu vs Chennai
      const res = await apiClient.comparePlaces([
        '00000000-0000-0000-0000-000000000001',
        '00000000-0000-0000-0000-000000000002',
      ]);
      setData(res);
    } catch (err: any) {
      alert(`Compare error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Geographic Comparison</Text>
      <Text style={styles.subtitle}>Side-by-side administrative & area metrics</Text>

      <TouchableOpacity style={styles.compareBtn} onPress={handleCompare} disabled={loading}>
        <Text style={styles.compareBtnText}>
          {loading ? 'Fetching...' : 'Run Tamil Nadu vs Chennai Comparison'}
        </Text>
      </TouchableOpacity>

      {data && data.comparison && (
        <View style={styles.table}>
          {data.comparison.map((item: any) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.detail}>Code: {item.country_code} | Level {item.level_number}</Text>
              <Text style={styles.area}>Area: {item.area_sq_km ? `${item.area_sq_km} sq km` : 'N/A'}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc' },
  subtitle: { fontSize: 12, color: '#94a3b8' },
  compareBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 14, alignItems: 'center' },
  compareBtnText: { color: '#f8fafc', fontWeight: 'bold', fontSize: 14 },
  table: { gap: 8, marginTop: 8 },
  row: { backgroundColor: '#0f172a', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#1e293b', gap: 4 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  detail: { fontSize: 12, color: '#94a3b8' },
  area: { fontSize: 14, fontWeight: 'bold', color: '#10b981' },
});
