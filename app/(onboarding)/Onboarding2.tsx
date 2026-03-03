import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Image } from 'react-native';
import { router } from 'expo-router';
import {Colors} from '../../constants/Colors';
import { Sizes } from '../../constants/Sizes';

export default function Onboarding2() {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={Colors.white} barStyle="dark-content" />
      
      <View style={styles.illustrationContainer}>
        <Image source={require ('../../assets/images/Onboarding2.png')} style={styles.illustrationImage}/>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Suivez les collectes</Text>
        <Text style={styles.description}>
          Restez informé en temps réel du passage des camions de collecte dans votre zone
        </Text>
      </View>

      <View style={styles.indicators}>
        <View style={styles.indicator} />
        <View style={[styles.indicator, styles.indicatorActive]} />
        <View style={styles.indicator} />
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          style={styles.buttonPrimary}
          onPress={() => router.push('../(onboarding)/Onboarding3')}
        >
          <Text style={styles.buttonPrimaryText}>Suivant</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.replace('../(auth)/Login')}>
          <Text style={styles.skipText}>Passer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  illustrationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  illustrationImage: {
    width: 280,
    height: 280,
    borderRadius: 140,
    fontSize: 100,
    backgroundColor: '#FFF9C4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: Sizes.xl,
    paddingBottom: Sizes.xl,
  },
  title: {
    fontSize: Sizes.titleMd,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Sizes.md,
    textAlign: 'center',
  },
  description: {
    fontSize: Sizes.textLg,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: Sizes.xl,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lightGray,
  },
  indicatorActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  buttons: {
    paddingHorizontal: Sizes.xl,
    paddingBottom: 48,
  },
  buttonPrimary: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.md,
    borderRadius: Sizes.radiusMd,
    alignItems: 'center',
    marginBottom: Sizes.md,
  },
  buttonPrimaryText: {
    color: Colors.white,
    fontSize: Sizes.textLg,
    fontWeight: '600',
  },
  skipText: {
    color: Colors.textSecondary,
    fontSize: Sizes.textLg,
    textAlign: 'center',
  },
});