import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/src/constants/Colors';
import { Clock } from 'lucide-react-native';

const TABS = ['Berjalan', 'Selesai', 'Batal'];

export default function TeacherHistory() {
  const [activeTab, setActiveTab] = useState('Selesai');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Mengajar</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        {TABS.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tabBtn, activeTab === tab && styles.tabBtnActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Section: OKTOBER 2023 */}
        <Text style={styles.monthLabel}>OKTOBER 2023</Text>

        {/* Card 1 */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Image source={{ uri: 'https://ui-avatars.com/api/?name=Andi+P&background=1f4e8c&color=fff' }} style={styles.avatar} />
            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.courseTitle} numberOfLines={1}>Matematika - Kalkulus</Text>
                <View style={styles.badgeSuccess}>
                  <Text style={styles.badgeSuccessText}>SELESAI</Text>
                </View>
              </View>
              <Text style={styles.tutorName}>Siswa: Andi Pratama</Text>
              <Text style={styles.dateTime}>🗓️ 12 Okt 2023 • 15:00</Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Pendapatan Diterima</Text>
              <Text style={styles.priceValue}>Rp 120.000</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <Clock size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>Log Sesi</Text>
            </TouchableOpacity>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16, 
    backgroundColor: '#FFF' 
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A1E3F' },
  
  tabContainer: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF',
    borderBottomWidth: 1, 
    borderBottomColor: Colors.border,
    paddingHorizontal: 20
  },
  tabBtn: { 
    flex: 1, 
    paddingVertical: 16, 
    alignItems: 'center', 
    borderBottomWidth: 3, 
    borderBottomColor: 'transparent' 
  },
  tabBtnActive: { borderBottomColor: '#1f4e8c' },
  tabText: { fontSize: 14, fontWeight: 'bold', color: Colors.textMuted },
  tabTextActive: { color: '#1f4e8c' },

  content: { padding: 20, paddingBottom: 40 },
  
  monthLabel: { fontSize: 13, fontWeight: 'bold', color: '#7A8C9E', letterSpacing: 1, marginBottom: 12, marginTop: 8 },

  card: { backgroundColor: '#FFF', borderRadius: 24, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: Colors.border, elevation: 1, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  cardTop: { flexDirection: 'row', marginBottom: 20 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#E0E0E0', marginRight: 16 },
  cardInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  courseTitle: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#0A1E3F', marginRight: 8, lineHeight: 22 },
  
  badgeSuccess: { backgroundColor: '#E8F6ED', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeSuccessText: { color: '#1C9672', fontSize: 10, fontWeight: 'bold' },
  
  tutorName: { fontSize: 13, color: '#4A5A75', marginBottom: 6, fontWeight: '600' },
  dateTime: { fontSize: 11, color: '#7A8C9E' },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceCol: { flex: 1 },
  priceLabel: { fontSize: 11, color: '#7A8C9E', marginBottom: 4, fontWeight: '600' },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: '#1C9672' },
  
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f4e8c', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
});
