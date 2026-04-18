import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { Clock, CheckCircle2, ShieldAlert } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function StudySession() {
  const router = useRouter();
  
  // Timer mock untuk 60 menit (3600 detik)
  const [timeLeft, setTimeLeft] = useState(3600);

  useEffect(() => {
    const timerId = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
  };

  const endSession = () => {
    Alert.alert(
      "Akhiri Sesi",
      "Apakah kamu yakin ingin mengakhiri sesi belajar ini lebih awal?",
      [
        { text: "Lanjutkan Belajar", style: "cancel" },
        { 
          text: "Ya, Selesaikan", 
          onPress: () => router.push('/(customer)/order/review?teacherId=1'),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <CheckCircle2 size={24} color={Colors.secondary} style={{ marginRight: 8 }} />
        <Text style={styles.headerTitle}>Sesi Berjalan</Text>
      </View>

      <View style={styles.content}>
        
        <View style={styles.tutorCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>B</Text>
          </View>
          <Text style={styles.tutorName}>Budi Santoso</Text>
          <Text style={styles.tutorSubject}>Matematika - Kalkulus (1 Jam)</Text>
        </View>

        <View style={styles.timerCircle}>
          <Clock size={40} color={Colors.primary} style={{ marginBottom: 16 }} />
          <Text style={styles.timerLabel}>Sisa Waktu Belajar</Text>
          <Text style={styles.timerValue}>{formatTime(timeLeft)}</Text>
        </View>

        <View style={styles.safetyBox}>
          <ShieldAlert size={20} color="#FF8C00" />
          <Text style={styles.safetyText}>Pusat keamanan aktif. Tombol darurat tersedia apabila terdapat perilaku menyimpang.</Text>
        </View>

      </View>

      <View style={styles.footer}>
        <Button 
          title="Akhiri Kelas & Beri Ulasan" 
          onPress={endSession} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 16, 
    paddingTop: 60, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border 
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.secondary },

  content: { flex: 1, padding: 24, alignItems: 'center', justifyContent: 'center' },

  tutorCard: { 
    alignItems: 'center',
    marginBottom: 48 
  },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: 'bold', color: '#FFF' },
  tutorName: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  tutorSubject: { fontSize: 16, color: Colors.textMuted },

  timerCircle: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 8,
    borderColor: '#E6F0FF',
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 12,
    shadowColor: Colors.primary, shadowOffset: { width:0, height:8 }, shadowOpacity: 0.2, shadowRadius: 16,
    marginBottom: 48
  },
  timerLabel: { fontSize: 16, color: Colors.textMuted, marginBottom: 8, fontWeight: '600' },
  timerValue: { fontSize: 40, fontWeight: 'bold', color: Colors.primary, fontVariant: ['tabular-nums'] },

  safetyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 16,
    borderRadius: 16,
    width: '100%'
  },
  safetyText: { fontSize: 13, color: '#E65100', flex: 1, marginLeft: 12, lineHeight: 20 },

  footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: Colors.border }
});
