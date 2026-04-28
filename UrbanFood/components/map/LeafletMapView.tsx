import React, { useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export interface MapMarker {
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  color?: string;       // hex color for the marker circle
  icon?: string;         // emoji or text inside the marker
  rotation?: number;
}

export interface MapPolyline {
  coordinates: { latitude: number; longitude: number }[];
  color?: string;
  width?: number;
}

interface LeafletMapViewProps {
  markers?: MapMarker[];
  polylines?: MapPolyline[];
  style?: any;
  initialCenter?: { latitude: number; longitude: number };
  initialZoom?: number;
  fitBounds?: boolean;
  interactive?: boolean;
  onMapReady?: () => void;
}

/**
 * A map component using Leaflet.js + OpenStreetMap tiles rendered inside a WebView.
 * Works on Android without Google Maps API key.
 */
export default function LeafletMapView({
  markers = [],
  polylines = [],
  style,
  initialCenter,
  initialZoom = 14,
  fitBounds = true,
  interactive = true,
  onMapReady,
}: LeafletMapViewProps) {
  const webViewRef = useRef<WebView>(null);

  // Build the HTML for Leaflet
  const getHtml = useCallback(() => {
    const center = initialCenter ?? { latitude: 12.9, longitude: 77.64 };

    const markersJson = JSON.stringify(
      markers.map((m) => ({
        id: m.id,
        lat: m.latitude,
        lng: m.longitude,
        title: m.title ?? '',
        color: m.color ?? '#FF6B35',
        icon: m.icon ?? '📍',
        rotation: m.rotation ?? 0,
      })),
    );

    const polylinesJson = JSON.stringify(
      polylines.map((p) => ({
        coords: p.coordinates.map((c) => [c.latitude, c.longitude]),
        color: p.color ?? '#2ecc71',
        width: p.width ?? 4,
      })),
    );

    return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; }
    html, body, #map { width: 100%; height: 100%; }
    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: 3px solid white;
      font-size: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', {
      zoomControl: false,
      attributionControl: false,
      dragging: ${interactive},
      touchZoom: ${interactive},
      scrollWheelZoom: ${interactive},
      doubleClickZoom: ${interactive},
      boxZoom: ${interactive},
    }).setView([${center.latitude}, ${center.longitude}], ${initialZoom});

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);

    var markersLayer = {};
    var polylinesLayer = [];

    function createMarkerIcon(color, icon, rotation) {
      return L.divIcon({
        className: '',
        html: '<div class="custom-marker" style="background:' + color + ';transform:rotate(' + rotation + 'deg)">' + icon + '</div>',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });
    }

    function updateMarkers(data) {
      // Remove old markers that no longer exist
      Object.keys(markersLayer).forEach(function(id) {
        if (!data.find(function(m) { return m.id === id; })) {
          map.removeLayer(markersLayer[id]);
          delete markersLayer[id];
        }
      });

      data.forEach(function(m) {
        var icon = createMarkerIcon(m.color, m.icon, m.rotation);
        if (markersLayer[m.id]) {
          markersLayer[m.id].setLatLng([m.lat, m.lng]);
          markersLayer[m.id].setIcon(icon);
        } else {
          markersLayer[m.id] = L.marker([m.lat, m.lng], { icon: icon })
            .bindTooltip(m.title)
            .addTo(map);
        }
      });
    }

    function updatePolylines(data) {
      polylinesLayer.forEach(function(p) { map.removeLayer(p); });
      polylinesLayer = [];
      data.forEach(function(p) {
        var line = L.polyline(p.coords, {
          color: p.color,
          weight: p.width,
          opacity: 0.85,
        }).addTo(map);
        polylinesLayer.push(line);
      });
    }

    function fitAll() {
      var allPoints = [];
      Object.values(markersLayer).forEach(function(m) {
        allPoints.push(m.getLatLng());
      });
      polylinesLayer.forEach(function(p) {
        p.getLatLngs().forEach(function(ll) { allPoints.push(ll); });
      });
      if (allPoints.length >= 2) {
        map.fitBounds(L.latLngBounds(allPoints), { padding: [40, 40] });
      }
    }

    // Initial render
    var initMarkers = ${markersJson};
    var initPolylines = ${polylinesJson};
    updateMarkers(initMarkers);
    updatePolylines(initPolylines);
    ${fitBounds ? 'setTimeout(fitAll, 300);' : ''}

    // Listen for updates from React Native
    document.addEventListener('message', function(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'updateMarkers') updateMarkers(msg.data);
        if (msg.type === 'updatePolylines') updatePolylines(msg.data);
        if (msg.type === 'fitBounds') fitAll();
        if (msg.type === 'recenter' && msg.data) {
          map.setView([msg.data.lat, msg.data.lng], msg.data.zoom || map.getZoom());
        }
      } catch(err) {}
    });
    // Also handle window.addEventListener for Android
    window.addEventListener('message', function(e) {
      try {
        var msg = JSON.parse(e.data);
        if (msg.type === 'updateMarkers') updateMarkers(msg.data);
        if (msg.type === 'updatePolylines') updatePolylines(msg.data);
        if (msg.type === 'fitBounds') fitAll();
        if (msg.type === 'recenter' && msg.data) {
          map.setView([msg.data.lat, msg.data.lng], msg.data.zoom || map.getZoom());
        }
      } catch(err) {}
    });

    // Notify RN that map is ready
    if (window.ReactNativeWebView) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'mapReady' }));
    }
  </script>
</body>
</html>`;
  }, []); // intentionally empty — initial HTML is built once

  // Send marker updates when they change
  useEffect(() => {
    if (!webViewRef.current) return;
    const data = markers.map((m) => ({
      id: m.id,
      lat: m.latitude,
      lng: m.longitude,
      title: m.title ?? '',
      color: m.color ?? '#FF6B35',
      icon: m.icon ?? '📍',
      rotation: m.rotation ?? 0,
    }));
    webViewRef.current.postMessage(
      JSON.stringify({ type: 'updateMarkers', data }),
    );
  }, [markers]);

  // Send polyline updates when they change
  useEffect(() => {
    if (!webViewRef.current) return;
    const data = polylines.map((p) => ({
      coords: p.coordinates.map((c) => [c.latitude, c.longitude]),
      color: p.color ?? '#2ecc71',
      width: p.width ?? 4,
    }));
    webViewRef.current.postMessage(
      JSON.stringify({ type: 'updatePolylines', data }),
    );
  }, [polylines]);

  const handleMessage = useCallback(
    (event: any) => {
      try {
        const msg = JSON.parse(event.nativeEvent.data);
        if (msg.type === 'mapReady' && onMapReady) {
          onMapReady();
        }
      } catch {}
    },
    [onMapReady],
  );

  return (
    <View style={[localStyles.container, style]}>
      <WebView
        ref={webViewRef}
        source={{ html: getHtml() }}
        style={localStyles.webview}
        originWhitelist={['*']}
        javaScriptEnabled
        domStorageEnabled
        scrollEnabled={false}
        bounces={false}
        onMessage={handleMessage}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
        nestedScrollEnabled={false}
        setSupportMultipleWindows={false}
        androidLayerType={Platform.OS === 'android' ? 'hardware' : undefined}
      />
    </View>
  );
}

const localStyles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
