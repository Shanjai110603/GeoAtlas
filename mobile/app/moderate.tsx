import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { apiClient } from '@geoatlas/core';

export default function ModerateScreen() {
  const [items, setItems] = useState<any[]>([
    {
      id: '11111111-1111-1111-1111-111111111111',
      target_table: 'entities',
      diff: { name: 'Apollo Speciality Hospital', native_name: 'அபோலோ சிறப்பு மருத்துவமனை' },
      status: 'pending',
    },
  ]);

  const handleAction = async (id: string, action: 'approve' | 'reject') => {
    try {
      await apiClient.reviewContribution(id, action);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: action === 'approve' ? 'approved' : 'rejected' } : item))
      );
    } catch (err: any) {
      alert(`Review error: ${err.message}`);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Moderator Review Queue</Text>

      {items.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.itemHeader}>Edit #{item.id.substring(0, 8)} ({item.status})</Text>
          <Text style={styles.diffText}>{JSON.stringify(item.diff, null, 2)}</Text>

          {item.status === 'pending' && (
            <View style={styles.btnRow}>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#065f46' }]}
                onPress={() => handleAction(item.id, 'approve')}
              >
                <Text style={{ color: '#34d399', fontWeight: 'bold', fontSize: 12 }}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: '#991b1b' }]}
                onPress={() => handleAction(item.id, 'reject')}
              >
                <Text style={{ color: '#fca5a5', fontWeight: 'bold', fontSize: 12 }}>Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', marginBottom: 6 },
  card: { backgroundColor: '#0f172a', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#1e293b', gap: 8 },
  itemHeader: { color: '#f8fafc', fontWeight: 'bold', fontSize: 13 },
  diffText: { color: '#34d399', fontFamily: 'mono', fontSize: 11, backgroundColor: '#020617', padding: 8, borderRadius: 8 },
  btnRow: { flexDirection: 'row', gap: 10, marginTop: 4 },
  btn: { flex: 1, padding: 10, borderRadius: 10, alignItems: 'center' },
});
