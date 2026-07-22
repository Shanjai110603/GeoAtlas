import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { apiClient } from '@geoatlas/core';
import * as ImagePicker from 'expo-image-picker';
import { Building2, Camera, Star } from 'lucide-react-native';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  useEffect(() => {
    async function loadBusiness() {
      if (!id) return;
      try {
        const res = await apiClient.getBusiness(id as string);
        setData(res);
      } catch (_) {} finally {
        setLoading(false);
      }
    }
    loadBusiness();
  }, [id]);

  const handlePickAndUploadPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert('Camera roll permission required to upload storefront photo.');
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });

    if (pickerResult.canceled || !pickerResult.assets?.[0]) return;

    const asset = pickerResult.assets[0];
    setUploading(true);

    try {
      // Step 1: Presigned URL from Phase 1 API
      const presign = await apiClient.getPresignedPhotoUrl(
        id as string,
        asset.fileName || 'storefront.jpg',
        'image/jpeg'
      );

      // Step 2: Upload directly to MinIO
      const imageResponse = await fetch(asset.uri);
      const blob = await imageResponse.blob();

      await fetch(presign.upload_url, {
        method: 'PUT',
        headers: { 'Content-Type': 'image/jpeg' },
        body: blob,
      });

      setUploadSuccess(true);
    } catch (err: any) {
      alert(`Upload error: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={{ color: '#ef4444' }}>Business profile not found.</Text>
      </View>
    );
  }

  const { business, reviews } = data;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Building2 color="#3b82f6" size={28} />
        <Text style={styles.title}>{business.name}</Text>
      </View>

      <TouchableOpacity
        style={styles.uploadBtn}
        onPress={handlePickAndUploadPhoto}
        disabled={uploading}
      >
        <Camera color="#f8fafc" size={18} />
        <Text style={styles.uploadBtnText}>
          {uploading ? 'Uploading to MinIO...' : 'Upload Storefront Photo (Presigned)'}
        </Text>
      </TouchableOpacity>

      {uploadSuccess && (
        <View style={styles.successBadge}>
          <Text style={styles.successText}>Photo uploaded! Moderation Pending.</Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>Customer Reviews ({reviews ? reviews.length : 0})</Text>

      {reviews && reviews.map((rev: any) => (
        <View key={rev.id} style={styles.reviewCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={styles.reviewerName}>{rev.display_name || 'Anonymous'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
              <Star color="#f59e0b" size={14} fill="#f59e0b" />
              <Text style={styles.ratingText}>{rev.rating}</Text>
            </View>
          </View>
          <Text style={styles.reviewText}>{rev.text}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16, gap: 14 },
  loadingContainer: { flex: 1, backgroundColor: '#090d16', justifyContent: 'center', alignItems: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', flex: 1 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#2563eb', padding: 14, borderRadius: 14 },
  uploadBtnText: { color: '#f8fafc', fontWeight: 'bold', fontSize: 14 },
  successBadge: { backgroundColor: '#064e3b', padding: 10, borderRadius: 10, borderWidth: 1, borderColor: '#065f46' },
  successText: { color: '#34d399', fontSize: 12, textAlign: 'center', fontWeight: 'bold' },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc', marginTop: 10 },
  reviewCard: { backgroundColor: '#0f172a', padding: 14, borderRadius: 14, borderWidth: 1, borderColor: '#1e293b', gap: 6 },
  reviewerName: { color: '#f8fafc', fontWeight: 'bold', fontSize: 13 },
  ratingText: { color: '#f59e0b', fontWeight: 'bold', fontSize: 12 },
  reviewText: { color: '#cbd5e1', fontSize: 12 },
});
