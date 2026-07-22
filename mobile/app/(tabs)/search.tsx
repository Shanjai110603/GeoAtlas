import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useInfiniteQuery } from '@tanstack/react-query';
import { apiClient } from '@geoatlas/core';
import { useRouter } from 'expo-router';
import { Search as SearchIcon, MapPin, ChevronRight } from 'lucide-react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [q, setQ] = useState('hospital');

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['mobile_search', q],
    queryFn: ({ pageParam = 0 }) => apiClient.searchPlaces(q, undefined, undefined, 10, pageParam as number),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.offset + lastPage.limit;
      return nextOffset < lastPage.total_hits ? nextOffset : undefined;
    },
    enabled: !!q && q.trim().length > 0,
  });

  const results = data?.pages.flatMap((page) => page.results) || [];
  const totalHits = data?.pages[0]?.total_hits || 0;

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <SearchIcon color="#94a3b8" size={18} style={{ marginRight: 8 }} />
        <TextInput
          style={styles.input}
          value={q}
          onChangeText={setQ}
          placeholder="Search places, hospitals, schools..."
          placeholderTextColor="#64748b"
        />
      </View>

      <Text style={styles.summaryText}>
        Showing <Text style={styles.boldText}>{results.length}</Text> of{' '}
        <Text style={styles.boldText}>{totalHits}</Text> results
      </Text>

      {isLoading ? (
        <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 24 }} />
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.resultCard}
              onPress={() => {
                if (item.entity_type === 'business') {
                  router.push(`/business/${item.id}`);
                } else {
                  router.push(`/place/${item.id}`);
                }
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <MapPin color="#3b82f6" size={16} />
                  <Text style={styles.placeName}>{item.name}</Text>
                </View>
                {item.native_name && (
                  <Text style={styles.nativeName}>({item.native_name})</Text>
                )}
                {item.entity_type && (
                  <Text style={styles.typeBadge}>{item.entity_type}</Text>
                )}
              </View>
              <ChevronRight color="#64748b" size={20} />
            </TouchableOpacity>
          )}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <ActivityIndicator size="small" color="#3b82f6" style={{ marginVertical: 12 }} />
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16', padding: 16 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  input: { flex: 1, color: '#f8fafc', fontSize: 15 },
  summaryText: { fontSize: 12, color: '#94a3b8', marginVertical: 10 },
  boldText: { color: '#f8fafc', fontWeight: 'bold' },
  resultCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1e293b',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  placeName: { fontSize: 15, fontWeight: 'bold', color: '#f8fafc' },
  nativeName: { fontSize: 12, color: '#94a3b8', marginTop: 2 },
  typeBadge: { fontSize: 10, color: '#10b981', marginTop: 4, textTransform: 'uppercase', fontWeight: 'bold' },
});
