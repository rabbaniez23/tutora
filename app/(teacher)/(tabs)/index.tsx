import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Image, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { Bell, BarChart2, Map, BookOpen, Globe } from 'lucide-react-native';

export default function TeacherHome() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerProfile}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100&h=100' }} 
            style={styles.avatar} 
          />
        </View>
        <View style={styles.headerCenter}>
          <Text style={styles.logoText}>Tutura</Text>
          <Text style={styles.roleText}>TUTOR PARTNER</Text>
        </View>
        <TouchableOpacity style={styles.bellBtn}>
          <Bell size={20} color="#0A1E3F" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Online Toggle Card */}
        <View style={styles.onlineCard}>
          <Text style={styles.onlineTitle}>{isOnline ? 'Kamu online' : 'Kamu offline'}</Text>
          <Text style={styles.onlineDesc}>
            {isOnline ? 'Terlihat oleh murid di sekitarmu' : 'Tidak terlihat oleh murid saat ini'}
          </Text>
          <Switch 
            value={isOnline} 
            onValueChange={setIsOnline} 
            trackColor={{ false: '#E0E0E0', true: Colors.secondary }}
            thumbColor={'#FFF'}
            style={{ transform: [{ scaleX: 1.2 }, { scaleY: 1.2 }], marginTop: 8 }}
          />
        </View>

        {/* Today's Summary */}
        <View style={styles.sectionHeader}>
          <BarChart2 size={20} color="#0A1E3F" style={{ marginRight: 8 }} />
          <Text style={styles.sectionTitle}>Ringkasan Hari Ini</Text>
        </View>
        
        <View style={styles.summaryRow}>
          {/* Income Box */}
          <View style={[styles.summaryBox, { backgroundColor: Colors.primary }]}>
            <Text style={styles.summaryLabelWhite}>Pendapatan</Text>
            <Text style={styles.summaryValueWhite}>Rp 250.000</Text>
            <View style={styles.summaryBadgeBlue}>
              <Text style={styles.summaryBadgeTextWhite}>+12% dari kemarin</Text>
            </View>
          </View>
          
          {/* Session Box */}
          <View style={[styles.summaryBox, { backgroundColor: '#FDF3E7' }]}>
            <Text style={styles.summaryLabelBlue}>Sesi</Text>
            <Text style={styles.summaryValueBlue}>6 selesai</Text>
            <View style={styles.summaryBadgeGrey}>
              <Text style={styles.summaryBadgeTextBlue}>2 Akan Datang</Text>
            </View>
          </View>
        </View>

        {/* Demand Heatmap */}
        <View style={styles.sectionHeaderBetween}>
          <View style={styles.sectionHeaderLeft}>
            <Map size={20} color="#0A1E3F" style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Peta Permintaan</Text>
          </View>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>Jakarta Selatan</Text>
          </View>
        </View>

        <View style={styles.mapContainer}>
          {/* Mock Map Image */}
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=600&h=300' }} 
            style={styles.mapImage}
            blurRadius={2}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.highDemandChip}>
              <View style={styles.greenDot} />
              <Text style={styles.highDemandText}>Zona Permintaan Tinggi</Text>
            </View>
          </View>
        </View>

        {/* Recent Completed */}
        <View style={styles.sectionHeaderBetween}>
          <View>
            <Text style={styles.sectionTitle}>Selesai Terbaru</Text>
          </View>
          <TouchableOpacity>
            <Text style={styles.viewAllText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* List Items */}
        <View style={styles.activityItem}>
          <View style={styles.activityIconBox}>
            <BookOpen size={24} color={Colors.primary} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Kalkulus Lanjut</Text>
            <Text style={styles.activitySub}>Siswa: Sarah Jenkins</Text>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.activityPrice}>+Rp 150.000</Text>
            <Text style={styles.activityTime}>10:30 AM</Text>
          </View>
        </View>

        <View style={styles.activityItem}>
          <View style={styles.activityIconBox}>
            <Globe size={24} color={Colors.primary} />
          </View>
          <View style={styles.activityInfo}>
            <Text style={styles.activityTitle}>Persiapan IELTS</Text>
            <Text style={styles.activitySub}>Siswa: Michael Chen</Text>
          </View>
          <View style={styles.activityRight}>
            <Text style={styles.activityPrice}>+Rp 100.000</Text>
            <Text style={styles.activityTime}>09:15 AM</Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16, 
    backgroundColor: '#FFF' 
  },
  headerProfile: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatar: { width: '100%', height: '100%', resizeMode: 'cover' },
  headerCenter: { alignItems: 'center' },
  logoText: { fontSize: 18, fontWeight: 'bold', color: '#1f4e8c', marginBottom: 2 },
  roleText: { fontSize: 10, fontWeight: 'bold', color: '#7A8C9E', letterSpacing: 1 },
  bellBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F0F2F5', justifyContent: 'center', alignItems: 'center', position: 'relative' },
  notificationDot: { position: 'absolute', top: 10, right: 12, width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4D4D', borderWidth: 1, borderColor: '#FFF' },

  content: { padding: 20, paddingBottom: 40 },

  onlineCard: { backgroundColor: '#FFF', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 24, elevation: 1, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  onlineTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f4e8c', marginBottom: 4 },
  onlineDesc: { fontSize: 13, color: '#7A8C9E', marginBottom: 12 },

  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  sectionHeaderBetween: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, marginTop: 8 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F' },
  
  summaryRow: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  summaryBox: { flex: 1, borderRadius: 24, padding: 16 },
  summaryLabelWhite: { fontSize: 13, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  summaryValueWhite: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 16 },
  summaryBadgeBlue: { backgroundColor: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  summaryBadgeTextWhite: { color: '#FFF', fontSize: 10, fontWeight: 'bold' },
  
  summaryLabelBlue: { fontSize: 13, color: '#1f4e8c', marginBottom: 8 },
  summaryValueBlue: { fontSize: 22, fontWeight: 'bold', color: '#1f4e8c', marginBottom: 16 },
  summaryBadgeGrey: { backgroundColor: '#E2E8F0', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  summaryBadgeTextBlue: { color: '#1f4e8c', fontSize: 10, fontWeight: 'bold' },

  locationBadge: { backgroundColor: '#E6F0FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  locationText: { color: '#1f4e8c', fontSize: 12, fontWeight: 'bold' },

  mapContainer: { width: '100%', height: 180, borderRadius: 24, overflow: 'hidden', marginBottom: 24, position: 'relative' },
  mapImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  mapOverlay: { position: 'absolute', bottom: 12, right: 12 },
  highDemandChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  greenDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.secondary, marginRight: 6 },
  highDemandText: { fontSize: 11, fontWeight: 'bold', color: '#0A1E3F' },

  viewAllText: { fontSize: 14, fontWeight: 'bold', color: '#1f4e8c' },

  activityItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 20, marginBottom: 12, elevation: 1, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.05, shadowRadius: 8 },
  activityIconBox: { width: 48, height: 48, borderRadius: 16, backgroundColor: '#FDF3E7', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  activityInfo: { flex: 1 },
  activityTitle: { fontSize: 15, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 4 },
  activitySub: { fontSize: 12, color: '#7A8C9E' },
  activityRight: { alignItems: 'flex-end' },
  activityPrice: { fontSize: 14, fontWeight: 'bold', color: Colors.secondary, marginBottom: 4 },
  activityTime: { fontSize: 11, color: '#A0AEC0' }
});
