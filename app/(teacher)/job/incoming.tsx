import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { MapPin, Briefcase, User, FileText } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';
import { useFamilyStore } from '@/src/store/useFamilyStore';

export default function IncomingJob() {
  const router = useRouter();
  
  // Ambil data siswa simulasi dari store
  const child = useFamilyStore(state => state.children.find(c => c.id === 'c1'));
  const latestReport = useFamilyStore(state => state.reports.filter(r => r.childId === 'c1').pop());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContent}>
        
        <View style={styles.header}>
          <Text style={styles.title}>Pesanan Masuk!</Text>
          <Text style={styles.price}>Rp 150.000</Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 450, marginBottom: 24 }}>
          {/* Detail Kelas */}
          <View style={styles.detailsGroup}>
            <View style={styles.detailRow}>
              <Briefcase size={20} color={Colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Mata Pelajaran</Text>
                <Text style={styles.detailValue}>Matematika SMA</Text>
              </View>
            </View>
            
            <View style={styles.detailRow}>
              <MapPin size={20} color={Colors.primary} />
              <View style={styles.detailTextContainer}>
                <Text style={styles.detailLabel}>Lokasi (Jarak: 2 km)</Text>
                <Text style={styles.detailValue}>Jl. Sudirman No. 123</Text>
              </View>
            </View>
          </View>

          {/* Profil Anak & Riwayat */}
          <Text style={styles.cardSectionTitle}>Informasi Pemesan</Text>
          <View style={styles.studentCard}>
            
            <View style={styles.studentInfoRow}>
              {child?.avatar ? (
                <Image source={{ uri: child.avatar }} style={styles.avatar} />
              ) : (
                <View style={styles.avatarPlaceholder}><User size={24} color="#FFF" /></View>
              )}
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{child?.name || "Nama Siswa"}</Text>
                <Text style={styles.studentGrade}>{child?.grade || "Kelas"}</Text>
              </View>
            </View>
            
            {latestReport && (
              <View style={styles.reportContainer}>
                <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 8}}>
                  <FileText size={16} color={Colors.secondary} />
                  <Text style={styles.reportTitle}>Laporan Tutor Sebelumnya</Text>
                </View>
                <Text style={styles.reportTutor}>Oleh: {latestReport.tutorName} • {latestReport.date}</Text>
                <Text style={styles.reportSummary}>"{latestReport.summary}"</Text>
                
                <View style={styles.chipRow}>
                  {latestReport.characters.map((char: string, idx: number) => (
                    <View key={idx} style={styles.chip}>
                      <Text style={styles.chipText}>{char}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {!latestReport && (
              <View style={styles.reportContainer}>
                 <Text style={styles.reportSummary}>Belum ada riwayat pembelajaran sebelumnya.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.btnGroup}>
          <Button 
            title="Tolak" 
            variant="outline" 
            style={styles.rejectBtn}
            onPress={() => router.back()}
          />
          <Button 
            title="Terima Kelas" 
            style={styles.acceptBtn}
            onPress={() => router.replace('/(teacher)/job/active')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  
  header: { alignItems: 'center', marginBottom: 24, marginTop: 8 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  price: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },

  detailsGroup: { backgroundColor: '#F8F9FB', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  detailTextContainer: { marginLeft: 16 },
  detailLabel: { fontSize: 12, color: Colors.textMuted },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: Colors.text },

  cardSectionTitle: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginBottom: 12, marginLeft: 4 },
  
  studentCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 16, borderWidth: 1, borderColor: Colors.border },
  studentInfoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.surface },
  avatarPlaceholder: { width: 50, height: 50, borderRadius: 25, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center' },
  studentInfo: { marginLeft: 16, flex: 1 },
  studentName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  studentGrade: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },

  reportContainer: { backgroundColor: '#F0F9FF', padding: 12, borderRadius: 12, borderTopWidth: 1, borderTopColor: '#E1F0FF' },
  reportTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.secondary, marginLeft: 8 },
  reportTutor: { fontSize: 11, color: '#7A8C9E', marginBottom: 8 },
  reportSummary: { fontSize: 13, fontStyle: 'italic', color: Colors.text, lineHeight: 20, marginBottom: 12 },
  
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  chip: { backgroundColor: Colors.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  chipText: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },

  btnGroup: { flexDirection: 'row', gap: 16 },
  rejectBtn: { flex: 1 },
  acceptBtn: { flex: 2 }
});
