import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { CheckCircle, Clock, Video, MonitorPlay } from 'lucide-react-native';
import { useAuthStore } from '@/src/store/useAuthStore';
import Button from '@/src/components/ui/Button';

export default function TeacherWaitingRoom() {
  const router = useRouter();
  const { tutorStatus, setTutorStatus } = useAuthStore();

  useEffect(() => {
    if (tutorStatus === 'approved') {
      router.replace('/(teacher)/(tabs)');
    }
  }, [tutorStatus]);

  const devBypassApproval = () => {
    setTutorStatus('approved');
    router.replace('/(teacher)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Status Pelamar Tutor</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Data Diterima!</Text>
        <Text style={styles.subtitle}>Terima kasih telah melamar. Saat ini data sedang dalam peninjauan oleh tim internal kami.</Text>

        <View style={styles.timelineBox}>
          
          <View style={styles.step}>
            <View style={styles.stepIconSuccess}>
              <CheckCircle size={20} color="#FFF" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Verifikasi Administratif & KYC</Text>
              <Text style={styles.stepDesc}>Data KTP dan berkas pendidikan telah tervalidasi.</Text>
            </View>
          </View>

          <View style={styles.stepLine} />

          <View style={styles.step}>
            <View style={styles.stepIconPending}>
              <Video size={20} color="#FFF" />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Review Komunikasi (Sedang Berjalan)</Text>
              <Text style={styles.stepDesc}>Video perkenalan diri Anda sedang dievaluasi. Estimasi waktu maksimal 1x24 Jam kerja.</Text>
            </View>
            <Clock size={16} color={Colors.orange} style={{ position: 'absolute', right: 0, top: 4 }} />
          </View>

          <View style={styles.stepLineDashed} />

          <View style={styles.step}>
            <View style={styles.stepIconInactive}>
              <MonitorPlay size={20} color={Colors.textMuted} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitleInactive}>Interview via Zoom</Text>
              <Text style={styles.stepDescInactive}>Akan dijadwalkan setelah lolos evaluasi video.</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoBanner}>
          <Text style={styles.infoBannerText}>
            Mohon pantau aplikasi secara berkala atau cek email yang didaftarkan untuk mendapatkan undangan selanjutnya.
          </Text>
        </View>

      </ScrollView>

      {/* DEV BUTTON FOR PRESENTATION PURPOSES TO BYPASS WAITING ROOM */}
      <View style={styles.devFooter}>
        <Text style={styles.devHint}>Mode Simulasi (Lomba): Bypass Peninjauan</Text>
        <Button 
          title="Terima Aplikasi & Masuk Dashboard" 
          onPress={devBypassApproval} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.primary },
  
  content: { padding: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 32, lineHeight: 22, textAlign: 'center' },

  timelineBox: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, borderWidth: 1, borderColor: Colors.border, marginBottom: 24 },
  
  step: { flexDirection: 'row', alignItems: 'flex-start' },
  stepIconSuccess: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.secondary, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  stepIconPending: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.orange, justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  stepIconInactive: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: Colors.border, zIndex: 2 },
  
  stepContent: { flex: 1, marginLeft: 16, paddingRight: 24 },
  stepTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  stepDesc: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },
  
  stepTitleInactive: { fontSize: 14, fontWeight: 'bold', color: Colors.textMuted, marginBottom: 4 },
  stepDescInactive: { fontSize: 12, color: Colors.textMuted, lineHeight: 18 },

  stepLine: { width: 2, height: 30, backgroundColor: Colors.secondary, marginLeft: 19, marginVertical: -2 },
  stepLineDashed: { width: 2, height: 30, backgroundColor: Colors.border, marginLeft: 19, marginVertical: -2, borderStyle: 'dashed', borderWidth: 1, borderColor: Colors.border },

  infoBanner: { backgroundColor: '#E3F2FD', padding: 16, borderRadius: 12 },
  infoBannerText: { fontSize: 13, color: '#1565C0', lineHeight: 20, textAlign: 'center' },

  devFooter: { padding: 24, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: '#FFF' },
  devHint: { fontSize: 11, color: Colors.textMuted, textAlign: 'center', marginBottom: 8, fontStyle: 'italic' }
});
