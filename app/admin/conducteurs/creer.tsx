import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ConducteurApiDatasource } from '../../../src/data/datasources/ConducteurApiDatasource';

const datasource = new ConducteurApiDatasource();

const ZONES = ['Douala Nord', 'Douala Sud', 'Douala Centre', 'Douala Ouest', 'Douala Est', 'Bonapriso', 'Akwa', 'Bassa'];
const STATUTS = ['actif', 'inactif', 'suspendu'] as const;

export default function CreerConducteur() {
  const insets = useSafeAreaInsets();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    nom: '', prenom: '', email: '', telephone: '', adresse: '',
    dateNaissance: '', permis: '', categoriePermis: 'B', dateEmbauche: '',
    zone: ZONES[0], statut: 'actif' as 'actif' | 'inactif' | 'suspendu',
    vehiculeMarque: '', vehiculeModele: '', vehiculeImmatriculation: '', vehiculeType: '',
  });

  const update = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.nom || !form.prenom || !form.email || !form.telephone) {
      Alert.alert('Champs requis', 'Veuillez remplir le nom, prénom, email et téléphone.');
      return;
    }
    setSaving(true);
    try {
      await datasource.create(form as any);
      Alert.alert('Succès', 'Conducteur ajouté avec succès.', [{ text: 'OK', onPress: () => router.back() }]);
    } catch {
      Alert.alert('Erreur', 'Impossible de créer le conducteur.');
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
        <View style={styles.headerCenter}>
          <Text style={styles.title}>Nouveau conducteur</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Identité</Text>
        <View style={styles.card}>
          <Input label="Nom" value={form.nom} onChange={(v) => update('nom', v)} placeholder="Nkou" />
          <Input label="Prénom" value={form.prenom} onChange={(v) => update('prenom', v)} placeholder="Jean-Pierre" />
          <Input label="Email" value={form.email} onChange={(v) => update('email', v)} placeholder="jean-pierre.nkou@cleancity.cm" keyboardType="email-address" />
          <Input label="Téléphone" value={form.telephone} onChange={(v) => update('telephone', v)} placeholder="+237 77 123 45 67" keyboardType="phone-pad" />
          <Input label="Adresse" value={form.adresse} onChange={(v) => update('adresse', v)} placeholder="Akwa" />
          <Input label="Date de naissance" value={form.dateNaissance} onChange={(v) => update('dateNaissance', v)} placeholder="1990-03-15" />
        </View>

        <Text style={styles.sectionTitle}>Permis</Text>
        <View style={styles.card}>
          <Input label="Numéro de permis" value={form.permis} onChange={(v) => update('permis', v)} placeholder="CM-123456-A" />
          <Picker label="Catégorie" value={form.categoriePermis} onChange={(v) => update('categoriePermis', v)} options={['B', 'C', 'D', 'EB', 'EC']} />
        </View>

        <Text style={styles.sectionTitle}>Véhicule</Text>
        <View style={styles.card}>
          <Input label="Marque" value={form.vehiculeMarque} onChange={(v) => update('vehiculeMarque', v)} placeholder="Toyota" />
          <Input label="Modèle" value={form.vehiculeModele} onChange={(v) => update('vehiculeModele', v)} placeholder="Hilux" />
          <Input label="Immatriculation" value={form.vehiculeImmatriculation} onChange={(v) => update('vehiculeImmatriculation', v)} placeholder="GA-4567-AB" />
          <Input label="Type" value={form.vehiculeType} onChange={(v) => update('vehiculeType', v)} placeholder="Camion benne" />
        </View>

        <Text style={styles.sectionTitle}>Affectation</Text>
        <View style={styles.card}>
          <Picker label="Zone" value={form.zone} onChange={(v) => update('zone', v)} options={ZONES} />
          <Picker label="Statut" value={form.statut} onChange={(v) => update('statut', v)} options={STATUTS as unknown as string[]} />
          <Input label="Date d'embauche" value={form.dateEmbauche} onChange={(v) => update('dateEmbauche', v)} placeholder="2024-01-01" />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()} activeOpacity={0.7}>
          <Text style={styles.cancelBtnText}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={saving} activeOpacity={0.85}>
          {saving ? <ActivityIndicator color="#FFFFFF" size="small" /> : <Text style={styles.saveBtnText}>Créer le conducteur</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Input({ label, value, onChange, placeholder, keyboardType }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; keyboardType?: any;
}) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#475569"
        keyboardType={keyboardType}
      />
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
