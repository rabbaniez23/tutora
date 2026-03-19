import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { Map, MapPin, Phone, MessageCircle } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function ActiveJob() {
  const router = useRouter();
  const [jobStatus, setJobStatus] = useState<'on_the_way' | 'arrived' | 'teaching'>('on_the_way');

  const handleNextAction = () => {
    if (jobStatus === 'on_the_way') {
      setJobStatus('arrived');
    } else if (jobStatus === 'arrived') {
      setJobStatus('teaching');
    } else if (jobStatus === 'teaching') {
      // Finish Session
      Alert.alert('Sesi Selesai', 'Pendapatan telah dimasukkan ke dompet Anda.', [
        { text: 'Oke', onPress: () => router.replace('/(teacher)/(tabs)') }
      ]);
    }
  };

  const getButtonTitle = () => {
    switch (jobStatus) {
      case 'on_the_way': return 'Saya Sudah Sampai';
      case 'arrived': return 'Mulai Sesi Mengajar';
      case 'teaching': return 'Selesaikan Sesi';
    }
  };

  const getButtonVariant = () => {
    return jobStatus === 'teaching' ? 'secondary' : 'primary';
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapArea}>
        <View style={styles.pinStudent}>
          <MapPin size={24} color={Colors.primary} />
        </View>
        <Text style={styles.mapWatermark}>Simulasi Map GPS Tutor</Text>
      </View>

      <View style={styles.bottomSheet}>
        {jobStatus === 'teaching' && (
          <View style={styles.timerBadge}>
            <Text style={styles.timerText}>01:15:20</Text>
            <Text style={styles.timerSub}>Waktu Mengajar</Text>
          </View>
        )}

        {jobStatus !== 'teaching' && (
          <>
            <View style={styles.etaContainer}>
              <Text style={styles.etaTitle}>Menuju Lokasi Siswa</Text>
              <Text style={styles.etaText}>Estimasi: 5 Menit (2km)</Text>
            </View>

            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>A</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.name}>Andi Siswa</Text>
                <Text style={styles.subject}>SMA - Matematika</Text>
              </View>
              
              <View style={styles.actionRowMini}>
                <TouchableOpacity style={styles.iconBtnMini}>
                  <MessageCircle size={20} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.iconBtnMini, { backgroundColor: Colors.secondary + '20' }]}>
                  <Phone size={20} color={Colors.secondary} />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <Button 
          title={getButtonTitle()} 
          variant={getButtonVariant() as 'primary' | 'secondary'}
          onPress={handleNextAction} 
          style={styles.mainActionBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  mapArea: { flex: 1, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  pinStudent: { position: 'absolute', bottom: '40%', left: '50%' },
  mapWatermark: { fontSize: 24, fontWeight: 'bold', color: '#FFF', position: 'absolute', opacity: 0.5 },

  bottomSheet: { backgroundColor: '#FFF', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  
  etaContainer: { alignItems: 'center', marginBottom: 24, paddingBottom: 16, borderBottomWidth: 1, borderColor: Colors.surface },
  etaTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  etaText: { fontSize: 18, color: Colors.primary, fontWeight: 'bold' },

  profileCard: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  avatarText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
  profileInfo: { flex: 1 },
  name: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  subject: { fontSize: 14, color: Colors.textMuted, marginTop: 4, fontWeight: 'bold' },

  actionRowMini: { flexDirection: 'row', gap: 8 },
  iconBtnMini: { padding: 8, backgroundColor: Colors.primary + '20', borderRadius: 24, alignItems: 'center', justifyContent: 'center', width: 40, height: 40 },

  timerBadge: { alignItems: 'center', marginBottom: 32 },
  timerText: { fontSize: 48, fontWeight: 'bold', color: Colors.text },
  timerSub: { fontSize: 16, color: Colors.textMuted },

  mainActionBtn: { width: '100%' }
});
