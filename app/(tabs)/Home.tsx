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

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Bonjour 👋</Text>
        <Text style={styles.username}>User</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.statIcon}>♻️</Text>
            <Text style={styles.statValue}>125</Text>
            <Text style={styles.statLabel}>Kg recyclés</Text>
          </View>

          <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
            <Text style={styles.statIcon}>📍</Text>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Signalements</Text>
          </View>
        </View>

        {/* Activité récente */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Activité récente</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Text>🎯</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Marketplace</Text>
              <Text style={styles.activityDescription}>
                Nouveau produit disponible
              </Text>
            </View>
            <Text style={styles.activityTime}>2h</Text>
          </View>

          <View style={styles.activityCard}>
            <View style={styles.activityIcon}>
              <Text>🚛</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Collecte</Text>
              <Text style={styles.activityDescription}>
                Camion en approche
              </Text>
            </View>
            <Text style={styles.activityTime}>5h</Text>
          </View>
        </View>
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
    backgroundColor: Colors.primary,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
    paddingBottom: Sizes.lg,
    borderBottomLeftRadius: Sizes.radiusLg,
    borderBottomRightRadius: Sizes.radiusLg,
  },
  greeting: {
    fontSize: Sizes.textLg,
    color: Colors.white,
    opacity: 0.9,
  },
  username: {
    fontSize: Sizes.titleSm,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: Sizes.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -30,
    marginBottom: Sizes.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusLg,
    padding: Sizes.lg,
    marginHorizontal: 6,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: Sizes.sm,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Sizes.textSm,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: Sizes.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  sectionTitle: {
    fontSize: Sizes.textXl,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAll: {
    fontSize: Sizes.textMd,
    color: Colors.primary,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.md,
    marginBottom: Sizes.md,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: Sizes.textLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: Sizes.textMd,
    color: Colors.textSecondary,
  },
  activityTime: {
    fontSize: Sizes.textSm,
    color: Colors.textSecondary,
  },
});