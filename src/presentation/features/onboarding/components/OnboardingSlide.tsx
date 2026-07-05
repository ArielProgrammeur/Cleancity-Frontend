import { View, Text, Image, Dimensions, StyleSheet } from 'react-native';
import type { OnboardingSlide as OnboardingSlideData } from '../data/slides';
import { StepIndicator } from '../../../shared/StepIndicator';

const { width } = Dimensions.get('window');

interface OnboardingSlideProps {
 readonly slide: OnboardingSlideData;
 readonly currentIndex: number;
 readonly total: number;
}

export function OnboardingSlide({ slide, currentIndex, total }: OnboardingSlideProps) {
  const circleSize = slide.circleSize ?? 0.6;
  return (
    <View style={[styles.container, { width, backgroundColor: slide.backgroundColor }]}>
      <View style={styles.inner}>
        <View style={[styles.imageCircle, {
          width: width * circleSize,
          height: width * circleSize,
          borderRadius: width * circleSize / 2,
          backgroundColor: slide.backgroundColor + '40',
        }]}>
          <Image
            source={slide.image}
            style={styles.image}
            resizeMode={slide.imageResizeMode ?? 'cover'}
          />
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
  imageCircle: {
    overflow: 'hidden',
    marginBottom: 32,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  image: {
    width: '100%',
    height: '100%',
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
