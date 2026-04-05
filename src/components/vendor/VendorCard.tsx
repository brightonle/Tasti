import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors } from '../../constants/colors';
import { CATEGORY_EMOJI, CATEGORY_LABELS } from '../../constants/categories';
import { LocationDocument } from '../../types/vendor.types';
import { StarRating } from './StarRating';

interface VendorCardProps {
  vendor: LocationDocument & { averageRating?: number; reviewCount?: number };
  distance?: string;
  onPress: () => void;
}

export function VendorCard({ vendor, distance, onPress }: VendorCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.avatar}>
        {vendor.profileImageUrl ? (
          <Image source={{ uri: vendor.profileImageUrl }} style={styles.image} />
        ) : (
          <Text style={styles.emoji}>{CATEGORY_EMOJI[vendor.category]}</Text>
        )}
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {vendor.displayName}
        </Text>
        <Text style={styles.category}>{CATEGORY_LABELS[vendor.category]}</Text>
        {vendor.averageRating ? (
          <View style={styles.ratingRow}>
            <StarRating value={vendor.averageRating} size={14} />
            <Text style={styles.ratingText}>
              {vendor.averageRating.toFixed(1)}
            </Text>
          </View>
        ) : null}
      </View>
      <View style={styles.right}>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
        {distance ? (
          <Text style={styles.distance}>{distance}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  image: { width: 52, height: 52 },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  category: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 12, color: Colors.textSecondary },
  right: { alignItems: 'flex-end', gap: 4 },
  liveBadge: {
    backgroundColor: Colors.live,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textOnPrimary,
    letterSpacing: 0.5,
  },
  distance: { fontSize: 12, color: Colors.textSecondary },
});
