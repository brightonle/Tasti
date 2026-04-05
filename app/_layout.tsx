import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import { MapProvider } from '../src/context/MapContext';

function RootLayoutNav() {
  const { role, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inCustomerGroup = segments[0] === '(customer)';
    const inVendorGroup = segments[0] === '(vendor)';

    if (role === 'customer' && !inCustomerGroup) {
      router.replace('/(customer)/map');
    } else if (role === 'vendor' && !inVendorGroup) {
      router.replace('/(vendor)/dashboard');
    }
  }, [role, loading, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(customer)" />
      <Stack.Screen name="(vendor)" />
      <Stack.Screen name="vendor/[vendorId]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <AuthProvider>
        <MapProvider>
          <RootLayoutNav />
        </MapProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
});
