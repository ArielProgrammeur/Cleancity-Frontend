import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius } from '../../../core/theme/spacing';

const PRODUCT_CATEGORIES = [
  { id: 'plastic' as const, label: 'Plastique', icon: 'water-outline' as const, color: '#2563EB' },
  { id: 'glass' as const, label: 'Verre', icon: 'wine-outline' as const, color: '#059669' },
  { id: 'paper' as const, label: 'Papier', icon: 'newspaper-outline' as const, color: '#D97706' },
  { id: 'electronics' as const, label: 'Électronique', icon: 'laptop-outline' as const, color: '#7C3AED' },
  { id: 'textile' as const, label: 'Textile', icon: 'shirt-outline' as const, color: '#DB2777' },
  { id: 'metal' as const, label: 'Métal', icon: 'hammer-outline' as const, color: '#6B7280' },
  { id: 'organic' as const, label: 'Organique', icon: 'leaf-outline' as const, color: '#16A34A' },
  { id: 'battery' as const, label: 'Batterie', icon: 'battery-charging-outline' as const, color: '#DC2626' },
];

export default function CreateListingScreen() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = () => {
    if (!selectedCategory || !quantity || !price || !location) {
      Alert.alert('Missing Fields', 'Please fill in all required fields.');
      return;
    }
    Alert.alert(
      'Listing Created!',
      `Your listing has been published.\n\nCategory: ${PRODUCT_CATEGORIES.find((c) => c.id === selectedCategory)?.label}\nQuantity: ${quantity} kg\nPrice: €${price}/kg`,
      [{ text: 'OK', onPress: () => router.back() }],
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Stack.Screen options={{ title: 'Create Listing', headerTintColor: colors.primary }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryGrid}>
          {PRODUCT_CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryCard,
                { borderColor: selectedCategory === cat.id ? cat.color : colors.border },
                selectedCategory === cat.id && { backgroundColor: cat.color + '10' },
              ]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons name={cat.icon} size={24} color={selectedCategory === cat.id ? cat.color : colors.textSecondary} />
              <Text style={[styles.categoryLabel, selectedCategory === cat.id && { color: cat.color, fontWeight: '700' }]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Quantity (kg) *</Text>
              <TextInput
                style={styles.input}
                value={quantity}
                onChangeText={setQuantity}
                keyboardType="decimal-pad"
                placeholder="0.0"
                placeholderTextColor={colors.divider}
              />
            </View>
            <View style={[styles.field, { flex: 1 }]}>
              <Text style={styles.label}>Price (€/kg) *</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor={colors.divider}
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Location *</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="Street, city"
              placeholderTextColor={colors.divider}
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your waste material..."
              placeholderTextColor={colors.divider}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Estimated Total</Text>
          {selectedCategory && quantity && price && (
            <Text style={styles.summaryValue}>
              €{(parseFloat(quantity) * parseFloat(price)).toFixed(2)}
            </Text>
          )}
          {(!selectedCategory || !quantity || !price) && (
            <Text style={styles.summaryPlaceholder}>Select category, quantity and price</Text>
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Ionicons name="checkmark-circle" size={20} color={colors.white} />
          <Text style={styles.submitText}>Publish Listing</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { padding: spacing.md, paddingBottom: spacing.xxl },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  categoryCard: { width: '23%', aspectRatio: 1, borderRadius: borderRadius.lg, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface, gap: spacing.xs },
  categoryLabel: { fontSize: 10, fontWeight: '600', color: colors.textSecondary, textAlign: 'center' },
  form: { marginTop: spacing.lg },
  row: { flexDirection: 'row', gap: spacing.sm },
  field: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSecondary, marginBottom: spacing.xs },
  input: { backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: 14, borderRadius: borderRadius.md, fontSize: 16, color: colors.textPrimary, borderWidth: 1, borderColor: colors.border },
  bioInput: { minHeight: 80, textAlignVertical: 'top' },
  summary: { backgroundColor: '#F0FDF4', padding: spacing.md, borderRadius: borderRadius.lg, marginTop: spacing.md, alignItems: 'center' },
  summaryTitle: { fontSize: 14, fontWeight: '600', color: colors.textSecondary },
  summaryValue: { fontSize: 32, fontWeight: '800', color: colors.primary, marginTop: spacing.xs },
  summaryPlaceholder: { fontSize: 14, color: colors.textSecondary, marginTop: spacing.xs },
  submitButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, paddingVertical: 16, borderRadius: borderRadius.lg, marginTop: spacing.lg, gap: spacing.sm },
  submitText: { fontSize: 16, fontWeight: '700', color: colors.white },
  cancelButton: { alignItems: 'center', marginTop: spacing.sm, paddingVertical: spacing.sm },
  cancelText: { fontSize: 15, fontWeight: '600', color: colors.textSecondary },
});
