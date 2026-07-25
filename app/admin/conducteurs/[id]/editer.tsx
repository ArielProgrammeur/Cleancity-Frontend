import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConducteurApiDatasource } from '../../../../src/data/datasources/ConducteurApiDatasource';
import type { Conducteur } from '../../../../src/domain/entities/Conducteur';

const datasource = new ConducteurApiDatasource();

const ZONES = ['Douala Nord', 'Douala Sud', 'Douala Centre', 'Douala Ouest', 'Douala Est', 'Bonapriso', 'Akwa', 'Bassa'];

export default function EditerConducteur() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Conducteur>>({});

  useEffect(() => {
    (async () => {
      const data = await datasource.getById(id);
      if (data) {
        setForm({
          nom: data.nom, prenom: data.prenom, email: data.email, telephone: data.telephone,
          adresse: data.adresse, dateNaissance: data.dateNaissance, permis: data.permis,
          categoriePermis: data.categoriePermis, dateEmbauche: data.dateEmbauche,
          zone: data.zone, statut: data.statut,
          vehiculeMarque: data.vehiculeMarque, vehiculeModele: data.vehiculeModele,
          vehiculeImmatriculation: data.vehiculeImmatriculation, vehiculeType: data.vehiculeType,
        });
      }
      setLoading(false);
    })();
  }, [id]);

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.nom || !form.prenom) {
      Alert.alert('Champs requis', 'Le nom et le prénom sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      await datasource.update(id, form);
      Alert.alert('Succès', 'Conducteur modifié avec succès.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Erreur', 'Impossible de modifier le conducteur.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color="#F1F5F9" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Modifier conducteur</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Identité</Text>
        <View style={styles.card}>
          <Input label="Nom" value={form.nom ?? ''} onChange={(v) => update('nom', v)} />
          <Input label="Prénom" value={form.prenom ?? ''} onChange={(v) => update('prenom', v)} />
          <Input label="Email" value={form.email ?? ''} onChange={(v) => update('email', v)} keyboardType="email-address" />
          <Input label="Téléphone" value={form.telephone ?? ''} onChange={(v) => update('telephone', v)} keyboardType="phone-pad" />
          <Input label="Adresse" value={form.adresse ?? ''} onChange={(v) => update('adresse', v)} />
        </View>

        <Text style={styles.sectionTitle}>Véhicule</Text>
        <View style={styles.card}>
          <Input label="Marque" value={form.vehiculeMarque ?? ''} onChange={(v) => update('vehiculeMarque', v)} />
          <Input label="Modèle" value={form.vehiculeModele ?? ''} onChange={(v) => update('vehiculeModele', v)} />
          <Input label="Immatriculation" value={form.vehiculeImmatriculation ?? ''} onChange={(v) => update('vehiculeImmatriculation', v)} />
          <Input label="Type" value={form.vehiculeType ?? ''} onChange={(v) => update('vehiculeType', v)} />
        </View>

        <Text style={styles.sectionTitle}>Affectation</Text>
        <View style={styles.card}>
          <Picker label="Zone" value={form.zone ?? ZONES[0]} onChange={(v) => update('zone', v)} options={ZONES} />
          <Picker label="Statut" value={form.statut ?? 'actif'} onChange={(v) => update('statut', v)} options={['actif', 'inactif', 'suspendu']} />
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

function Input({ label, value, onChange, keyboardType }: { label: string; value: string; onChange: (v: string) => void; keyboardType?: any }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput style={styles.input} value={value} onChangeText={onChange} placeholderTextColor="#475569" keyboardType={keyboardType} />
    </View>
  );
}

function Picker({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
        {options.map((opt) => {
          const isActive = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              style={[styles.optionChip, isActive && { backgroundColor: '#10B98120', borderColor: '#10B981' }]}
              onPress={() => onChange(opt)}
            >
              <Text style={[styles.optionChipText, isActive && { color: '#10B981', fontWeight: '700' }]}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0F1E' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#1E2A4A' },
  backBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#1E293B', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#334155' },
  headerCenter: { flex: 1, alignItems: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: '#F1F5F9' },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8, marginTop: 16, marginLeft: 4 },
  card: { backgroundColor: '#131A2E', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#1E2A4A' },
  inputGroup: { marginBottom: 14 },
  inputLabel: { fontSize: 11, fontWeight: '600', color: '#6B7AA8', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 6 },
  input: { backgroundColor: '#0F172A', borderRadius: 10, paddingHorizontal: 14, height: 44, fontSize: 14, fontWeight: '600', color: '#F1F5F9', borderWidth: 1, borderColor: '#1E2A4A' },
  optionChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, backgroundColor: '#0F172A', borderWidth: 1, borderColor: '#1E2A4A' },
  optionChipText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },
  bottomBar: { flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: '#1E2A4A', backgroundColor: '#0F172A' },
  cancelBtn: { flex: 1, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1E293B', borderWidth: 1, borderColor: '#334155' },
  cancelBtnText: { fontSize: 15, fontWeight: '600', color: '#94A3B8' },
  saveBtn: { flex: 2, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: '#10B981' },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
