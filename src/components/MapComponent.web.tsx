import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Map } from 'lucide-react-native';

export const MapView = ({ children, style }: any) => (
  <View style={[styles.fallback, style]}>
    <View style={styles.overlay}>
      <Map size={48} color="#7A8C9E" />
      <Text style={styles.text}>Live Map Rendering (Native App Only)</Text>
      <Text style={styles.subText}>Coba jalankan di Emulator Android/iOS untuk melihat peta interaktif.</Text>
    </View>
    <View style={styles.childrenWrapper}>
      {children}
    </View>
  </View>
);

export const Marker = ({ children }: any) => {
  return (
    <View style={styles.mockMarker}>
      {children}
    </View>
  );
};

export const Polyline = () => null;

const styles = StyleSheet.create({
  fallback: { backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  overlay: { alignItems: 'center', opacity: 0.6, padding: 20 },
  text: { fontSize: 16, fontWeight: 'bold', color: '#4A5A75', marginTop: 12, textAlign: 'center' },
  subText: { fontSize: 12, color: '#7A8C9E', textAlign: 'center', marginTop: 6 },
  childrenWrapper: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  mockMarker: { marginHorizontal: 20 }
});
