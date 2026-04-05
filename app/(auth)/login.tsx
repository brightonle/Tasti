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
import { useRouter } from 'expo-router';
import { TastiButton } from '../../src/components/common/TastiButton';
import { TastiInput } from '../../src/components/common/TastiInput';
import { Colors } from '../../src/constants/colors';
import { signIn } from '../../src/services/firebase/auth.service';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      setError(e.message ?? 'Failed to sign in.');
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

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to your Tasti account</Text>

          <View style={styles.form}>
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
              placeholder="••••••••"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </View>

          <TastiButton
            label="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={styles.btn}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/forgot-password')}
            style={styles.link}
          >
            <Text style={styles.linkText}>Forgot password?</Text>
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
  back: { marginBottom: 32 },
  backText: { fontSize: 15, color: Colors.primary, fontWeight: '500' },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
  },
  subtitle: { fontSize: 15, color: Colors.textSecondary, marginBottom: 32 },
  form: { gap: 16, marginBottom: 24 },
  error: { fontSize: 13, color: Colors.error },
  btn: { width: '100%', marginBottom: 16 },
  link: { alignSelf: 'center' },
  linkText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
});
