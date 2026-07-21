import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Camera, CheckCircle2, ScanFace, UploadCloud } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function TeacherKYC() {
  const router = useRouter();
  const [ktpUploaded, setKtpUploaded] = useState(false);
  const [faceScanned, setFaceScanned] = useState(false);

  // Simulasi sukses API Privy KYC
  const isKycComplete = ktpUploaded && faceScanned;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifikasi Identitas (2/4)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Data Pribadi & Keamanan</Text>
        <Text style={styles.subtitle}>Sesuai regulasi keamanan, kami menggunakan API KYC Privy.id (Rp 2.000/verifikasi) untuk memverifikasi KTP dan keaslian wajah Anda.</Text>

        {/* Simulasi Upload KTP */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Foto KTP (Kartu Tanda Penduduk)</Text>
            {ktpUploaded && <CheckCircle2 size={20} color={Colors.secondary} />}
          </View>
          
          <TouchableOpacity 
            style={[styles.uploadBox, ktpUploaded && styles.uploadBoxSuccess]}
            onPress={() => setKtpUploaded(true)}
          >
            {ktpUploaded ? (
              <>
                <CheckCircle2 size={32} color={Colors.secondary} style={{ marginBottom: 12 }} />
                <Text style={styles.successText}>KTP Berhasil Terdeteksi & Terbaca</Text>
              </>
            ) : (
              <>
                <Camera size={32} color={Colors.textMuted} style={{ marginBottom: 12 }} />
                <Text style={styles.uploadText}>Ambil Foto KTP via Kamera Native</Text>
                <Text style={styles.subUploadText}>Pastikan NIK terlihat jelas dan tidak buram</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Simulasi Liveness Detection */}
        <View style={[styles.card, { opacity: ktpUploaded ? 1 : 0.5 }]}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Liveness Detection / Swafoto</Text>
            {faceScanned && <CheckCircle2 size={20} color={Colors.secondary} />}
          </View>
          
          <TouchableOpacity 
            style={[styles.uploadBox, faceScanned && styles.uploadBoxSuccess]}
            onPress={() => ktpUploaded && setFaceScanned(true)}
            disabled={!ktpUploaded}
          >
            {faceScanned ? (
              <>
                <ScanFace size={32} color={Colors.secondary} style={{ marginBottom: 12 }} />
                <Text style={styles.successText}>Wajah Cocok dengan KTP (Privy API Match)</Text>
              </>
            ) : (
              <>
                <ScanFace size={32} color={Colors.textMuted} style={{ marginBottom: 12 }} />
                <Text style={styles.uploadText}>Mulai Pengenalan Wajah</Text>
                <Text style={styles.subUploadText}>Harap lepas masker atau kacamata</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.privyBanner}>
          <Text style={styles.privyText}>Data diamankan & dienkripsi oleh standard API</Text>
          <Text style={styles.privyBold}>Privy.id Enterprise</Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Lanjut ke Dokumen Pendukung" 
          onPress={() => router.push('/(auth)/teacher/documents')} 
          disabled={!isKycComplete}
          style={!isKycComplete ? { backgroundColor: Colors.border } : {}}
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
  
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 24, lineHeight: 20 },

  card: { backgroundColor: '#FFF', borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, elevation: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.text },

  uploadBox: { height: 160, backgroundColor: Colors.lightGray, borderRadius: 12, borderWidth: 2, borderColor: '#D0D0D0', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', padding: 20 },
  uploadBoxSuccess: { backgroundColor: Colors.lightGreen, borderColor: Colors.secondary, borderStyle: 'solid' },
  uploadText: { fontSize: 14, fontWeight: 'bold', color: Colors.text, textAlign: 'center' },
  subUploadText: { fontSize: 11, color: Colors.textMuted, marginTop: 4, textAlign: 'center' },
  successText: { fontSize: 14, fontWeight: 'bold', color: Colors.secondary, textAlign: 'center' },

  privyBanner: { backgroundColor: Colors.lightBlue, padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 12 },
  privyText: { fontSize: 11, color: Colors.primary },
  privyBold: { fontSize: 14, fontWeight: 'bold', color: Colors.primary, marginTop: 4 },

  footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: Colors.border }
});
