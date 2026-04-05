import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TastiButton } from '../../src/components/common/TastiButton';
import { TastiInput } from '../../src/components/common/TastiInput';
import { Colors } from '../../src/constants/colors';
import { resetPassword } from '../../src/services/firebase/auth.service';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  async function handleReset() {
    if (!email) { setError('Enter your email.'); return; }
    setLoading(true);
    setError('');
    try {
      await resetPassword(email.trim());
      setSent(true);
    } catch (e: any) {
      setError(e.message ?? 'Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <TouchableOpacity onPress={() => router.back()} style={styles.back}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Reset password</Text>

        {sent ? (
          <View style={styles.successBox}>
            <Text style={styles.successText}>
              ✅ Check your email for a reset link.
            </Text>
            <TastiButton
              label="Back to Sign In"
              onPress={() => router.replace('/(auth)/login')}
              style={{ marginTop: 16 }}
            />
          </View>
        ) : (
          <>
            <Text style={styles.subtitle}>
              We'll send a reset link to your email.
            </Text>
            <TastiInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="you@example.com"
              style={{ marginBottom: 8 }}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TastiButton
              label="Send Reset Link"
              onPress={handleReset}
              loading={loading}
              style={{ marginTop: 16, width: '100%' }}
            />
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  inner: { padding: 24 },
  back: { marginBottom: 32 },
  backText: { fontSize: 15, color: Colors.primary, fontWeight: '500' },
  title: { fontSize: 28, fontWeight: '800', color: Colors.textPrimary, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 24 },
  error: { fontSize: 13, color: Colors.error },
  successBox: { marginTop: 24 },
  successText: { fontSize: 16, color: Colors.textPrimary },
});
