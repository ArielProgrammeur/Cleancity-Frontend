import { useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';

export function SplashScreen() {
  const fadeLogo = useRef(new Animated.Value(0)).current;
  const scaleLogo = useRef(new Animated.Value(0.3)).current;
  const fadeTagline = useRef(new Animated.Value(0)).current;
  const fadeScreen = useRef(new Animated.Value(1)).current;
  const bgGreen = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeLogo, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(scaleLogo, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: true,
        }),
        Animated.timing(bgGreen, {
          toValue: 1,
          duration: 3500,
          useNativeDriver: false,
        }),
      ]),
      Animated.timing(fadeTagline, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeScreen, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        router.replace('/onboarding');
      });
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeScreen }]}>
      <Animated.View
        style={[styles.logoContainer, { opacity: fadeLogo, transform: [{ scale: scaleLogo }] }]}
      >
        <Image source={require('../../../../../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>CleanCity</Text>
      </Animated.View>
      <Animated.Text style={[styles.tagline, { opacity: fadeTagline }]}>
        Ensemble pour une ville plus propre, plus intelligente.
      </Animated.Text>
    </Animated.View>
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
  logo: {
    width: 200,
    height: 200,
    borderRadius: 100,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 20,
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  tagline: {
    marginTop: 48,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
