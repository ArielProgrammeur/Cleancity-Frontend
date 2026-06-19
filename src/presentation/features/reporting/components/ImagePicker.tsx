import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ImagePickerProps {
  imageUri: string | null;
  onPick: () => void;
}

export function ImagePicker({ imageUri, onPick }: ImagePickerProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Photo</Text>
      <TouchableOpacity style={styles.uploadArea} onPress={onPick}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera-outline" size={40} color="#9CA3AF" />
            <Text style={styles.placeholderText}>
              Tap to take a photo
            </Text>
            <Text style={styles.placeholderSubtext}>
              Show the waste you found
            </Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  uploadArea: {
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    overflow: 'hidden',
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  placeholderSubtext: {
    marginTop: 4,
    fontSize: 13,
    color: '#9CA3AF',
  },
  preview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
