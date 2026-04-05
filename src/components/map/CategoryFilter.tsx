import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { TagChip } from '../common/TagChip';
import {
  VENDOR_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_EMOJI,
} from '../../constants/categories';
import { VendorCategory } from '../../types/vendor.types';

interface CategoryFilterProps {
  selected: VendorCategory | 'all';
  onChange: (cat: VendorCategory | 'all') => void;
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <TagChip
          label="All"
          active={selected === 'all'}
          onPress={() => onChange('all')}
        />
        {VENDOR_CATEGORIES.map((cat) => (
          <TagChip
            key={cat}
            label={`${CATEGORY_EMOJI[cat]} ${CATEGORY_LABELS[cat]}`}
            active={selected === cat}
            onPress={() => onChange(cat)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 56,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
