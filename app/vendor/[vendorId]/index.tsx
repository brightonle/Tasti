import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useVendorProfile } from '../../../src/hooks/useVendorProfile';
import { useReviews } from '../../../src/hooks/useReviews';
import { useAuth } from '../../../src/hooks/useAuth';
import { useFavorites } from '../../../src/hooks/useFavorites';
import { StarRating } from '../../../src/components/vendor/StarRating';
import { ReviewCard } from '../../../src/components/vendor/ReviewCard';
import { TagChip } from '../../../src/components/common/TagChip';
import { Colors } from '../../../src/constants/colors';
import { CATEGORY_EMOJI, CATEGORY_LABELS } from '../../../src/constants/categories';

export default function VendorProfileScreen() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const { vendor, loading } = useVendorProfile(vendorId ?? null);
  const { reviews } = useReviews(vendorId ?? null);
  const { user, role } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();

  const isOwnProfile = user?.uid === vendorId;
  const favorited = vendorId ? isFavorite(vendorId) : false;

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 80 }} />
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

  const previewReviews = reviews.slice(0, 3);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          {role === 'customer' && !isOwnProfile && user ? (
            <TouchableOpacity
              onPress={() => toggleFavorite(user.uid, vendorId!)}
              style={styles.favoriteBtn}
            >
              <Text style={styles.favoriteEmoji}>{favorited ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Profile header */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            {vendor.profileImageUrl ? (
              <Image
                source={{ uri: vendor.profileImageUrl }}
                style={styles.avatar}
              />
            ) : (
              <Text style={styles.avatarEmoji}>
                {CATEGORY_EMOJI[vendor.category]}
              </Text>
            )}
          </View>
          <View style={styles.nameRow}>
            <Text style={styles.vendorName}>{vendor.displayName}</Text>
            {vendor.isLive ? (
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>● LIVE</Text>
              </View>
            ) : null}
          </View>
          <View style={styles.tagRow}>
            <TagChip label={CATEGORY_LABELS[vendor.category]} />
            {vendor.tags.map((tag) => (
              <TagChip key={tag} label={tag} />
            ))}
          </View>
          <View style={styles.ratingRow}>
            <StarRating value={vendor.averageRating} size={18} />
            <Text style={styles.ratingLabel}>
              {vendor.averageRating.toFixed(1)} · {vendor.reviewCount} reviews
            </Text>
          </View>
        </View>

        {/* Description */}
        {vendor.description ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{vendor.description}</Text>
          </View>
        ) : null}

        {/* Social links */}
        {(vendor.phone || vendor.instagramHandle) ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact</Text>
            <View style={styles.socialRow}>
              {vendor.phone ? (
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() => Linking.openURL(`tel:${vendor.phone}`)}
                >
                  <Text style={styles.socialBtnText}>📞 Call</Text>
                </TouchableOpacity>
              ) : null}
              {vendor.instagramHandle ? (
                <TouchableOpacity
                  style={styles.socialBtn}
                  onPress={() =>
                    Linking.openURL(
                      `https://instagram.com/${vendor.instagramHandle?.replace('@', '')}`
                    )
                  }
                >
                  <Text style={styles.socialBtnText}>
                    📸 {vendor.instagramHandle}
                  </Text>
                </TouchableOpacity>
              ) : null}
            </View>
          </View>
        ) : null}

        {/* Reviews */}
        <View style={styles.section}>
          <View style={styles.reviewsHeader}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            {reviews.length > 3 ? (
              <TouchableOpacity
                onPress={() => router.push(`/vendor/${vendorId}/reviews`)}
              >
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            ) : null}
          </View>
          {previewReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {role === 'customer' && !isOwnProfile ? (
            <TouchableOpacity
              style={styles.writeReviewBtn}
              onPress={() => router.push(`/vendor/${vendorId}/reviews`)}
            >
              <Text style={styles.writeReviewText}>Write a review ✏️</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  backBtn: { padding: 8 },
  backText: { fontSize: 24, color: Colors.textPrimary },
  favoriteBtn: { padding: 8 },
  favoriteEmoji: { fontSize: 26 },
  profileSection: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 24 },
  avatarWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 16,
  },
  avatar: { width: 100, height: 100 },
  avatarEmoji: { fontSize: 48 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  vendorName: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  liveBadge: {
    backgroundColor: '#E8F5EE',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  liveText: { fontSize: 12, color: Colors.live, fontWeight: '700' },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ratingLabel: { fontSize: 14, color: Colors.textSecondary },
  section: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  description: { fontSize: 15, color: Colors.textSecondary, lineHeight: 22 },
  socialRow: { flexDirection: 'row', gap: 12 },
  socialBtn: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  socialBtnText: { fontSize: 14, color: Colors.textPrimary, fontWeight: '500' },
  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  writeReviewBtn: {
    marginTop: 12,
    padding: 14,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  writeReviewText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  notFound: { textAlign: 'center', marginTop: 60, color: Colors.textSecondary },
});
