import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, CheckCircle2, Clock, Info, XCircle } from 'lucide-react-native';

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'success',
    title: 'Pembayaran Berhasil',
    message: 'Pembayaran untuk kelas Kalkulus Lanjut sebesar Rp 150.000 telah terkonfirmasi.',
    time: '10 menit yang lalu',
    read: false,
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Pengingat Kelas',
    message: 'Kelas Bahasa Inggris - TOEFL Prep dengan Sari Wijaya akan dimulai dalam 30 menit. Siapkan dirimu!',
    time: '1 jam yang lalu',
    read: false,
  },
  {
    id: '3',
    type: 'info',
    title: 'Pemesanan Selesai',
    message: 'Sesi Matematika Dasar kamu telah selesai. Jangan lupa beri ulasan bintang 5 untuk tutor ya!',
    time: 'Kemarin',
    read: true,
  },
  {
    id: '4',
    type: 'error',
    title: 'Pesanan Dibatalkan',
    message: 'Sesi Fisika Dasar dengan Andi Pratama dibatalkan. Dana sejumlah Rp 120.000 sedang diproses untuk dikembalikan.',
    time: '2 hari yang lalu',
    read: true,
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle2 size={24} color="#1C9672" />;
      case 'reminder': return <Clock size={24} color="#FF8C00" />;
      case 'error': return <XCircle size={24} color="#FF4D4D" />;
      default: return <Info size={24} color={Colors.primary} />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'success': return '#E8F6ED';
      case 'reminder': return '#FFF3E0';
      case 'error': return '#FFEFEF';
      default: return '#E6F0FF';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#0A1E3F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifikasi</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {NOTIFICATIONS.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>Belum ada notifikasi</Text>
            <Text style={styles.emptySubtitle}>Jadwal kelas atau transaksi terbarumu akan muncul di sini.</Text>
          </View>
        ) : (
          NOTIFICATIONS.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={[styles.notifCard, !item.read && styles.notifCardUnread]}
            >
              <View style={[styles.iconBox, { backgroundColor: getIconBg(item.type) }]}>
                {getIcon(item.type)}
              </View>
              <View style={styles.notifInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
                <Text style={styles.notifMessage}>{item.message}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

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
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F' },

  content: { padding: 20, paddingBottom: 40 },

  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: '#7A8C9E', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },

  notifCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0F2F5',
  },
  notifCardUnread: {
    backgroundColor: '#F8FBFF',
    borderColor: '#E6F0FF',
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  notifInfo: { flex: 1 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: 'bold', color: '#0A1E3F' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  notifMessage: { fontSize: 13, color: '#4A5A75', lineHeight: 20, marginBottom: 8 },
  notifTime: { fontSize: 11, color: '#A0AEC0', fontWeight: '500' }
});
