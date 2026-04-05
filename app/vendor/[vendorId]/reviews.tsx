import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReviews } from '../../../src/hooks/useReviews';
import { useAuth } from '../../../src/hooks/useAuth';
import { ReviewCard } from '../../../src/components/vendor/ReviewCard';
import { StarRating } from '../../../src/components/vendor/StarRating';
import { TastiInput } from '../../../src/components/common/TastiInput';
import { TastiButton } from '../../../src/components/common/TastiButton';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { Colors } from '../../../src/constants/colors';
import { createReview } from '../../../src/services/firebase/review.service';

export default function ReviewsScreen() {
  const { vendorId } = useLocalSearchParams<{ vendorId: string }>();
  const { reviews, loading } = useReviews(vendorId ?? null);
  const { user, userDoc, role } = useAuth();
  const router = useRouter();

  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const alreadyReviewed = reviews.some((r) => r.authorId === user?.uid);

  async function handleSubmit() {
    if (!user || !userDoc || !vendorId) return;
    if (rating < 1) { Alert.alert('Select a rating'); return; }
    setSubmitting(true);
    try {
      await createReview(vendorId, {
        authorId: user.uid,
        authorName: userDoc.displayName,
        authorAvatarUrl: userDoc.avatarUrl,
        rating,
        text: text.trim(),
      });
      setText('');
      setRating(5);
      Alert.alert('Thanks!', 'Your review has been posted.');
    } catch {
      Alert.alert('Error', 'Failed to post review.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Reviews</Text>
      </View>

      {role === 'customer' && !alreadyReviewed ? (
        <View style={styles.writeBox}>
          <Text style={styles.writeTitle}>Leave a review</Text>
          <StarRating value={rating} onChange={setRating} size={30} />
          <TastiInput
            value={text}
            onChangeText={setText}
            placeholder="Share your experience..."
            multiline
            numberOfLines={3}
            style={{ height: 80, paddingTop: 12, marginTop: 12 }}
          />
          <TastiButton
            label="Post Review"
            onPress={handleSubmit}
            loading={submitting}
            style={{ marginTop: 12 }}
          />
        </View>
      ) : null}

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={reviews}
          keyExtractor={(item) => item.id ?? item.authorId}
          renderItem={({ item }) => <ReviewCard review={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <EmptyState
              emoji="⭐"
              title="No reviews yet"
              subtitle="Be the first to review this vendor."
            />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 4 },
  back: { fontSize: 15, color: Colors.primary, fontWeight: '500', marginBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.textPrimary },
  writeBox: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  writeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  list: { paddingHorizontal: 16, paddingBottom: 40 },
});
