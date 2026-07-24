import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import Colors from '@/src/constants/Colors';
import { useFamilyStore } from '@/src/store/useFamilyStore';
import { Calendar } from 'lucide-react-native';

export default function ParentReports() {
  const { reports, children } = useFamilyStore();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Laporan Pembelajaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {reports.map(report => {
          const childName = children.find(c => c.id === report.childId)?.name || 'Anak';
          
          return (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <Image source={{ uri: report.photoUrl }} style={styles.tutorPic} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.subject}>{report.subject}</Text>
                  <Text style={styles.tutorName}>{report.tutorName} (Tutor)</Text>
                  <Text style={styles.childLabel}>Siswa: {childName}</Text>
                </View>
                <View style={styles.dateBox}>
                  <Calendar size={14} color={Colors.textMuted} style={{ marginRight: 4 }} />
                  <Text style={styles.dateText}>{report.date}</Text>
                </View>
              </View>

              <Text style={styles.summaryTitle}>Evaluasi / Materi:</Text>
              <Text style={styles.summaryText}>"{report.summary}"</Text>

              <View style={styles.characterRow}>
                {report.characters.map(char => (
                  <View key={char} style={styles.chip}>
                    <Text style={styles.chipText}>{char}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  
  content: { padding: 20 },
  reportCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  
  reportHeader: { flexDirection: 'row', marginBottom: 16, alignItems: 'flex-start' },
  tutorPic: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0E0E0', marginRight: 12 },
  subject: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  tutorName: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  childLabel: { fontSize: 12, color: Colors.primary, marginTop: 4, fontWeight: 'bold' },
  
  dateBox: { flexDirection: 'row', alignItems: 'center' },
  dateText: { fontSize: 12, color: Colors.textMuted },

  summaryTitle: { fontSize: 13, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  summaryText: { fontSize: 14, color: Colors.text, lineHeight: 20, fontStyle: 'italic', marginBottom: 16 },

  characterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { backgroundColor: Colors.lightBlue, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  chipText: { color: Colors.primary, fontSize: 12, fontWeight: 'bold' }
});
