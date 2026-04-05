import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '../../../src/hooks/useAuth';
import { useVendorProfile } from '../../../src/hooks/useVendorProfile';
import { useLocation } from '../../../src/hooks/useLocation';
import { goLive, goOffline } from '../../../src/services/firebase/location.service';
import { Colors } from '../../../src/constants/colors';

export default function VendorDashboard() {
  const { user, userDoc } = useAuth();
  const { vendor } = useVendorProfile(user?.uid ?? null);
  const { getCurrentLocation } = useLocation();
  const [actionLoading, setActionLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLive = vendor?.isLive ?? false;

  useEffect(() => {
    if (isLive) {
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setElapsed(0);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isLive]);

  function formatElapsed(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? `${h}h ` : ''}${m}m ${s}s`;
  }

  async function handleToggleLive() {
    if (!user || !vendor) return;
    setActionLoading(true);
    try {
      if (isLive) {
        await goOffline(user.uid);
      } else {
        const coords = await getCurrentLocation();
        if (!coords) {
          Alert.alert('Location required', 'Please enable location to go live.');
          return;
        }
        await goLive(
          user.uid,
          coords.lat,
          coords.lng,
          `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`,
          vendor.category,
          vendor.displayName,
          vendor.profileImageUrl
        );
      }
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setActionLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.name}>{vendor?.displayName ?? userDoc?.displayName}</Text>

      <View style={styles.statusCard}>
        <View style={[styles.statusDot, isLive && styles.statusDotLive]} />
        <Text style={styles.statusText}>
          {isLive ? 'You\'re live! Customers can find you.' : 'You\'re offline.'}
        </Text>
        {isLive ? (
          <Text style={styles.elapsed}>{formatElapsed(elapsed)}</Text>
        ) : null}
      </View>

      {isLive && vendor?.liveLocation ? (
        <View style={styles.locationCard}>
          <Text style={styles.locationLabel}>Current location</Text>
          <Text style={styles.locationText}>{vendor.liveLocation.address}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        style={[styles.liveButton, isLive && styles.liveButtonActive]}
        onPress={handleToggleLive}
        disabled={actionLoading}
        activeOpacity={0.85}
      >
        {actionLoading ? (
          <ActivityIndicator color={Colors.textOnPrimary} />
        ) : (
          <>
            <Text style={styles.liveButtonEmoji}>{isLive ? '⏹' : '📍'}</Text>
            <Text style={styles.liveButtonLabel}>
              {isLive ? 'Go Offline' : 'Go Live'}
            </Text>
            <Text style={styles.liveButtonSub}>
              {isLive ? 'End today\'s session' : 'Let customers find you now'}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 24,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    gap: 10,
    marginBottom: 16,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.offline,
  },
  statusDotLive: { backgroundColor: Colors.live },
  statusText: { flex: 1, fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  elapsed: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  locationCard: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 16,
    marginBottom: 32,
  },
  locationLabel: { fontSize: 11, color: Colors.textSecondary, marginBottom: 4 },
  locationText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  liveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: 'center',
    marginTop: 'auto',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  liveButtonActive: { backgroundColor: Colors.error },
  liveButtonEmoji: { fontSize: 36, marginBottom: 8 },
  liveButtonLabel: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textOnPrimary,
    marginBottom: 4,
  },
  liveButtonSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)' },
});
