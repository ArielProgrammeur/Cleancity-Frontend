import { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../constants/Colors';

export default function SplashScreen() {
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(20)).current;

  const checkFirstLaunch = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');
      const userToken = await AsyncStorage.getItem('userToken');

      setTimeout(() => {
        if (!hasSeenOnboarding) { 
          router.replace('../(onboarding)/Onboarding1');
        } else if (userToken === null) {
          router.replace('../(auth)/Login');
        } else {
          router.replace('../(tabs)/Home');
        }
      }, 2500);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    Animated.sequence([
      // Animation du logo d'abord
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
      // Puis animation du texte
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(textTranslateY, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => {
      /*checkFirstLaunch();*/
    const resetAndNavigate = async () => {
        try {
          // Supprimer TOUTES les données pour repartir à zéro
          await AsyncStorage.clear();
          console.log('🧹 AsyncStorage nettoyé - Retour au début du flow');
          
          // Rediriger vers l'onboarding
          setTimeout(() => {
            router.replace('./(onboarding)/Onboarding1');
          }, 500);
          
        } catch (error) {
          console.error('Erreur:', error);
          // En cas d'erreur, aller à l'onboarding par sécurité
          router.replace('../(onboarding)');
        }
      };
      resetAndNavigate();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[
        styles.logoContainer, 
        { 
          opacity: logoOpacity, 
          transform: [{ scale: logoScale }] 
        }
      ]}>
        <Image 
          source={require('../assets/images/splash.png')} // ⚠️ Vérifiez le nom du fichier
          style={styles.logoImage}
          resizeMode="contain"
        />
      </Animated.View>
      
      <Animated.View style={[
        styles.textContainer, 
        { 
          opacity: textOpacity, 
          transform: [{ translateY: textTranslateY }] 
        }
      ]}>
        <Text style={styles.title}>CleanCity</Text>
        <Text style={styles.subtitle}>Ensemble pour une ville propre</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: 250,
    height: 250,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: Colors.white,
    marginTop: 10,
    opacity: 0.9,
    textAlign: 'center',
  },
});