import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ImagePicker } from '../components/ImagePicker';
import { CategorySelector } from '../components/CategorySelector';
import type { ReportCategory } from '../data/categories';

export function ReportScreen() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePickImage = () => {
    Alert.alert('Take Photo', 'Camera and gallery will be available with expo-image-picker');
  };

  const handleSelectCategory = (cat: ReportCategory) => {
    setSelectedCategory(cat.id);
  };

  const canSubmit = selectedCategory && description.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    // Simuler l'envoi (Firebase plus tard)
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert('Report Submitted', 'Thank you for helping keep your city clean!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.title}>Report Waste</Text>
          <View style={styles.backButton} />
        </View>

        <Text style={styles.subtitle}>
          Help us keep the city clean by reporting waste
        </Text>

        <ImagePicker imageUri={imageUri} onPick={handlePickImage} />
        <CategorySelector selected={selectedCategory} onSelect={handleSelectCategory} />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe what you see..."
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.locationCard}>
          <Ionicons name="location-outline" size={20} color="#2E7D32" />
          <View style={styles.locationInfo}>
            <Text style={styles.locationLabel}>Current Location</Text>
            <Text style={styles.locationValue}>
              Auto-detected when you submit
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={!canSubmit || isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="send" size={18} color="white" style={styles.sendIcon} />
              <Text style={styles.submitText}>Submit Report</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
  },
  field: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  textArea: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    fontSize: 16,
    color: '#111827',
    height: 120,
  },
  locationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  locationInfo: {
    marginLeft: 12,
    flex: 1,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#166534',
  },
  locationValue: {
    fontSize: 13,
    color: '#4ADE80',
    marginTop: 2,
  },
  submitButton: {
    backgroundColor: '#2E7D32',
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  sendIcon: {
    marginRight: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
