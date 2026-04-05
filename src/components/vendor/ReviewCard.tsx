import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';
import { ReviewDocument } from '../../types/review.types';
import { StarRating } from './StarRating';
import { timeAgo } from '../../utils/formatters';

interface ReviewCardProps {
  review: ReviewDocument;
}

export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {review.authorName?.[0]?.toUpperCase() ?? '?'}
          </Text>
        </View>
        <View style={styles.meta}>
          <Text style={styles.name}>{review.authorName}</Text>
          <Text style={styles.time}>{timeAgo(review.createdAt)}</Text>
        </View>
        <StarRating value={review.rating} size={14} />
      </View>
      {review.text ? <Text style={styles.text}>{review.text}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 14, fontWeight: '700', color: Colors.textOnPrimary },
  meta: { flex: 1 },
  name: { fontSize: 14, fontWeight: '600', color: Colors.textPrimary },
  time: { fontSize: 11, color: Colors.textSecondary },
  text: { fontSize: 14, color: Colors.textPrimary, lineHeight: 20, marginLeft: 44 },
});
