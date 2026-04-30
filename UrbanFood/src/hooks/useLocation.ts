import * as Location from 'expo-location';
import { useCallback, useState } from 'react';
import { Linking, Platform } from 'react-native';

export type LocationStatus = 'idle' | 'requesting' | 'granted' | 'denied';

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface LocationState {
  status: LocationStatus;
  address: string | null;
  coords: LocationCoords | null;
}

export function useLocation() {
  const [status, setStatus] = useState<LocationStatus>('idle');
  const [address, setAddress] = useState<string | null>(null);
  const [coords, setCoords] = useState<LocationCoords | null>(null);

  // Parsed address parts for richer display
  const [city, setCity] = useState<string | null>(null);
  const [district, setDistrict] = useState<string | null>(null);

  const requestLocation = useCallback(async () => {
    setStatus('requesting');

    try {
      if (Platform.OS === 'web') {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setStatus('granted');
            setCoords({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
            setAddress('Your current location');
          },
          () => setStatus('denied'),
        );
        return;
      }

      const { status: permStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (permStatus !== 'granted') {
        setStatus('denied');
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      setCoords({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setStatus('granted');

      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      if (place) {
        // Full address line: street number + street name
        const streetLine = [place.streetNumber, place.street]
          .filter(Boolean)
          .join(' ');
        // Sub-address: name of place if different from street
        const nameLine =
          place.name && place.name !== place.street ? place.name : null;

        const fullAddress = [nameLine, streetLine, place.district, place.city]
          .filter(Boolean)
          .join(', ');

        setAddress(fullAddress || 'Current location detected');
        setCity(place.city ?? null);
        setDistrict(place.district ?? place.subregion ?? null);
      } else {
        setAddress('Current location detected');
      }
    } catch {
      setStatus('denied');
    }
  }, []);

  const openSettings = useCallback(() => {
    if (Platform.OS === 'ios') {
      Linking.openURL('app-settings:');
    } else {
      Linking.openSettings();
    }
  }, []);

  return {
    status,
    address,
    coords,
    city,
    district,
    requestLocation,
    openSettings,
  };
}
