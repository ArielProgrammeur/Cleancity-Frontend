import { memo, useCallback } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ExpoImagePicker from 'expo-image-picker';

interface ImagePickerProps {
  imageUri: string | null;
  onPick: (uri: string) => void;
}

export const ImagePicker = memo(function ImagePicker({
  imageUri,
  onPick,
}: ImagePickerProps) {
  const pickFromGallery = useCallback(async () => {
    const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to your photo library to select an image.');
      return;
    }
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onPick(result.assets[0].uri);
    }
  }, [onPick]);

  const takePhoto = useCallback(async () => {
    const permission = await ExpoImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow access to your camera to take a photo.');
      return;
    }
    const result = await ExpoImagePicker.launchCameraAsync({
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      onPick(result.assets[0].uri);
    }
  }, [onPick]);

  const handlePress = useCallback(() => {
    Alert.alert('Add Photo', 'Show the waste you found', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickFromGallery },
    ]);
  }, [takePhoto, pickFromGallery]);

  if (imageUri) {
    return (
      <TouchableOpacity
        style={styles.previewCard}
        onPress={handlePress}
        activeOpacity={0.95}
      >
        <Image source={{ uri: imageUri }} style={styles.previewImage} />
        <View style={styles.previewBadge}>
          <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" />
          <Text style={styles.previewBadgeText}>Photo added</Text>
        </View>
        <TouchableOpacity style={styles.previewExpand} onPress={() => {}}>
          <Ionicons name="expand-outline" size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.previewFooter}>
          <Ionicons name="camera-outline" size={14} color="#FFFFFF" />
          <Text style={styles.previewFooterText}>Tap to change photo</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.dropZone}
      onPress={handlePress}
      activeOpacity={0.75}
    >
      <View style={styles.dropIconWrap}>
        <Ionicons name="camera" size={24} color={colors.primary} />
      </View>
      <Text style={styles.dropTitle}>Add a photo</Text>
      <Text style={styles.dropSub}>Take a picture or choose from gallery</Text>
    </TouchableOpacity>
  );
});

const colors = {
  primary: '#2E7D32',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  dropZone: {
    height: 148,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E2E5E8',
    borderStyle: 'dashed',
    backgroundColor: '#F9FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  dropTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
  },
  dropSub: {
    fontSize: 13,
    color: '#9CA3AF',
    marginTop: 3,
  },

  previewCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#C6F6D5',
    position: 'relative',
  },
  previewImage: {
    width: '100%',
    height: 192,
    resizeMode: 'cover',
  },
  previewBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(22, 101, 52, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  previewBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewExpand: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingVertical: 7,
  },
  previewFooterText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
  },
});
