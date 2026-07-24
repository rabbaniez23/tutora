import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';
import { MapView, Marker, Polyline } from '@/src/components/MapComponent';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { Map, MapPin, Phone, MessageCircle } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function Tracking() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <MapView 
        style={styles.mapArea}
        initialRegion={{
          latitude: -6.205000, 
          longitude: 106.818000,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0221,
        }}
      >
        {/* Lokasi Murid */}
        <Marker coordinate={{ latitude: -6.200000, longitude: 106.816666 }}>
          <View style={styles.markerBadge}>
            <MapPin size={16} color="#FFF" />
          </View>
        </Marker>

        {/* Lokasi Guru (Sedang Menuju) */}
        <Marker coordinate={{ latitude: -6.210000, longitude: 106.820000 }}>
          <View style={[styles.markerBadge, { backgroundColor: Colors.secondary }]}>
            <Map size={16} color="#FFF" />
          </View>
        </Marker>
        {/* Garis Penunjuk Rute Perjalanan */}
        <Polyline 
          coordinates={[
            { latitude: -6.210000, longitude: 106.820000 },
            { latitude: -6.205000, longitude: 106.818000 },
            { latitude: -6.200000, longitude: 106.816666 }
          ]}
          strokeWidth={4}
          strokeColor={Colors.secondary}
          lineDashPattern={[0]}
        />
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.etaContainer}>
          <Text style={styles.etaTitle}>Tutor sedang menuju lokasimu</Text>
          <Text style={styles.etaText}>Estimasi Tiba: 5 Menit</Text>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Budi Santoso</Text>
            <Text style={styles.rating}>⭐ 4.9 (Senior Tutor)</Text>
            <Text style={styles.subject}>Matematika SMA</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/(customer)/chat/room')}>
            <MessageCircle size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: Colors.secondary + '20' }]} onPress={() => Linking.openURL('tel:081234567890')}>
            <Phone size={24} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        <Button 
          title="Tutor Telah Tiba (Mulai Belajar)" 
          onPress={() => router.push('/(customer)/order/session')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  mapArea: { flex: 1, backgroundColor: '#E0E0E0' },
  markerBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF', shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.3 },

  bottomSheet: { backgroundColor: '#FFF', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  etaContainer: { alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderColor: Colors.surface },
  etaTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  etaText: { fontSize: 18, color: Colors.primary, fontWeight: 'bold' },

  profileCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  rating: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  subject: { fontSize: 14, color: Colors.textMuted, marginTop: 4, fontWeight: 'bold' },

  actionRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 24 },
  iconBtn: { padding: 16, backgroundColor: Colors.primary + '20', borderRadius: 40, alignItems: 'center', justifyContent: 'center', width: 64, height: 64 }
});
