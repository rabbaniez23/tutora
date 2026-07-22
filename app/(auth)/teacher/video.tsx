import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Video, Play, StopCircle, Upload } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';
import { useAuthStore, TutorStatus } from '@/src/store/useAuthStore';

export default function TeacherVideo() {
  const router = useRouter();
  const setTutorStatus = useAuthStore(state => state.setTutorStatus);

  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState<string | null>(null);

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      setVideoUri('mock-video-path.mp4'); // Simulasi selesai rekam
    } else {
      setVideoUri(null);
      setIsRecording(true);
    }
  };

  const submitApplication = () => {
    if (Platform.OS === 'web') {
      const isConfirmed = window.confirm("Apakah Anda yakin data dan video sudah sesuai?");
      if (isConfirmed) {
        setTutorStatus('review_video');
        router.push('/(teacher)/waiting');
      }
      return;
    }

    Alert.alert(
      "Kirim Pendaftaran",
      "Apakah Anda yakin data dan video sudah sesuai?",
      [
        { text: "Batal", style: 'cancel' },
        { 
          text: "Kirim", 
          onPress: () => {
            // Update auth state tutor menjadi review
            setTutorStatus('review_video');
            router.push('/(teacher)/waiting');
          }
        }
      ]
    )
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Video Perkenalan (4/4)</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Evaluasi Komunikasi</Text>
        <Text style={styles.subtitle}>Guru merekam video perkenalan diri dari dalam app. Tim Tutora akan me-review manual dalam 24 jam. Ini adalah filter kualitas komunikasi — guru yang tidak percaya diri di video biasanya tidak cocok untuk mengajar langsung.</Text>

        <View style={styles.cameraBox}>
          {videoUri ? (
            <View style={styles.videoPlaceholder}>
              <Play size={48} color="#FFF" />
              <Text style={styles.videoText}>Pratinjau Video (1 Menit)</Text>
            </View>
          ) : (
            <View style={styles.cameraPlaceholder}>
              {isRecording ? (
                <>
                  <View style={styles.recordingDot} />
                  <Text style={styles.recordingText}>Sedang Merekam 00:15 / 01:00</Text>
                </>
              ) : (
                <>
                  <Video size={48} color={Colors.textMuted} />
                  <Text style={styles.camInstruction}>Ketuk tombol di bawah untuk merekam</Text>
                </>
              )}
            </View>
          )}
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity 
            style={[styles.recordBtn, isRecording && styles.recordBtnActive]} 
            onPress={handleRecordToggle}
          >
            {isRecording ? <StopCircle size={24} color="#FFF" /> : <Video size={24} color="#FFF" />}
            <Text style={styles.recordBtnText}>{isRecording ? "Hentikan" : "Mulai Rekam Wajah"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.guidelineBox}>
          <Text style={styles.guideTitle}>Panduan Video:</Text>
          <Text style={styles.guideText}>1. Perkenalan Diri Singkat (Nama, Latar Belakang)</Text>
          <Text style={styles.guideText}>2. Mengapa tertarik bergabung dengan Tutora?</Text>
          <Text style={styles.guideText}>3. Berikan simulasi mini cara Anda menjelaskan materi sederhana.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Button 
          title="Kirim Pendaftaran" 
          onPress={submitApplication}
          disabled={!videoUri}
          style={!videoUri ? { backgroundColor: Colors.border } : {}}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  
  content: { flex: 1, padding: 24 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 24, lineHeight: 20 },

  cameraBox: { height: 350, backgroundColor: '#000', borderRadius: 24, overflow: 'hidden', marginBottom: 24 },
  cameraPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#333' },
  camInstruction: { color: Colors.textMuted, marginTop: 12, fontSize: 12 },
  
  recordingDot: { width: 16, height: 16, borderRadius: 8, backgroundColor: '#FF3B30', marginBottom: 12 },
  recordingText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },

  videoPlaceholder: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary },
  videoText: { color: '#FFF', marginTop: 12, fontWeight: 'bold' },

  controlsRow: { alignItems: 'center', marginBottom: 24 },
  recordBtn: { flexDirection: 'row', backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 14, borderRadius: 30, alignItems: 'center' },
  recordBtnActive: { backgroundColor: '#FF3B30' },
  recordBtnText: { color: '#FFF', fontWeight: 'bold', marginLeft: 8 },

  guidelineBox: { backgroundColor: Colors.surfaceLight, padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  guideTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  guideText: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },

  footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: Colors.border }
});
