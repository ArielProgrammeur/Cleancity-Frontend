import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const products = [
  { icon: 'water-outline' as const, label: 'Plastique', price: '0.50 €/kg', color: '#2563EB', bg: '#EFF6FF' },
  { icon: 'wine-outline' as const, label: 'Verre', price: '0.30 €/kg', color: '#059669', bg: '#ECFDF5' },
  { icon: 'newspaper-outline' as const, label: 'Papier', price: '0.20 €/kg', color: '#D97706', bg: '#FFFBEB' },
  { icon: 'laptop-outline' as const, label: 'Électronique', price: '2.00 €/kg', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: 'shirt-outline' as const, label: 'Textile', price: '0.80 €/kg', color: '#DB2777', bg: '#FDF2F8' },
  { icon: 'hammer-outline' as const, label: 'Métal', price: '1.20 €/kg', color: '#6B7280', bg: '#F3F4F6' },
];

export default function Marketplace() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.subtitle}>Sell your recyclable waste</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <Text style={styles.sectionTitle}>Current Prices</Text>
        <View style={styles.grid}>
          {products.map((p) => (
            <TouchableOpacity key={p.label} style={[styles.card, { backgroundColor: p.bg }]}>
              <View style={[styles.iconWrap, { backgroundColor: p.color + '20' }]}>
                <Ionicons name={p.icon} size={28} color={p.color} />
              </View>
              <Text style={styles.cardLabel}>{p.label}</Text>
              <Text style={[styles.cardPrice, { color: p.color }]}>{p.price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={22} color="#2E7D32" />
          <Text style={styles.infoText}>
            Prices are updated daily. Bring your sorted waste to a collection point.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  card: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111827',
  },
  cardPrice: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  infoText: {
    fontSize: 13,
    color: '#166534',
    flex: 1,
  },
});
