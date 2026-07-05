import { useCallback, useRef, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { slides } from '../data/slides';
import { OnboardingSlide } from '../components/OnboardingSlide';
import { markOnboardingComplete } from '../hooks/useOnboarding';

export function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isLastSlide = currentIndex === slides.length - 1;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: Array<{ index: number | null }> }) => {
      const first = viewableItems[0];
      if (first && first.index !== null) {
        setCurrentIndex(first.index);
      }
    },
    [],
  );

  const handleNext = () => {
    if (isLastSlide) return;
    flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
  };

  const handleComplete = async () => {
    try {
      await markOnboardingComplete();
      router.replace('/login');
    } catch {
      router.replace('/login');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={({ item }) => (
          <OnboardingSlide slide={item} currentIndex={currentIndex} total={slides.length} />
        )}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={styles.flatList}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
      />

      <View style={styles.footer}>
        {isLastSlide ? (
          <View style={styles.spacer} />
        ) : (
          <TouchableOpacity onPress={handleComplete}>
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        )}

        <View style={styles.spacer} />

        {isLastSlide ? (
          <TouchableOpacity
            onPress={handleComplete}
            style={styles.startButton}
          >
            <Text style={styles.startText}>Commencer</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNext}>
            <Text style={styles.nextText}>Suivant</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingBottom: 48,
  },
  spacer: {
    flex: 1,
  },
  skipText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  nextText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 9999,
  },
  startText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
  },
});
