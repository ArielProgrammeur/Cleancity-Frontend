import React from 'react';
import {View,Text,StyleSheet,StatusBar,} from 'react-native';
import {Colors} from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.blue} barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Suivi des collectes</Text>
      </View>

      {/* Carte (placeholder) */}
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapIcon}>🗺️</Text>
        <Text style={styles.mapText}>Carte interactive</Text>
        <Text style={styles.mapSubtext}>
          La carte sera intégrée avec Google Maps
        </Text>
      </View>

      {/* Collectes en cours */}
      <View style={styles.collectionList}>
        <Text style={styles.listTitle}>Collectes en cours</Text>
        
        <View style={styles.collectionCard}>
          <View style={styles.truckIcon}>
            <FontAwesome name="truck" size={24} color="black" />
          </View>
          <View style={styles.collectionInfo}>
            <Text style={styles.collectionName}>Camion plastique</Text>
            <Text style={styles.collectionDistance}>À 2 km de vous</Text>
          </View>
          <View style={styles.collectionTime}>
            <Text style={styles.timeText}>15 min</Text>
          </View>
        </View>

        <View style={styles.collectionCard}>
          <View style={styles.truckIcon}>
            <FontAwesome name="truck" size={24} color="black" />
          </View>
          <View style={styles.collectionInfo}>
            <Text style={styles.collectionName}>Camion verre</Text>
            <Text style={styles.collectionDistance}>À 5 km de vous</Text>
          </View>
          <View style={styles.collectionTime}>
            <Text style={styles.timeText}>30 min</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    backgroundColor: Colors.blue,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
    paddingBottom: Sizes.lg,
  },
  title: {
    fontSize: Sizes.titleSm,
    fontWeight: 'bold',
    color: Colors.white,  
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapIcon: {
    fontSize: 64,
    marginBottom: Sizes.md,
  },
  mapText: {
    fontSize: Sizes.textXl,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Sizes.sm,
  },
  mapSubtext: {
    fontSize: Sizes.textMd,
    color: Colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  collectionList: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Sizes.radiusLg,
    borderTopRightRadius: Sizes.radiusLg,
    paddingHorizontal: Sizes.lg,
    paddingTop: Sizes.lg,
    paddingBottom: Sizes.lg,
  },
  listTitle: {
    fontSize: Sizes.textXl,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.md,
  },
  collectionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: Sizes.radiusMd,
    padding: Sizes.md,
    marginBottom: Sizes.md,
  },
  truckIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Sizes.md,
  },
  collectionInfo: {
    flex: 1,
  },
  collectionName: {
    fontSize: Sizes.textLg,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  collectionDistance: {
    fontSize: Sizes.textMd,
    color: Colors.textSecondary,
  },
  collectionTime: {
    backgroundColor: Colors.blue,
    paddingHorizontal: Sizes.md,
    paddingVertical: 6,
    borderRadius: Sizes.radiusSm,
  },
  timeText: {
    fontSize: Sizes.textSm,
    fontWeight: '600',
    color: Colors.white,
  },
});