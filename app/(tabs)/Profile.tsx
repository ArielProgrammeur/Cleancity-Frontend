import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Colors} from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';


export default function ProfileScreen() {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      router.replace('../Login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.primary} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>A.P</Text>
        </View>
        <Text style={styles.name}>Ariel Programmeur</Text>
        <Text style={styles.email}>arielprogrammeur@gmail.com</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>125</Text>
            <Text style={styles.statLabel}>Kg recyclés</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>45</Text>
            <Text style={styles.statLabel}>Signalements</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>890</Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>
        </View>

        {/* Menu items */}
        <View style={styles.menuSection}>
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>👤</Text>
            <Text style={styles.menuText}>Modifier le profil</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>🏆</Text>
            <Text style={styles.menuText}>Mes récompenses</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📊</Text>
            <Text style={styles.menuText}>Statistiques</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>📜</Text>
            <Text style={styles.menuText}>Historique</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>⚙️</Text>
            <Text style={styles.menuText}>Paramètres</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuIcon}>ℹ️</Text>
            <Text style={styles.menuText}>À propos</Text>
            <Text style={styles.menuArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Text style={styles.menuIcon}>🚪</Text>
            <Text style={[styles.menuText, styles.logoutText]}>Déconnexion</Text>
            <Text style={styles.menuArrow}></Text>
          </TouchableOpacity>
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
    paddingTop: 40,
    paddingBottom: Sizes.xl,
    alignItems: 'center',
    borderBottomLeftRadius: Sizes.radiusLg,
    borderBottomRightRadius: Sizes.radiusLg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  name: {
    fontSize: Sizes.titleSm,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
  },
  email: {
    fontSize: Sizes.textMd,
    color: Colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Sizes.lg,
    paddingVertical: Sizes.lg,
    justifyContent: 'space-between',
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: Sizes.titleSm,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: Sizes.textSm,
    color: Colors.textSecondary,
  },
  menuSection: {
    paddingHorizontal: Sizes.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.md,
    marginBottom: Sizes.md,
  },
  menuIcon: {
    fontSize: 24,
    marginRight: Sizes.md,
  },
  menuText: {
    flex: 1,
    fontSize: Sizes.textLg,
    color: Colors.text,
  },
  menuArrow: {
    fontSize: 24,
    color: Colors.textSecondary,
  },
  logoutItem: {
    backgroundColor: '#FFEBEE',
    marginTop: Sizes.sm,
  },
  logoutText: {
    color: Colors.error,
    fontWeight: '600',
  },
});