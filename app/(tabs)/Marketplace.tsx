import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Colors} from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

export default function MarketplaceScreen() {
  const products = [
    { id: 1, name: 'Bouteilles Plastique', price: '50 XAF', quantity: '1 kg', color: '#E1BEE7' },
    { id: 2, name: 'Cartons recyclés', price: '30 XAF', quantity: '1 kg', color: '#FFCCBC' },
    { id: 3, name: 'Canettes Alu', price: '75 XAF', quantity: '1 kg', color: '#C5E1A5' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.purple} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Marketplace</Text>
        <Text style={styles.subtitle}>Achetez et vendez des matériaux recyclés</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Catégories */}
        <View style={styles.categories}>
          <TouchableOpacity style={[styles.categoryChip, styles.categoryActive]}>
            <Text style={styles.categoryTextActive}>Tous</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Plastique</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Papier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.categoryChip}>
            <Text style={styles.categoryText}>Métal</Text>
          </TouchableOpacity>
        </View>

        {/* Produits */}
        {products.map((product) => (
          <View key={product.id} style={styles.productCard}>
            <View style={[styles.productImage, { backgroundColor: product.color }]}>
              <Text style={styles.productEmoji}>♻️</Text>
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productQuantity}>{product.quantity}</Text>
              <Text style={styles.productPrice}>{product.price}</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.purple,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
    paddingBottom: Sizes.lg,
    borderBottomLeftRadius: Sizes.radiusLg,
    borderBottomRightRadius: Sizes.radiusLg,
  },
  title: {
    fontSize: Sizes.titleSm,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Sizes.textMd,
    color: Colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
  },
  categories: {
    flexDirection: 'row',
    paddingVertical: Sizes.lg,
    gap: Sizes.sm,
  },
  categoryChip: {
    paddingHorizontal: Sizes.md,
    paddingVertical: Sizes.sm,
    borderRadius: Sizes.radiusLg,
    backgroundColor: Colors.lightGray,
  },
  categoryActive: {
    backgroundColor: Colors.purple,
  },
  categoryText: {
    fontSize: Sizes.textMd,
    color: Colors.text,
  },
  categoryTextActive: {
    fontSize: Sizes.textMd,
    color: Colors.white,
    fontWeight: '600',
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.md,
    marginBottom: Sizes.md,
  },
  productImage: {
    width: 64,
    height: 64,
    borderRadius: Sizes.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  productEmoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: Sizes.textLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: Sizes.textSm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  productPrice: {
    fontSize: Sizes.textLg,
    fontWeight: 'bold',
    color: Colors.purple,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: Colors.white,
    fontWeight: '600',
  },
});