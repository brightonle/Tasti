import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../../src/hooks/useAuth';
import { useVendors } from '../../../src/hooks/useVendors';
import { VendorCard } from '../../../src/components/vendor/VendorCard';
import { EmptyState } from '../../../src/components/common/EmptyState';
import { Colors } from '../../../src/constants/colors';

export default function FavoritesScreen() {
  const router = useRouter();
  const { userDoc } = useAuth();
  const { vendors } = useVendors();
  const favorites = userDoc?.favorites ?? [];

  const favoriteVendors = vendors.filter((v) =>
    favorites.includes(v.vendorId)
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      <FlatList
        data={favoriteVendors}
        keyExtractor={(item) => item.vendorId}
        renderItem={({ item }) => (
          <VendorCard
            vendor={item}
            onPress={() => router.push(`/vendor/${item.vendorId}`)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            emoji="🤍"
            title="No favorites yet"
            subtitle="Tap the heart on any vendor profile to save them here."
          />
        }
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
});
