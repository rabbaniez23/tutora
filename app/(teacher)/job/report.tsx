import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Camera, CheckCircle2, UploadCloud } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';
import { useFamilyStore } from '@/src/store/useFamilyStore';

const CHARACTERS = [
  'Fokus Tajam', 'Kurang Aktif', 'Pemahaman Cepat', 'Membutuhkan Pengulangan', 'Kreatif', 'Logis'
];

export default function JobReport() {
  const router = useRouter();
  const addReport = useFamilyStore(state => state.addReport);

  const [summary, setSummary] = useState('');
  const [selectedChars, setSelectedChars] = useState<string[]>([]);
  const [photoUploaded, setPhotoUploaded] = useState(false);

  const toggleChar = (char: string) => {
    if (selectedChars.includes(char)) {
      setSelectedChars(prev => prev.filter(c => c !== char));
    } else {
      setSelectedChars(prev => [...prev, char]);
    }
  };

  const handleSubmit = () => {
    if (!summary || selectedChars.length === 0 || !photoUploaded) {
      Alert.alert("Laporan Belum Lengkap", "Harap isi ringkasan materi, pilih minimal 1 karakter anak, dan unggah foto bukti.");
      return;
    }

    addReport({
      id: "r" + Math.random().toString(36).substr(2, 9),
      childId: "c1", // Mock
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      subject: "Matematika SMA",
      tutorName: "Budi Santoso, S.Pd",
      summary: summary,
      characters: selectedChars,
      photoUrl: "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=400&h=300" // Mock image
    });

    Alert.alert("Laporan Terkirim", "Laporan selesai dikirim. Pendapatan sesi telah masuk ke saldo TutorPay Anda.", [
      { text: "Tutup", onPress: () => router.replace('/(teacher)/(tabs)') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laporan Pembelajaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Evaluasi Siswa</Text>
        <Text style={styles.subtitle}>Isi laporan di bawah ini untuk menginformasikan Orang Tua tentang perkembangan anaknya.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Ringkasan Materi & Progres</Text>
          <TextInput 
            style={styles.textArea} 
            placeholder="Siswa hari ini memelajari tentang..." 
            multiline 
            numberOfLines={4} 
            value={summary}
            onChangeText={setSummary}
            textAlignVertical="top"
          />
        </View>

        <Text style={styles.label}>Analisis Karakter / Gaya Belajar</Text>
        <View style={styles.chipRow}>
          {CHARACTERS.map(char => (
            <TouchableOpacity 
              key={char} 
              style={[styles.chip, selectedChars.includes(char) && styles.chipActive]}
              onPress={() => toggleChar(char)}
            >
              <Text style={[styles.chipText, selectedChars.includes(char) && styles.chipTextActive]}>{char}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.label, { marginTop: 16 }]}>Bukti Pembelajaran (Foto Bersama Siswa)</Text>
        <TouchableOpacity 
          style={[styles.uploadBox, photoUploaded && styles.uploadBoxSuccess]}
          onPress={() => setPhotoUploaded(true)}
        >
          {photoUploaded ? (
            <>
              <CheckCircle2 size={32} color={Colors.secondary} style={{ marginBottom: 8 }} />
              <Text style={styles.successText}>Foto berhasil diunggah</Text>
            </>
          ) : (
            <>
              <Camera size={32} color={Colors.textMuted} style={{ marginBottom: 8 }} />
              <Text style={styles.uploadText}>Ketuk untuk ambil / unggah foto</Text>
            </>
          )}
        </TouchableOpacity>

      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Kirim Laporan & Selesaikan Sesi" 
          onPress={handleSubmit} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 16, paddingTop: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border, alignItems: 'center' },
  headerTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.primary },
  
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 13, color: Colors.textMuted, marginBottom: 24, lineHeight: 20 },

  formGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  
  textArea: { backgroundColor: '#FFF', borderWidth: 1, borderColor: '#D0D0D0', borderRadius: 12, padding: 16, minHeight: 120, fontSize: 14, color: Colors.text },

  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 24 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFF' },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 12, color: Colors.text },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },

  uploadBox: { height: 140, backgroundColor: Colors.surface, borderRadius: 16, borderWidth: 2, borderColor: '#D0D0D0', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', padding: 20 },
  uploadBoxSuccess: { backgroundColor: Colors.lightGreen, borderColor: Colors.secondary, borderStyle: 'solid' },
  uploadText: { fontSize: 13, color: Colors.textMuted, marginTop: 4 },
  successText: { fontSize: 14, fontWeight: 'bold', color: Colors.secondary },

  footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: Colors.border }
});
