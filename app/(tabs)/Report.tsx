import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
} from 'react-native';
import {Colors} from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

export default function ReportScreen() {
  const [selectedType, setSelectedType] = useState('');
  const [description, setDescription] = useState('');

  const wasteTypes = [
    { id: 'plastic', label: 'Plastique', icon: '🥤' },
    { id: 'paper', label: 'Papier', icon: '📄' },
    { id: 'glass', label: 'Verre', icon: '🍾' },
    { id: 'metal', label: 'Métal', icon: '🥫' },
    { id: 'organic', label: 'Organique', icon: '🍎' },
    { id: 'other', label: 'Autre', icon: '🗑️' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Signaler des déchets</Text>
        <Text style={styles.subtitle}>
          Aidez à garder votre ville propre
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Type de déchet */}
        <Text style={styles.sectionTitle}>Type de déchet</Text>
        <View style={styles.typesGrid}>
          {wasteTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.typeCard,
                selectedType === type.id && styles.typeCardSelected,
              ]}
              onPress={() => setSelectedType(type.id)}
            >
              <Text style={styles.typeIcon}>{type.icon}</Text>
              <Text style={styles.typeLabel}>{type.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Localisation */}
        <Text style={styles.sectionTitle}>Localisation</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationIcon}>📍</Text>
          <View style={styles.locationContent}>
            <Text style={styles.locationText}>Ma position actuelle</Text>
            <Text style={styles.locationSubtext}>Utiliser GPS</Text>
          </View>
        </TouchableOpacity>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description (optionnel)</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Ajoutez des détails..."
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
          placeholderTextColor={Colors.textSecondary}
        />

        {/* Photo */}
        <Text style={styles.sectionTitle}>Photo (optionnel)</Text>
        <TouchableOpacity style={styles.photoButton}>
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoText}>Ajouter une photo</Text>
        </TouchableOpacity>

        {/* Bouton Signaler */}
        <TouchableOpacity style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Signaler</Text>
        </TouchableOpacity>
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
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
    paddingBottom: Sizes.md,
  },
  title: {
    fontSize: Sizes.titleSm,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: Sizes.textMd,
    color: Colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
  },
  sectionTitle: {
    fontSize: Sizes.textLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.md,
    marginTop: Sizes.lg,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizes.md,
  },
  typeCard: {
    width: '30%',
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    backgroundColor: '#E8F5E9',
    borderColor: Colors.primary,
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: Sizes.sm,
  },
  typeLabel: {
    fontSize: Sizes.textSm,
    color: Colors.text,
    fontWeight: '500',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.md,
  },
  locationIcon: {
    fontSize: 24,
    marginRight: Sizes.md,
  },
  locationContent: {
    flex: 1,
  },
  locationText: {
    fontSize: Sizes.textLg,
    fontWeight: '500',
    color: Colors.text,
  },
  locationSubtext: {
    fontSize: Sizes.textSm,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  descriptionInput: {
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.md,
    fontSize: Sizes.textMd,
    textAlignVertical: 'top',
    minHeight: 100,
    color: Colors.text,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  photoIcon: {
    fontSize: 24,
    marginRight: Sizes.sm,
  },
  photoText: {
    fontSize: Sizes.textMd,
    color: Colors.textSecondary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radiusMd,
    alignItems: 'center',
    marginTop: Sizes.xl,
    marginBottom: Sizes.xl,
  },
  submitButtonText: {
    color: Colors.white,
    fontSize: Sizes.textLg,
    fontWeight: '600',
  },
});