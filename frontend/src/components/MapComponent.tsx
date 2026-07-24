import React from 'react';
import { View, Image } from 'react-native';

export const MapView = ({ style, region, children }: any) => {
  const lat = region?.latitude || -6.200000;
  const lng = region?.longitude || 106.816666;
  
  // Menggunakan Yandex Static Maps API (Gratis, tanpa API Key) agar peta selalu "keliatan"
  const mapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lng},${lat}&size=600,450&z=15&l=map&pt=${lng},${lat},pm2rdm`;

  return (
    <View style={style}>
      <Image 
        source={{ uri: mapUrl }}
        style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
      />
      {/* Meng-overlay marker di tengah peta statis */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
        {children}
      </View>
    </View>
  );
};

export const Marker = ({ children }: any) => {
  return (
    <View style={{ transform: [{ translateY: -16 }] }}>
      {children}
    </View>
  );
};

export const Polyline = () => null;
export type MapViewProps = any;
