import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVendorProfile } from '../../../src/hooks/useVendorProfile';
import { StarRating } from '../../../src/components/vendor/StarRating';
import { TastiButton } from '../../../src/components/common/TastiButton';
import { Colors } from '../../../src/constants/colors';
import { CATEGORY_EMOJI, CATEGORY_LABELS } from '../../../src/constants/categories';

export default function VendorPreviewSheet() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const { vendor, loading } = useVendorProfile(vendorId ?? null);
  const router = useRouter();

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      </SafeAreaView>
    );
  }

  if (!vendor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.notFound}>Vendor not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.dismissBar}>
        <View style={styles.handle} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.row}>
          <View style={styles.avatar}>
            {vendor.profileImageUrl ? (
              <Image
                source={{ uri: vendor.profileImageUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <Text style={styles.avatarEmoji}>
                {CATEGORY_EMOJI[vendor.category]}
              </Text>
            )}
          </View>
          <View style={styles.meta}>
            <Text style={styles.name}>{vendor.displayName}</Text>
            <View style={styles.categoryRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {CATEGORY_LABELS[vendor.category]}
                </Text>
              </View>
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>● LIVE</Text>
              </View>
            </View>
            <View style={styles.ratingRow}>
              <StarRating value={vendor.averageRating} size={14} />
              <Text style={styles.ratingText}>
                {vendor.averageRating.toFixed(1)} ({vendor.reviewCount})
              </Text>
            </View>
          </View>
        </View>

        {vendor.description ? (
          <Text style={styles.description} numberOfLines={3}>
            {vendor.description}
          </Text>
        ) : null}

        <TastiButton
          label="View Full Profile"
          onPress={() => router.push(`/vendor/${vendorId}`)}
          style={styles.cta}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  dismissBar: { alignItems: 'center', paddingVertical: 12 },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
  },
  content: { paddingHorizontal: 24, paddingTop: 8 },
  row: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: { width: 72, height: 72 },
  avatarEmoji: { fontSize: 36 },
  meta: { flex: 1, justifyContent: 'center', gap: 6 },
  name: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary },
  categoryRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  badge: {
    backgroundColor: Colors.surface,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  badgeText: { fontSize: 12, color: Colors.textSecondary, fontWeight: '500' },
  liveBadge: {
    backgroundColor: '#E8F5EE',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveText: { fontSize: 11, color: Colors.live, fontWeight: '700' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingText: { fontSize: 12, color: Colors.textSecondary },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 24,
  },
  cta: { width: '100%' },
  notFound: { textAlign: 'center', marginTop: 40, color: Colors.textSecondary },
});
