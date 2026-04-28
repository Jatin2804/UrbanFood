import { Brand } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface StaticMapViewProps {
  latitude: number;
  longitude: number;
  width?: number;
  height?: number;
  zoom?: number;
  markers?: Array<{ latitude: number; longitude: number; color?: string }>;
}

/**
 * StaticMapView - A fallback map component using OpenStreetMap static tiles
 * Works without API keys and doesn't require Google Maps
 */
export function StaticMapView({
  latitude,
  longitude,
  width = 400,
  height = 200,
  zoom = 14,
  markers = [],
}: StaticMapViewProps) {
  // OpenStreetMap static map URL (no API key needed)
  const mapUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}&layer=mapnik&marker=${latitude},${longitude}`;

  return (
    <View style={[styles.container, { width, height }]}>
      <iframe
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        marginHeight={0}
        marginWidth={0}
        src={mapUrl}
        style={{ border: 0 }}
      />
      <View style={styles.overlay}>
        <Ionicons name="location" size={24} color={Brand.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  overlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -12 }, { translateY: -24 }],
  },
});
