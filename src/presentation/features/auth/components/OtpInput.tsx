import { useState, useRef, useEffect } from 'react';
import { View, TextInput, StyleSheet, Keyboard, type NativeSyntheticEvent, type TextInputKeyPressEventData } from 'react-native';
import { colors } from '../../../../core/theme/colors';

interface OtpInputProps {
  length?: number;
  code: string;
  onChangeCode: (code: string) => void;
  autoFocus?: boolean;
}

export function OtpInput({ length = 6, code, onChangeCode, autoFocus = true }: OtpInputProps) {
  const [focused, setFocused] = useState(autoFocus);
  const inputRef = useRef<TextInput>(null);
  const values = code.split('').concat(Array(length).fill('')).slice(0, length);

  useEffect(() => {
    if (autoFocus) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [autoFocus]);

  const handleChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '').slice(0, length);
    onChangeCode(cleaned);
    if (cleaned.length === length) {
      Keyboard.dismiss();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    if (e.nativeEvent.key === 'Backspace' && code.length > 0) {
      onChangeCode(code.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        value={code}
        onChangeText={handleChange}
        onKeyPress={handleKeyPress}
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        autoFocus={autoFocus}
        onBlur={() => setFocused(false)}
        onFocus={() => setFocused(true)}
      />
      <View style={styles.boxes}>
        {values.map((val, i) => (
          <View
            key={i}
            style={[
              styles.box,
              val ? styles.boxFilled : null,
              focused && i === code.length ? styles.boxFocused : null,
            ]}
            onTouchEnd={() => inputRef.current?.focus()}
          >
            <View style={styles.boxTextWrapper}>
              {val ? <View style={styles.dot} /> : null}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  hiddenInput: { position: 'absolute', width: 1, height: 1, opacity: 0 },
  boxes: { flexDirection: 'row', gap: 10 },
  box: {
    width: 48, height: 56, borderRadius: 12,
    borderWidth: 2, borderColor: '#E5E7EB',
    backgroundColor: '#F9FAFB',
    alignItems: 'center', justifyContent: 'center',
  },
  boxFilled: { borderColor: '#2E7D32', backgroundColor: '#F0FDF4' },
  boxFocused: { borderColor: '#2E7D32', backgroundColor: '#F0FDF4' },
  boxTextWrapper: { alignItems: 'center', justifyContent: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#2E7D32' },
});
