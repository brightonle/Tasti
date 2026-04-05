import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '../../../src/hooks/useAuth';
import { TastiButton } from '../../../src/components/common/TastiButton';
import { Colors } from '../../../src/constants/colors';
import { signOut } from '../../../src/services/firebase/auth.service';

export default function VendorAccountScreen() {
  const { userDoc } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Account</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userDoc?.displayName?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{userDoc?.displayName}</Text>
        <Text style={styles.email}>{userDoc?.email}</Text>
        <View style={styles.vendorBadge}>
          <Text style={styles.vendorBadgeText}>🌮 Vendor</Text>
        </View>
      </View>

      <TastiButton
        label="Sign Out"
        onPress={signOut}
        variant="outline"
        style={styles.signOut}
      />
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
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: { fontSize: 30, fontWeight: '700', color: Colors.textOnPrimary },
  name: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  email: { fontSize: 14, color: Colors.textSecondary },
  vendorBadge: {
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 4,
  },
  vendorBadgeText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  signOut: { marginTop: 'auto', width: '100%' },
});
