import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { loginMobile } from '../src/lib/auth-mobile';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('moderator@geoatlas.org');
  const [password, setPassword] = useState('geoatlas_secret');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await loginMobile(email, password);
      alert('Logged in successfully! Token stored in OS SecureStore.');
      router.replace('/(tabs)');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sign In to GeoAtlas</Text>
      <Text style={styles.subtitle}>Storefront photos, contributions & moderation</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#64748b"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#64748b"
      />

      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
        <Text style={styles.loginBtnText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#090d16' },
  content: { padding: 16, gap: 12, justifyContent: 'center', minHeight: 400 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#f8fafc' },
  subtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 8 },
  errorText: { color: '#ef4444', fontSize: 12, backgroundColor: '#450a0a', padding: 8, borderRadius: 8 },
  label: { color: '#cbd5e1', fontSize: 12, fontWeight: 'bold', marginTop: 4 },
  input: { backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderRadius: 12, padding: 12, color: '#f8fafc', fontSize: 14 },
  loginBtn: { backgroundColor: '#2563eb', padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 12 },
  loginBtnText: { color: '#f8fafc', fontWeight: 'bold', fontSize: 14 },
});
