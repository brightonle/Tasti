import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/colors';

interface StarRatingProps {
  value: number;
  onChange?: (rating: number) => void;
  size?: number;
}

export function StarRating({ value, onChange, size = 20 }: StarRatingProps) {
  return (
    <View style={styles.row}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity
          key={star}
          onPress={() => onChange?.(star)}
          disabled={!onChange}
          activeOpacity={0.7}
        >
          <Text style={[styles.star, { fontSize: size }]}>
            {star <= value ? '★' : '☆'}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 2 },
  star: { color: Colors.star },
});
