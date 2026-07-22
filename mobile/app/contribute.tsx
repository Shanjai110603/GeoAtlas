import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { apiClient, contributionSchema } from '@geoatlas/core';
import { useRouter } from 'expo-router';

export default function ContributeScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [nativeName, setNativeName] = useState('');
  const [source, setSource] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    const valid = contributionSchema.safeParse({
      target_table: 'entities',
      name,
      native_name: nativeName,
      source,
    });

    if (!valid.success) {
      setError(valid.error.errors[0]?.message || 'Invalid form input');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.submitContribution(
        'entities',
        null,
        { name, native_name: nativeName },
        source || 'mobile_android_client'
      );
      if (res.contribution && res.contribution.id) {
        alert('Contribution submitted to moderation queue!');
        router.push('/(tabs)');
      }
    } catch (err: any) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Submit Geographic Edit</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.label}>Location Name (English)</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g. Apollo Hospital"
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Native Name (Local Script)</Text>
      <TextInput
        style={styles.input}
        value={nativeName}
        onChangeText={setNativeName}
        placeholder="e.g. அபோலோ மருத்துவமனை"
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Data Source / Provenance</Text>
      <TextInput
        style={styles.input}
        value={source}
        onChangeText={setSource}
        placeholder="e.g. Field Survey / OSM"
        placeholderTextColor="#64748b"
      />

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleSubmit}
        disabled={submitting}
      >
        <Text style={styles.submitBtnText}>
          {submitting ? 'Submitting...' : 'Submit to Moderation Queue'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16, gap: 12 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#f8fafc', marginBottom: 6 },
  errorText: { color: '#ef4444', fontSize: 12, backgroundColor: '#450a0a', padding: 8, borderRadius: 8 },
  label: { color: '#cbd5e1', fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 12, color: '#f8fafc', fontSize: 14 },
  submitBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  submitBtnText: { color: '#f8fafc', fontWeight: 'bold', fontSize: 14 },
});
