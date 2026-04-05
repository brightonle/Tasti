import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../../src/hooks/useAuth';
import { useVendorProfile } from '../../../src/hooks/useVendorProfile';
import { TastiInput } from '../../../src/components/common/TastiInput';
import { TastiButton } from '../../../src/components/common/TastiButton';
import { Colors } from '../../../src/constants/colors';
import { updateVendorProfile } from '../../../src/services/firebase/vendor.service';
import { uploadImage } from '../../../src/services/firebase/storage.service';
import {
  VENDOR_CATEGORIES,
  CATEGORY_LABELS,
  CATEGORY_EMOJI,
} from '../../../src/constants/categories';
import { VendorCategory } from '../../../src/types/vendor.types';

export default function EditProfileScreen() {
  const { user } = useAuth();
  const { vendor, loading } = useVendorProfile(user?.uid ?? null);

  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<VendorCategory>('other');
  const [phone, setPhone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (vendor) {
      setDisplayName(vendor.displayName);
      setDescription(vendor.description);
      setCategory(vendor.category);
      setPhone(vendor.phone ?? '');
      setInstagram(vendor.instagramHandle ?? '');
      setProfileImage(vendor.profileImageUrl);
    }
  }, [vendor]);

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      setProfileImage(result.assets[0].uri);
    }
  }

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      let imageUrl = vendor?.profileImageUrl ?? null;
      if (profileImage && profileImage !== vendor?.profileImageUrl) {
        imageUrl = await uploadImage(
          `vendors/${user.uid}/profile.jpg`,
          profileImage
        );
      }
      await updateVendorProfile(user.uid, {
        displayName: displayName.trim(),
        description: description.trim(),
        category,
        phone: phone.trim() || null,
        instagramHandle: instagram.trim() || null,
        profileImageUrl: imageUrl,
      });
      Alert.alert('Saved', 'Your profile has been updated.');
    } catch (e) {
      Alert.alert('Error', 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 60 }} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Edit Profile</Text>

        <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarPlaceholderText}>📷{'\n'}Add Photo</Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <Text style={styles.editBadgeText}>Edit</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.form}>
          <TastiInput
            label="Business Name"
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="e.g. Rosa's Tacos"
          />
          <TastiInput
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Tell customers what makes your food special..."
            style={{ height: 100, paddingTop: 12 }}
          />

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {VENDOR_CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.catChip, category === cat && styles.catChipActive]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.catEmoji}>{CATEGORY_EMOJI[cat]}</Text>
                <Text
                  style={[
                    styles.catLabel,
                    category === cat && styles.catLabelActive,
                  ]}
                >
                  {CATEGORY_LABELS[cat]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TastiInput
            label="Phone (optional)"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="+1 (213) 000-0000"
          />
          <TastiInput
            label="Instagram (optional)"
            value={instagram}
            onChangeText={setInstagram}
            autoCapitalize="none"
            placeholder="@youraccount"
          />
        </View>

        <TastiButton
          label="Save Profile"
          onPress={handleSave}
          loading={saving}
          style={styles.saveBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { padding: 24 },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 24,
  },
  avatarPicker: {
    alignSelf: 'center',
    marginBottom: 24,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textSecondary,
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  editBadgeText: { fontSize: 11, color: Colors.textOnPrimary, fontWeight: '600' },
  form: { gap: 16 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  catChipActive: {
    borderColor: Colors.primary,
    backgroundColor: '#E8F5EE',
  },
  catEmoji: { fontSize: 16 },
  catLabel: { fontSize: 13, fontWeight: '500', color: Colors.textSecondary },
  catLabelActive: { color: Colors.primary },
  saveBtn: { width: '100%', marginTop: 24 },
});
