import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Modal,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVendors } from '../../../src/hooks/useVendors';
import { VendorCategory, LocationDocument } from '../../../src/types/vendor.types';
import { Colors } from '../../../src/constants/colors';
import { CATEGORY_EMOJI, CATEGORY_LABELS, VENDOR_CATEGORIES } from '../../../src/constants/categories';

// Pin layout — scattered positions across the map canvas
const PIN_POSITIONS = [
  { top: '18%', left: '22%' },
  { top: '28%', left: '55%' },
  { top: '38%', left: '35%' },
  { top: '15%', left: '68%' },
  { top: '50%', left: '18%' },
  { top: '45%', left: '62%' },
  { top: '60%', left: '40%' },
  { top: '32%', left: '78%' },
];

export default function MapScreen() {
  const router = useRouter();
  const { vendors } = useVendors();
  const [categoryFilter, setCategoryFilter] = useState<VendorCategory | 'all'>('all');
  const [listVisible, setListVisible] = useState(false);

  const filtered =
    categoryFilter === 'all'
      ? vendors
      : vendors.filter((v) => v.category === categoryFilter);

  return (
    <View style={styles.container}>
      {/* ── Map area ── */}
      <View style={styles.map}>
        {filtered.map((vendor, i) => {
          const pos = PIN_POSITIONS[i % PIN_POSITIONS.length];
          return (
            <TouchableOpacity
              key={vendor.vendorId}
              style={[styles.pinWrap, pos as any]}
              onPress={() => router.push(`/(customer)/map/${vendor.vendorId}`)}
              activeOpacity={0.85}
            >
              <View style={styles.pin}>
                <Text style={styles.pinEmoji}>{CATEGORY_EMOJI[vendor.category]}</Text>
              </View>
              <View style={styles.pinTip} />
              <View style={styles.pinLabel}>
                <Text style={styles.pinLabelText} numberOfLines={1}>
                  {vendor.displayName}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {filtered.length === 0 && (
          <View style={styles.emptyMap}>
            <Text style={styles.emptyMapText}>No vendors live in this area</Text>
          </View>
        )}
      </View>

      {/* ── Filter chips (top overlay) ── */}
      <SafeAreaView style={styles.topOverlay} pointerEvents="box-none">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
          style={styles.filterBar}
        >
          <FilterChip
            label="All"
            active={categoryFilter === 'all'}
            onPress={() => setCategoryFilter('all')}
          />
          {VENDOR_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat}
              label={`${CATEGORY_EMOJI[cat]} ${CATEGORY_LABELS[cat]}`}
              active={categoryFilter === cat}
              onPress={() => setCategoryFilter(cat)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* ── View List floating button ── */}
      <TouchableOpacity style={styles.viewListBtn} onPress={() => setListVisible(true)}>
        <Text style={styles.viewListIcon}>≡</Text>
        <Text style={styles.viewListText}>View List</Text>
      </TouchableOpacity>

      {/* ── List modal ── */}
      <Modal
        visible={listVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setListVisible(false)}
      >
        <View style={styles.modal}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHandle} />
            <Text style={styles.modalTitle}>
              {filtered.length} vendor{filtered.length !== 1 ? 's' : ''} live now
            </Text>
            <TouchableOpacity onPress={() => setListVisible(false)} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item.vendorId}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listRow}
                onPress={() => {
                  setListVisible(false);
                  router.push(`/(customer)/map/${item.vendorId}`);
                }}
                activeOpacity={0.8}
              >
                <View style={styles.listAvatar}>
                  <Text style={styles.listEmoji}>{CATEGORY_EMOJI[item.category]}</Text>
                </View>
                <View style={styles.listInfo}>
                  <Text style={styles.listName}>{item.displayName}</Text>
                  <Text style={styles.listCategory}>{CATEGORY_LABELS[item.category]}</Text>
                </View>
                <View style={styles.liveBadge}>
                  <View style={styles.liveDot} />
                  <Text style={styles.liveText}>Live</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.chip, active && styles.chipActive]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  // Map
  map: {
    flex: 1,
    backgroundColor: '#E2ECD9',
    position: 'relative',
  },
  emptyMap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMapText: { color: '#9CA3AF', fontSize: 14 },

  // Pins
  pinWrap: {
    position: 'absolute',
    alignItems: 'center',
  },
  pin: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },
  pinEmoji: { fontSize: 24 },
  pinTip: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 10,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: Colors.primary,
    marginTop: -1,
  },
  pinLabel: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 3,
    maxWidth: 100,
  },
  pinLabelText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  // Top filter bar
  topOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  filterBar: {
    marginTop: 8,
  },
  filterScroll: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipTextActive: {
    color: '#fff',
  },

  // View List button
  viewListBtn: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  viewListIcon: { fontSize: 16, color: '#fff', fontWeight: '700' },
  viewListText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  // List modal
  modal: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: 'center',
  },
  modalHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  closeBtn: {
    position: 'absolute',
    right: 20,
    top: 20,
    padding: 4,
  },
  closeBtnText: { fontSize: 16, color: Colors.textSecondary },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 40 },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 14,
  },
  listAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#E8F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listEmoji: { fontSize: 24 },
  listInfo: { flex: 1 },
  listName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: 3 },
  listCategory: { fontSize: 13, color: Colors.textSecondary },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#E8F5EE',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: Colors.live },
  liveText: { fontSize: 12, fontWeight: '600', color: Colors.live },
});
