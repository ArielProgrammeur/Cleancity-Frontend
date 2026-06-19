import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { OnboardingSlide as OnboardingSlideData } from '../data/slides';
import { StepIndicator } from '../../../shared/StepIndicator';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
 readonly slide: OnboardingSlideData;
 readonly currentIndex: number;
 readonly total: number;
}

export function OnboardingSlide({ slide, currentIndex, total }: OnboardingSlideProps) {
  return (
    <View style={[styles.container, { width }]}>
      <View style={styles.inner}>
        <View style={styles.iconCircle}>
          <Ionicons name={slide.icon} size={80} color="white" />
        </View>

        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.description}>{slide.description}</Text>

        <StepIndicator total={total} current={currentIndex} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  inner: {
    alignItems: 'center',
  },
  iconCircle: {
    marginBottom: 32,
    borderRadius: 9999,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 24,
  },
  title: {
    marginBottom: 16,
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 70,
  },
});
