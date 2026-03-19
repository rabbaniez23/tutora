import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { Map, MapPin, Phone, MessageCircle } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function Tracking() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapArea}>
        <View style={styles.pinStudent}>
          <MapPin size={24} color={Colors.primary} />
        </View>
        <View style={styles.pinTeacher}>
          <Map size={24} color={Colors.secondary} />
        </View>
        <Text style={styles.mapWatermark}>Simulasi Tracking Live</Text>
      </View>

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
          <TouchableOpacity style={styles.iconBtn}>
            <MessageCircle size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, { backgroundColor: Colors.secondary + '20' }]}>
            <Phone size={24} color={Colors.secondary} />
          </TouchableOpacity>
        </View>

        <Button 
          title="Selesaikan Sesi (Simulasi)" 
          onPress={() => router.push('/(customer)/order/review')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  mapArea: { flex: 1, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  pinStudent: { position: 'absolute', bottom: '30%', left: '40%' },
  pinTeacher: { position: 'absolute', bottom: '50%', right: '30%' },
  mapWatermark: { fontSize: 24, fontWeight: 'bold', color: '#FFF', position: 'absolute', opacity: 0.5 },

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
