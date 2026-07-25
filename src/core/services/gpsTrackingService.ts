import { useEffect, useRef, useCallback } from 'react';
import * as Location from 'expo-location';
import { api } from '../api/api';

const UPDATE_INTERVAL_MS = 5000;
const MIN_DISTANCE_THRESHOLD = 10;

interface TrackingOptions {
  enabled: boolean;
  assignmentId?: string;
  truckId?: string;
  onPositionUpdate?: (position: { latitude: number; longitude: number }) => void;
  onError?: (error: string) => void;
}

export function useGpsTracking(options: TrackingOptions) {
  const { enabled, assignmentId, truckId, onPositionUpdate, onError } = options;
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);
  const lastPosition = useRef<{ latitude: number; longitude: number } | null>(null);
  const isTracking = useRef(false);

  const sendPosition = useCallback(async (latitude: number, longitude: number) => {
    try {
      await api.post('/api/tracking/position', {
        latitude,
        longitude,
        speed: 0,
        heading: 0,
        truck_id: truckId,
        assignment_id: assignmentId,
        status: 'en_route',
      });
      onPositionUpdate?.({ latitude, longitude });
    } catch (err: any) {
      console.error('[GPS] Erreur envoi position:', err.message);
    }
  }, [truckId, assignmentId, onPositionUpdate]);

  const startTracking = useCallback(async () => {
    if (isTracking.current) return;

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      onError?.('Permission de localisation refusée');
      return;
    }

    isTracking.current = true;

    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        distanceInterval: MIN_DISTANCE_THRESHOLD,
        timeInterval: UPDATE_INTERVAL_MS,
      },
      (location) => {
        const { latitude, longitude } = location.coords;

        if (lastPosition.current) {
          const distance = getDistance(lastPosition.current, { latitude, longitude });
          if (distance < MIN_DISTANCE_THRESHOLD / 1000) return;
        }

        lastPosition.current = { latitude, longitude };
        sendPosition(latitude, longitude);
      }
    );
  }, [sendPosition, onError]);

  const stopTracking = useCallback(async () => {
    if (locationSubscription.current) {
      await locationSubscription.current.remove();
      locationSubscription.current = null;
    }
    isTracking.current = false;
    lastPosition.current = null;

    try {
      await api.delete('/api/tracking/position');
    } catch (err) {
      console.error('[GPS] Erreur arrêt tracking:', err);
    }
  }, []);

  useEffect(() => {
    if (enabled) {
      startTracking();
    } else {
      stopTracking();
    }
    return () => {
      stopTracking();
    };
  }, [enabled, startTracking, stopTracking]);

  return {
    startTracking,
    stopTracking,
    isTracking: isTracking.current,
  };
}

function getDistance(
  p1: { latitude: number; longitude: number },
  p2: { latitude: number; longitude: number }
): number {
  const R = 6371;
  const dLat = toRad(p2.latitude - p1.latitude);
  const dLon = toRad(p2.longitude - p1.longitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(p1.latitude)) * Math.cos(toRad(p2.latitude)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}
