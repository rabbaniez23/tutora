import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, CheckCircle2 } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

const SUBJECTS = ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Bahasa Indonesia'];
const LEVELS = ['SD', 'SMP', 'SMA'];

export default function SubjectSelection() {
  const router = useRouter();
  const [subject, setSubject] = useState('Matematika');
  const [level, setLevel] = useState('SMA');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Mata Pelajaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Tingkat Pendidikan</Text>
        <View style={styles.chipRow}>
          {LEVELS.map(l => (
            <TouchableOpacity 
              key={l} 
              style={[styles.chip, level === l && styles.chipActive]}
              onPress={() => setLevel(l)}
            >
              <Text style={[styles.chipText, level === l && styles.chipTextActive]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Mata Pelajaran</Text>
        <View style={styles.listContainer}>
          {SUBJECTS.map(s => (
            <TouchableOpacity 
              key={s} 
              style={[styles.listItem, subject === s && styles.listItemActive]}
              onPress={() => setSubject(s)}
            >
              <Text style={[styles.listText, subject === s && styles.listTextActive]}>{s}</Text>
              {subject === s && <CheckCircle2 size={20} color={Colors.primary} />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Estimasi Harga</Text>
          <Text style={styles.priceText}>Rp 100.000 - Rp 150.000 / sesi</Text>
        </View>
        <Button 
          title="Cari Tutor Sekarang" 
          onPress={() => router.push('/(customer)/order/searching')} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#FFF' },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  
  content: { padding: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 16, marginTop: 8 },
  
  chipRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  chip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFF' },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.text },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },

  listContainer: { backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  listItemActive: { backgroundColor: Colors.primary + '10' },
  listText: { fontSize: 16, color: Colors.text },
  listTextActive: { fontWeight: 'bold', color: Colors.primary },

  footer: { backgroundColor: '#FFF', padding: 24, borderTopWidth: 1, borderTopColor: Colors.border },
  priceContainer: { marginBottom: 16 },
  priceLabel: { fontSize: 14, color: Colors.textMuted },
  priceText: { fontSize: 18, fontWeight: 'bold', color: Colors.text }
});
