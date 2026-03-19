import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image } from 'react-native';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Wallet, RotateCcw, MessageSquare } from 'lucide-react-native';

const TABS = ['Dalam Proses', 'Terjadwal', 'Riwayat'];
const FILTERS = ['Semua Pelajaran', 'Bulan Ini', 'Matematika', 'Fisika'];

export default function ActivityScreen() {
  const [activeTab, setActiveTab] = useState('Riwayat');
  const [activeFilter, setActiveFilter] = useState('Semua Pelajaran');

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.backBtn}>
            <ArrowLeft size={24} color="#0A1E3F" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Aktivitas</Text>
        </View>
        <View style={styles.balanceChip}>
          <Wallet size={14} color="#2E3B7D" />
          <Text style={styles.balanceText}>Rp 125.000</Text>
        </View>
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

      {/* Filters */}
      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {FILTERS.map((f) => (
            <TouchableOpacity 
              key={f} 
              style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}
              onPress={() => setActiveFilter(f)}
            >
              <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Section: OKTOBER 2023 */}
        <Text style={styles.monthLabel}>OKTOBER 2023</Text>

        {/* Card 1 */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100' }} style={styles.avatar} />
            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.courseTitle} numberOfLines={1}>Matematika - Kalkulus</Text>
                <View style={styles.badgeSuccess}>
                  <Text style={styles.badgeSuccessText}>SELESAI</Text>
                </View>
              </View>
              <Text style={styles.tutorName}>Budi Santoso</Text>
              <Text style={styles.dateTime}>🗓️ 12 Okt 2023 • 15:00</Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Total Biaya</Text>
              <Text style={styles.priceValue}>Rp 150.000</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <RotateCcw size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>Pesan Lagi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1580894732444-8ecded790047?auto=format&fit=crop&q=80&w=100&h=100' }} style={styles.avatar} />
            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.courseTitle} numberOfLines={2}>Bahasa Inggris - TOEFL Prep</Text>
                <View style={[styles.badgeSuccess, { alignSelf: 'flex-start' }]}>
                  <Text style={styles.badgeSuccessText}>SELESAI</Text>
                </View>
              </View>
              <Text style={styles.tutorName}>Sari Wijaya</Text>
              <Text style={styles.dateTime}>🗓️ 08 Okt 2023 • 10:00</Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Total Biaya</Text>
              <Text style={styles.priceValue}>Rp 200.000</Text>
            </View>
            <TouchableOpacity style={styles.actionBtn}>
              <RotateCcw size={16} color="#FFF" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnText}>Pesan Lagi</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: SEPTEMBER 2023 */}
        <Text style={styles.monthLabel}>SEPTEMBER 2023</Text>

        {/* Card 3 (Cancelled) */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=100&h=100' }} style={styles.avatar} />
            <View style={styles.cardInfo}>
              <View style={styles.titleRow}>
                <Text style={styles.courseTitle} numberOfLines={1}>Fisika Dasar</Text>
                <View style={styles.badgeCancel}>
                  <Text style={styles.badgeCancelText}>DIBATALKAN</Text>
                </View>
              </View>
              <Text style={styles.tutorName}>Andi Pratama</Text>
              <Text style={styles.dateTime}>🗓️ 25 Sep 2023 • 19:00</Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Total Biaya</Text>
              <Text style={styles.priceValueStrike}>Rp 120.000</Text>
            </View>
            <TouchableOpacity style={styles.actionBtnCancel}>
              <MessageSquare size={16} color="#4A5A75" style={{ marginRight: 6 }} />
              <Text style={styles.actionBtnCancelText}>Tanya CS</Text>
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
  headerLeft: { flexDirection: 'row', alignItems: 'center' },
  backBtn: { marginRight: 12 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A1E3F' },
  balanceChip: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#E6F0FF', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 16 
  },
  balanceText: { color: '#2E3B7D', fontWeight: 'bold', fontSize: 12, marginLeft: 6 },
  
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

  filterSection: { paddingVertical: 16, backgroundColor: '#FAFAFA' },
  filterScroll: { paddingHorizontal: 20, gap: 12 },
  filterChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20, 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: Colors.border 
  },
  filterChipActive: { backgroundColor: '#1f4e8c', borderColor: '#1f4e8c' },
  filterText: { fontSize: 13, fontWeight: 'bold', color: '#0A1E3F' },
  filterTextActive: { color: '#FFF' },

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
  badgeCancel: { backgroundColor: '#F0F2F5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeCancelText: { color: '#7A8C9E', fontSize: 10, fontWeight: 'bold' },
  
  tutorName: { fontSize: 13, color: '#4A5A75', marginBottom: 6, fontWeight: '600' },
  dateTime: { fontSize: 11, color: '#7A8C9E' },

  cardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  priceCol: { flex: 1 },
  priceLabel: { fontSize: 11, color: '#7A8C9E', marginBottom: 4, fontWeight: '600' },
  priceValue: { fontSize: 18, fontWeight: 'bold', color: '#1f4e8c' },
  priceValueStrike: { fontSize: 16, fontWeight: 'bold', color: '#B0BEC5', textDecorationLine: 'line-through' },
  
  actionBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1f4e8c', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  actionBtnText: { color: '#FFF', fontSize: 13, fontWeight: 'bold' },
  actionBtnCancel: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E2E6EE', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24 },
  actionBtnCancelText: { color: '#0A1E3F', fontSize: 13, fontWeight: 'bold' },
});
