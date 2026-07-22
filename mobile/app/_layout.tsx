import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts, NotoSansTamil_400Regular, NotoSansTamil_700Bold } from '@expo-google-fonts/noto-sans-tamil';
import { View, ActivityIndicator } from 'react-native';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSansTamil_400Regular,
    NotoSansTamil_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, backgroundColor: '#090d16', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#f8fafc',
          contentStyle: { backgroundColor: '#090d16' },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="place/[id]" options={{ title: 'Location Detail' }} />
        <Stack.Screen name="business/[id]" options={{ title: 'Business Profile' }} />
        <Stack.Screen name="contribute" options={{ title: 'Submit Edit' }} />
        <Stack.Screen name="moderate" options={{ title: 'Moderation Queue' }} />
        <Stack.Screen name="compare" options={{ title: 'Compare Places' }} />
        <Stack.Screen name="login" options={{ title: 'Sign In' }} />
      </Stack>
    </QueryClientProvider>
  );
}
