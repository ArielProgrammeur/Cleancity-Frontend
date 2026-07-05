import { useEffect, useState } from 'react';
import { Text, type TextProps } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface AnimatedCounterProps extends TextProps {
  value: number;
  suffix?: string;
  delay?: number;
  duration?: number;
  precision?: number;
}

export function AnimatedCounter({ value, suffix, delay = 0, duration = 1000, precision = 0, style, ...rest }: AnimatedCounterProps) {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    const delayTimer = setTimeout(() => {
      const steps = 30;
      const increment = value / steps;
      let current = 0;
      const stepTime = duration / steps;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setDisplayed(value);
          clearInterval(interval);
        } else {
          setDisplayed(current);
        }
      }, stepTime);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(delayTimer);
  }, [value]);

  return (
    <Animated.View entering={FadeIn.delay(delay).duration(400)}>
      <Text style={style} {...rest}>
        {displayed.toFixed(precision)}{suffix ?? ''}
      </Text>
    </Animated.View>
  );
}
