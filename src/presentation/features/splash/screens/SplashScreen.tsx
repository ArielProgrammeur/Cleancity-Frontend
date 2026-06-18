import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export function SplashScreen() {
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const scaleLogo = useRef(new Animated.Value(0.5)).current;
  const fadeTagline = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeLogo, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(scaleLogo, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(fadeTagline, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.logoContainer, { opacity: fadeLogo, transform: [{ scale: scaleLogo }] }]}
      >
        <Ionicons name="leaf" size={96} color="white" />
        <Text style={styles.title}>CleanCity</Text>
      </Animated.View>

      <Animated.Text style={[styles.tagline, { opacity: fadeTagline }]}>
        Gardons notre ville propre
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
  },
  logoContainer: {
    alignItems: 'center',
  },
  title: {
    marginTop: 16,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  tagline: {
    position: 'absolute',
    bottom: 64,
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.7)',
  },
});
