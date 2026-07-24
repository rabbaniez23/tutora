import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, CheckCircle2, FileText, UploadCloud } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function TeacherDocuments() {
  const router = useRouter();
  
  const [ktmUploaded, setKtmUploaded] = useState(false);
  const [cvUploaded, setCvUploaded] = useState(false);
  const [transkripUploaded, setTranskripUploaded] = useState(false);
  const [portfolioUploaded, setPortfolioUploaded] = useState(false);

  const canProceed = ktmUploaded && cvUploaded;

  const renderDocCard = (
    title: string, 
    desc: string, 
    isUploaded: boolean, 
    onUpload: () => void,
    required: boolean = true
  ) => (
    <View style={styles.docCard}>
      <View style={styles.docInfo}>
        <View style={styles.docTitleRow}>
          <FileText size={20} color={Colors.primary} style={{ marginRight: 8 }} />
          <Text style={styles.docTitle}>{title} {required ? '*' : '(Opsional)'}</Text>
        </View>
        <Text style={styles.docDesc}>{desc}</Text>
      </View>
      <TouchableOpacity 
        style={[styles.uploadBtn, isUploaded && styles.uploadBtnSuccess]}
        onPress={onUpload}
      >
        {isUploaded ? (
          <CheckCircle2 size={24} color={Colors.secondary} />
        ) : (
          <UploadCloud size={24} color={Colors.textMuted} />
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Verifikasi Dokumen (3/4)</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dokumen Pendukung</Text>
        <Text style={styles.subtitle}>Unggah berkas akademik Anda untuk verifikasi jenjang pendidikan minimum.</Text>

        {renderDocCard(
          "KTM / Ijazah Terakhir", 
          "Foto kartu mahasiswa aktif atau ijazah kelulusan.", 
          ktmUploaded, 
          () => setKtmUploaded(true)
        )}

        {renderDocCard(
          "Curriculum Vitae (CV)", 
          "PDF ringkasan pengalaman pendidikan atau bekerja.", 
          cvUploaded, 
          () => setCvUploaded(true)
        )}

        {renderDocCard(
          "Portofolio (Tutor)", 
          "Dokumen pendukung penghargaan, piagam, atau karya. (Sangat disarankan)", 
          portfolioUploaded, 
          () => setPortfolioUploaded(true),
          false
        )}

        {renderDocCard(
          "Transkrip Nilai", 
          "Bukti perolehan IPK terakhir.", 
          transkripUploaded, 
          () => setTranskripUploaded(true),
          false
        )}

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            Pastikan dokumen yang diunggah dapat terbaca dengan jelas. Pemalsuan dokumen dapat berakibat pada pemblokiran akun permanen sesuai UU ITE.
          </Text>
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Lanjut ke Video Perkenalan" 
          onPress={() => router.push('/(auth)/teacher/video')} 
          disabled={!canProceed}
          style={!canProceed ? { backgroundColor: Colors.border } : {}}
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

  docCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, elevation: 1 },
  docInfo: { flex: 1, paddingRight: 12 },
  docTitleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  docTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  docDesc: { fontSize: 11, color: Colors.textMuted },
  
  uploadBtn: { width: 48, height: 48, borderRadius: 12, backgroundColor: Colors.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#D0D0D0', borderStyle: 'dashed' },
  uploadBtnSuccess: { backgroundColor: Colors.lightGreen, borderColor: Colors.secondary, borderStyle: 'solid' },

  warningBox: { backgroundColor: '#FFF3E0', padding: 16, borderRadius: 12, marginTop: 12 },
  warningText: { fontSize: 12, color: '#E65100', lineHeight: 18 },

  footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: Colors.border }
});
