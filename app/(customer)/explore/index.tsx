import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useVendors } from '../../../src/hooks/useVendors';
import { useLocation } from '../../../src/hooks/useLocation';
import { VendorCard } from '../../../src/components/vendor/VendorCard';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { Colors } from '../../../src/constants/colors';
import { haversineDistance, formatDistance } from '../../../src/utils/distance';

export default function ExploreScreen() {
  const router = useRouter();
  const { vendors, loading } = useVendors();
  const { coords } = useLocation();
  const [search, setSearch] = useState('');

  const sorted = useMemo(() => {
    let list = vendors;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (v) =>
          v.displayName.toLowerCase().includes(q) ||
          v.category.toLowerCase().includes(q)
      );
    }
    if (coords) {
      list = [...list].sort((a, b) => {
        const da = haversineDistance(coords.lat, coords.lng, a.lat, a.lng);
        const db_ = haversineDistance(coords.lat, coords.lng, b.lat, b.lng);
        return da - db_;
      });
    }
    return list;
  }, [vendors, search, coords]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Vendors Near You</Text>
        <TextInput
          style={styles.search}
          placeholder="Search by name or food type..."
          placeholderTextColor={Colors.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>
      <FlatList
        data={sorted}
        keyExtractor={(item) => item.vendorId}
        renderItem={({ item }) => (
          <VendorCard
            vendor={item}
            distance={
              coords
                ? formatDistance(
                    haversineDistance(coords.lat, coords.lng, item.lat, item.lng)
                  )
                : undefined
            }
            onPress={() => router.push(`/vendor/${item.vendorId}`)}
          />
        )}
        ListEmptyComponent={
          !loading ? (
            <EmptyState
              emoji="🌮"
              title="No vendors live right now"
              subtitle="Check back later or follow your favorite vendors."
            />
          ) : null
        }
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  search: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
