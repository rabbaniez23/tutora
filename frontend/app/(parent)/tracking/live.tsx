import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MapView, Marker, Polyline } from '@/src/components/MapComponent';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { MapPin, ArrowLeft, Clock, ShieldAlert } from 'lucide-react-native';

export default function ParentLiveTracking() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Pantauan Langsung</Text>
      </View>

      <MapView 
        style={styles.mapArea}
        initialRegion={{
          latitude: -6.205000, 
          longitude: 106.818000,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0221,
        }}
        scrollEnabled={false}
      >
        <Marker coordinate={{ latitude: -6.200000, longitude: 106.816666 }}>
          <View style={styles.markerBadgeStudent}>
            <MapPin size={16} color="#FFF" />
          </View>
        </Marker>
      </MapView>

      <View style={styles.bottomSheet}>
        <View style={styles.activeBanner}>
          <Clock size={20} color="#FFF" style={{ marginRight: 8 }} />
          <Text style={styles.activeBannerText}>Sesi Sedang Berlangsung: 45 Menit Berlalu</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Tutor Pengajar</Text>
          <Text style={styles.value}>Budi Santoso, S.Pd (Matematika)</Text>
          
          <Text style={[styles.label, { marginTop: 16 }]}>Siswa</Text>
          <Text style={styles.value}>Delia Puspitasari</Text>
        </View>

        <View style={styles.safetyBox}>
          <ShieldAlert size={20} color="#FF8C00" />
          <Text style={styles.safetyText}>
            Fitur SOS aktif di perangkat anak maupun pengajar. Anda akan menerima notifikasi suara jika ditekan.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  topBar: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#FFF', position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, elevation: 4 },
  backBtn: { marginRight: 16 },
  topBarTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },

  mapArea: { flex: 1, backgroundColor: '#E0E0E0' },
  markerBadgeStudent: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },

  bottomSheet: { backgroundColor: '#FFF', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  
  activeBanner: { flexDirection: 'row', backgroundColor: Colors.secondary, padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 24, marginTop: -40, elevation: 4, shadowColor: Colors.secondary, shadowOffset: { width:0, height:4 }, shadowOpacity: 0.3 },
  activeBannerText: { color: '#FFF', fontWeight: 'bold', fontSize: 14 },

  infoBox: { marginBottom: 24 },
  label: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  value: { fontSize: 16, fontWeight: 'bold', color: Colors.text },

  safetyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12 },
  safetyText: { fontSize: 12, color: '#E65100', flex: 1, marginLeft: 12, lineHeight: 18 }
});
