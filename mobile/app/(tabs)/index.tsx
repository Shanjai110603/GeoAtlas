import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MapView } from '../../src/components/map/MapView';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.headerTitle}>GeoAtlas Mobile</Text>
      <Text style={styles.headerSubtitle}>Wikipedia for Geography (Android Edition)</Text>

      <View style={styles.mapContainer}>
        <MapView zoom={4} />
      </View>

      <View style={styles.actionsGrid}>
        <TouchableOpacity
          style={[styles.card, { borderColor: '#3b82f6' }]}
          onPress={() => router.push('/search?q=Tamil+Nadu')}
        >
          <Text style={styles.cardTitle}>Explore India / Tamil Nadu</Text>
          <Text style={styles.cardDesc}>Browse district boundaries & spatial features</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderColor: '#10b981' }]}
          onPress={() => router.push('/compare')}
        >
          <Text style={styles.cardTitle}>Geographic Comparison</Text>
          <Text style={styles.cardDesc}>Compare surface area & admin levels</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { borderColor: '#a855f7' }]}
          onPress={() => router.push('/contribute')}
        >
          <Text style={styles.cardTitle}>Submit Edit</Text>
          <Text style={styles.cardDesc}>Add or correct geographic features</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16, gap: 16 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#f8fafc' },
  headerSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
  mapContainer: { height: 260, borderRadius: 16, overflow: 'hidden' },
  actionsGrid: { gap: 12, marginTop: 8 },
  card: {
    backgroundColor: '#0f172a',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  cardDesc: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
});
