import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { RecompenseApiDatasource } from '../../../../src/data/datasources/RecompenseApiDatasource';

const datasource = new RecompenseApiDatasource();
const CATEGORIES = [
  { key: 'physique', label: 'Physique', color: '#3B82F6' },
  { key: 'digitale', label: 'Digitale', color: '#10B981' },
  { key: 'bonus', label: 'Bonus', color: '#8B5CF6' },
];

export default function EditerRecompense() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<any>({});

  useEffect(() => {
    (async () => {
      const data = await datasource.getById(id);
      if (data) setForm({ title: data.title, description: data.description, pointsCost: `${data.pointsCost}`, imageUrl: data.imageUrl, stock: `${data.stock}`, category: data.category, statut: data.statut });
      setLoading(false);
    })();
  }, [id]);

  const update = (key: string, value: string) => setForm((f: any) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.title || !form.description) { Alert.alert('Champs requis', 'Titre et description requis.'); return; }
    setSaving(true);
    try {
      await datasource.update(id, { ...form, pointsCost: parseInt(form.pointsCost) || 0, stock: parseInt(form.stock) || 0 });
      Alert.alert('Succès', 'Récompense modifiée.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch { Alert.alert('Erreur', 'Impossible de modifier.'); } finally { setSaving(false); }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={18} color="#F1F5F9" /></TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator size="large" color="#10B981" /></View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}><Ionicons name="arrow-back" size={18} color="#F1F5F9" /></TouchableOpacity>
        <View style={styles.headerCenter}><Text style={styles.title}>Modifier récompense</Text></View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Input label="Titre" value={form.title ?? ''} onChange={(v) => update('title', v)} />
        <Input label="Description" value={form.description ?? ''} onChange={(v) => update('description', v)} multiline />
        <Input label="Coût en points" value={form.pointsCost ?? ''} onChange={(v) => update('pointsCost', v)} keyboardType="number-pad" />
        <Input label="Stock" value={form.stock ?? ''} onChange={(v) => update('stock', v)} keyboardType="number-pad" />

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
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
          {saving ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveBtnText}>Enregistrer</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Input({ label, value, onChange, keyboardType, multiline }: { label: string; value: string; onChange: (v: string) => void; keyboardType?: any; multiline?: boolean }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput style={[styles.input, multiline && { height: 80, textAlignVertical: 'top', paddingTop: 12 }]} value={value} onChangeText={onChange} placeholderTextColor="#475569" keyboardType={keyboardType} multiline={multiline} />
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
  bottomBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#1E2A4A', backgroundColor: '#0F172A' },
  cancelBtn: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#94A3B8' },
  saveBtn: { flex: 2, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981' },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
