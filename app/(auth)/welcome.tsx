import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TastiButton } from '../../src/components/common/TastiButton';
import { Colors } from '../../src/constants/colors';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>🌮</Text>
        <Text style={styles.title}>Tasti</Text>
        <Text style={styles.subtitle}>
          Discover the best local street vendors{'\n'}in your neighborhood
        </Text>
      </View>

      <View style={styles.actions}>
        <TastiButton
          label="Find Food Near Me"
          onPress={() => router.push({ pathname: '/(auth)/register', params: { role: 'customer' } })}
          variant="primary"
          style={styles.btn}
        />
        <TastiButton
          label="I'm a Vendor — Post My Location"
          onPress={() => router.push({ pathname: '/(auth)/register', params: { role: 'vendor' } })}
          variant="outline"
          style={styles.btn}
        />
        <TastiButton
          label="Sign In"
          onPress={() => router.push('/(auth)/login')}
          variant="secondary"
          style={styles.btn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  logo: { fontSize: 80, marginBottom: 12 },
  title: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
    letterSpacing: -1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  actions: {
    paddingHorizontal: 24,
    gap: 12,
  },
  btn: { width: '100%' },
});
