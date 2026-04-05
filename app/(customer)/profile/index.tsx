import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../../src/hooks/useAuth';
import { TastiButton } from '../../../src/components/common/TastiButton';
import { Colors } from '../../../src/constants/colors';
import { signOut } from '../../../src/services/firebase/auth.service';

export default function CustomerProfileScreen() {
  const { userDoc } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {userDoc?.displayName?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{userDoc?.displayName}</Text>
          <Text style={styles.email}>{userDoc?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notification Radius</Text>
          <Text style={styles.rowValue}>{userDoc?.notifyRadiusKm ?? 5} km</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Notifications</Text>
          <Text style={styles.rowValue}>
            {userDoc?.notificationsEnabled ? 'On' : 'Off'}
          </Text>
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
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, fontWeight: '700', color: Colors.textOnPrimary },
  info: { flex: 1 },
  name: { fontSize: 17, fontWeight: '700', color: Colors.textPrimary },
  email: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rowLabel: { fontSize: 15, color: Colors.textPrimary },
  rowValue: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  signOut: { marginTop: 'auto' },
});
