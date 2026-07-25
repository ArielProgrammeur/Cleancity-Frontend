import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecompenseApiDatasource } from '../../../src/data/datasources/RecompenseApiDatasource';

const datasource = new RecompenseApiDatasource();
const CATEGORIES = [
  { key: 'physique', label: 'Physique', color: '#3B82F6' },
  { key: 'digitale', label: 'Digitale', color: '#10B981' },
  { key: 'bonus', label: 'Bonus', color: '#8B5CF6' },
];
const ICONS = ['water', 'bag', 'card', 'leaf', 'museum', 'thermometer', 'hammer', 'pricetag', 'shirt', 'gift'];

interface FormData {
  title: string; description: string; pointsCost: string; imageUrl: string;
  stock: string; category: string; statut: 'active' | 'inactive';
}

export default function CreerRecompense() {
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormData>({
    title: '', description: '', pointsCost: '', imageUrl: 'gift',
    stock: '10', category: 'physique', statut: 'active',
  });

  const update = (key: keyof FormData, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title || !form.description || !form.pointsCost) {
      Alert.alert('Champs requis', 'Titre, description et coût en points sont requis.');
      return;
    }
    setSaving(true);
    try {
      await datasource.create({
        title: form.title, description: form.description,
        pointsCost: parseInt(form.pointsCost) || 0, imageUrl: form.imageUrl,
        stock: parseInt(form.stock) || 0, category: form.category as any, statut: form.statut,
      });
      Alert.alert('Succès', 'Récompense créée.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Erreur', 'Impossible de créer.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}><Text style={styles.title}>Nouvelle récompense</Text></View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Input label="Titre" value={form.title} onChange={(v) => update('title', v)} placeholder="Bouteille réutilisable" />
        <Input label="Description" value={form.description} onChange={(v) => update('description', v)} placeholder="Description détaillée..." multiline />
        <Input label="Coût en points" value={form.pointsCost} onChange={(v) => update('pointsCost', v)} placeholder="300" keyboardType="number-pad" />
        <Input label="Stock" value={form.stock} onChange={(v) => update('stock', v)} placeholder="10" keyboardType="number-pad" />

        <Text style={styles.fieldLabel}>Catégorie</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {CATEGORIES.map((c) => {
            const isActive = form.category === c.key;
            return (
              <TouchableOpacity key={c.key} style={[styles.chip, isActive && { backgroundColor: c.color + '20', borderColor: c.color }]} onPress={() => update('category', c.key)}>
                <Text style={[styles.chipText, isActive && { color: c.color, fontWeight: '700' }]}>{c.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.fieldLabel}>Icône</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
          {ICONS.map((icon) => {
            const isActive = form.imageUrl === icon;
            return (
              <TouchableOpacity key={icon} style={[styles.iconPicker, isActive && { backgroundColor: '#10B98120', borderColor: '#10B981' }]} onPress={() => update('imageUrl', icon)}>
                <Ionicons name={icon as any} size={20} color={isActive ? '#10B981' : '#6B7AA8'} />
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
          {saving ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveBtnText}>Créer</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Input({ label, value, onChange, placeholder, keyboardType, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; keyboardType?: any; multiline?: boolean;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.input, multiline && { height: 80, textAlignVertical: 'top', paddingTop: 12 }]} value={value} onChangeText={onChange} placeholder={placeholder} placeholderTextColor="#475569" keyboardType={keyboardType} multiline={multiline} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#F1F5F9' },
  fieldLabel: { fontSize: 11, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6, marginTop: 12 },
  inputGroup: { marginBottom: 4 },
  input: { backgroundColor: '#0F172A', borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, fontWeight: '600', color: '#F1F5F9', borderWidth: 1, borderColor: '#1E2A4A' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2A4A' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  iconPicker: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E2A4A' },
  bottomBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#1E2A4A', backgroundColor: '#0F172A' },
  cancelBtn: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#94A3B8' },
  saveBtn: { flex: 2, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981' },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
