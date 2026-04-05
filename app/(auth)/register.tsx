import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { TastiButton } from '../../src/components/common/TastiButton';
import { TastiInput } from '../../src/components/common/TastiInput';
import { Colors } from '../../src/constants/colors';
import { signUp } from '../../src/services/firebase/auth.service';

export default function RegisterScreen() {
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role: 'customer' | 'vendor' }>();
  const userRole = role ?? 'customer';

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleRegister() {
    if (!displayName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp(email.trim(), password, displayName.trim(), userRole);
    } catch (e: any) {
      setError(e.message ?? 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.kav}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>
              {userRole === 'vendor' ? '🌮 Vendor Account' : '🗺️ Customer Account'}
            </Text>
          </View>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>
            {userRole === 'vendor'
              ? 'Post your location and reach customers nearby.'
              : 'Discover the best street food in your neighborhood.'}
          </Text>

          <View style={styles.form}>
            <TastiInput
              label={userRole === 'vendor' ? 'Vendor / Business Name' : 'Your Name'}
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={userRole === 'vendor' ? 'e.g. Rosa\'s Tacos' : 'e.g. Alex'}
            />
            <TastiInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
            />
            <TastiInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="Min. 6 characters"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <TastiButton
            label="Create Account"
            onPress={handleRegister}
            loading={loading}
            style={styles.btn}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/login')}
            style={styles.link}
          >
            <Text style={styles.linkText}>Already have an account? Sign in</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, padding: 24 },
  back: { marginBottom: 24 },
  backText: { fontSize: 15, color: Colors.primary, fontWeight: '500' },
  roleBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginBottom: 20,
  },
  roleText: { fontSize: 13, fontWeight: '600', color: Colors.primary },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 32,
  },
  form: { gap: 16, marginBottom: 24 },
  error: { fontSize: 13, color: Colors.error },
  btn: { width: '100%', marginBottom: 16 },
  link: { alignSelf: 'center' },
  linkText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
});
