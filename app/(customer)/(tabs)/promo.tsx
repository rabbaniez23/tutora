import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Bell, Search, Ticket } from 'lucide-react-native';

export default function CustomerPromo() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Promo & Voucher</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Bell size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textMuted} />
          <TextInput 
            placeholder="Cari promo belajar..."
            style={styles.searchInput}
            placeholderTextColor={Colors.textMuted}
          />
        </View>

        {/* My Vouchers Box */}
        <View style={styles.myVoucherBox}>
          <View style={styles.myVoucherLeft}>
            <View style={styles.voucherIconRow}>
              <Ticket size={20} color={Colors.primary} />
              <Text style={styles.myVoucherTitle}>Voucher Saya</Text>
            </View>
            <Text style={styles.myVoucherDesc}>Ada 5 voucher yang siap kamu pakai!</Text>
          </View>
          <TouchableOpacity style={styles.myVoucherBtn}>
            <Text style={styles.myVoucherBtnText}>Lihat Semua</Text>
          </TouchableOpacity>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Penawaran Spesial</Text>
          <Text style={styles.sectionDesc}>Jangan lewatkan diskon menarik minggu ini</Text>
        </View>

        {/* Card 1 */}
        <View style={styles.card}>
          <View style={[styles.cardTop, { backgroundColor: '#2E3B7D' }]}>
            <View style={[styles.badge, { backgroundColor: '#FF4D4D' }]}>
              <Text style={styles.badgeText}>TERBATAS</Text>
            </View>
            <View style={styles.cardTopContent}>
              <Text style={styles.mainDiskon}>DISKON 50%</Text>
              <Text style={styles.subDiskon}>PAKET UJIAN NASIONAL</Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View style={styles.cardInfoRow}>
              <Text style={styles.tagText}>PERSIAPAN UJIAN</Text>
              <Text style={styles.timeText}>🕒 Berakhir dlm 2 hari</Text>
            </View>
            <Text style={styles.cardTitle}>Diskon 50% Paket UN</Text>
            <Text style={styles.cardDesc}>Dapatkan akses penuh ke bank soal dan tryout nasional dengan harga setengahnya.</Text>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Klaim Voucher</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 2 */}
        <View style={styles.card}>
          <View style={[styles.cardTop, { backgroundColor: '#1C9672' }]}>
            <View style={[styles.badge, { backgroundColor: '#2E3B7D' }]}>
              <Text style={styles.badgeText}>TUTORPAY</Text>
            </View>
            <View style={styles.cardTopContent}>
              <Text style={styles.mainDiskon}>CASHBACK</Text>
              <Text style={styles.subDiskon}>HINGGA RP 50.000</Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View style={styles.cardInfoRow}>
              <Text style={styles.tagTextGreen}>PEMBAYARAN ELEKTRONIK</Text>
            </View>
            <Text style={styles.cardTitle}>Cashback TutorPay</Text>
            <Text style={styles.cardDesc}>Gunakan TutorPay untuk pembayaran semua paket belajar dan nikmati cashback saldo.</Text>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Pakai Sekarang</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Card 3 */}
        <View style={styles.card}>
          <View style={[styles.cardTop, { backgroundColor: '#FF6F59' }]}>
            <View style={styles.cardTopContent}>
              <Text style={styles.mainDiskon}>GRATIS</Text>
              <Text style={styles.subDiskon}>BIAYA TRANSPORTASI</Text>
            </View>
          </View>
          <View style={styles.cardBottom}>
            <View style={styles.cardInfoRow}>
              <Text style={styles.tagTextOrange}>TUTOR KE RUMAH</Text>
            </View>
            <Text style={styles.cardTitle}>Gratis Biaya Transport</Text>
            <Text style={styles.cardDesc}>Panggil tutor favoritmu ke rumah tanpa tambahan biaya perjalanan sepeserpun.</Text>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Pesan Tutor</Text>
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
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F' },
  
  content: { padding: 20, paddingBottom: 40 },
  
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F2F5', 
    borderRadius: 20, 
    paddingHorizontal: 16, 
    height: 48, 
    marginBottom: 20 
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, color: Colors.text },
  
  myVoucherBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FEF4E8', // Light cream/orange background from screenshot
    borderWidth: 1,
    borderColor: '#F3E5D8',
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 32 
  },
  myVoucherLeft: { flex: 1 },
  voucherIconRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  myVoucherTitle: { fontSize: 14, fontWeight: 'bold', color: '#0A1E3F', marginLeft: 8 },
  myVoucherDesc: { fontSize: 12, color: Colors.textMuted },
  myVoucherBtn: { 
    backgroundColor: '#2E3B7D', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 20 
  },
  myVoucherBtnText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },

  sectionHeader: { marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 4 },
  sectionDesc: { fontSize: 13, color: Colors.textMuted },

  card: { 
    backgroundColor: '#FFF', 
    borderRadius: 20, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    overflow: 'hidden', 
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width:0, height:2 },
    shadowOpacity: 0.05,
    shadowRadius: 8
  },
  cardTop: { height: 160, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  badge: { position: 'absolute', top: 16, right: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { color: '#FFF', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  cardTopContent: { alignItems: 'center' },
  mainDiskon: { fontSize: 32, fontWeight: 'bold', color: '#FFF', marginBottom: 4 },
  subDiskon: { fontSize: 12, fontWeight: 'bold', color: '#FFF', letterSpacing: 1 },
  
  cardBottom: { padding: 20 },
  cardInfoRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  tagText: { color: '#2E3B7D', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  tagTextGreen: { color: '#1C9672', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  tagTextOrange: { color: '#FF6F59', fontSize: 10, fontWeight: 'bold', letterSpacing: 0.5 },
  timeText: { color: Colors.textMuted, fontSize: 11 },
  
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  cardDesc: { fontSize: 13, color: Colors.textMuted, lineHeight: 20, marginBottom: 20 },
  actionBtn: { 
    width: '100%', 
    paddingVertical: 14, 
    borderRadius: 24, 
    borderWidth: 1.5, 
    borderColor: '#2E3B7D', 
    alignItems: 'center' 
  },
  actionBtnText: { color: '#2E3B7D', fontSize: 14, fontWeight: 'bold' },

});
