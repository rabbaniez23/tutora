import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, CheckCircle2, Ticket, X } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

const SUBJECTS = ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Bahasa Indonesia'];
const LEVELS = ['SD', 'SMP', 'SMA'];
const PROMOS = [
  { id: '1', code: 'TUTORBARU', title: 'Diskon Pengguna Baru', discount: 'Rp 50.000' },
  { id: '2', code: 'HEMAT50', title: 'Diskon 50% Sesi Pertama', discount: 'Diskon 50%' },
  { id: '3', code: 'WEEKEND', title: 'Promo Akhir Pekan', discount: 'Rp 20.000' },
];

export default function SubjectSelection() {
  const router = useRouter();
  const [subject, setSubject] = useState('Matematika');
  const [level, setLevel] = useState('SMA');
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);

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

        <Text style={styles.sectionTitle}>Promo & Voucher</Text>
        <TouchableOpacity 
          style={styles.promoTrigger} 
          onPress={() => setPromoModalVisible(true)}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ticket size={24} color={Colors.orange} style={{ marginRight: 12 }} />
            <Text style={[styles.promoTriggerText, selectedPromo && { color: Colors.primary, fontWeight: 'bold' }]}>
              {selectedPromo ? `Tersimpan: ${selectedPromo.code}` : "Gunakan Promo / Voucher"}
            </Text>
          </View>
          {selectedPromo && (
            <View style={styles.promoBadge}>
              <Text style={styles.promoBadgeText}>Dipakai</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <View>
            <Text style={styles.priceLabel}>Estimasi Harga</Text>
            {selectedPromo ? (
              <View>
                <Text style={styles.priceStrike}>Rp 150.000</Text>
                <Text style={styles.priceText}>Rp 100.000 / sesi</Text>
              </View>
            ) : (
              <Text style={styles.priceText}>Rp 100.000 - Rp 150.000 / sesi</Text>
            )}
          </View>
        </View>
        <Button 
          title="Cari Tutor Sekarang" 
          onPress={() => router.push('/(customer)/order/searching')} 
        />
      </View>

      {/* Modal Voucher */}
      <Modal visible={promoModalVisible} transparent animationType="slide">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Pilih Promo</Text>
              <TouchableOpacity onPress={() => setPromoModalVisible(false)} style={styles.closeBtn}>
                <X size={24} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {PROMOS.map(promo => (
                <TouchableOpacity 
                  key={promo.id} 
                  style={[styles.promoCard, selectedPromo?.id === promo.id && styles.promoCardActive]}
                  onPress={() => {
                    setSelectedPromo(promo);
                    setPromoModalVisible(false);
                  }}
                >
                  <View style={styles.promoIconBg}>
                    <Ticket size={24} color="#FFF" />
                  </View>
                  <View style={styles.promoInfo}>
                    <Text style={styles.promoCode}>{promo.code}</Text>
                    <Text style={styles.promoTitle}>{promo.title}</Text>
                    <Text style={styles.promoDiscount}>{promo.discount}</Text>
                  </View>
                  <View style={styles.radioBg}>
                    {selectedPromo?.id === promo.id && <View style={styles.radioDot} />}
                  </View>
                </TouchableOpacity>
              ))}
              {selectedPromo && (
                <TouchableOpacity 
                  style={styles.cancelPromoBtn}
                  onPress={() => {
                    setSelectedPromo(null);
                    setPromoModalVisible(false);
                  }}
                >
                  <Text style={styles.cancelPromoText}>Lepas Promo</Text>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
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

  listContainer: { backgroundColor: '#FFF', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: Colors.border, marginBottom: 16 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: Colors.surface },
  listItemActive: { backgroundColor: Colors.primary + '10' },
  listText: { fontSize: 16, color: Colors.text },
  listTextActive: { fontWeight: 'bold', color: Colors.primary },

  promoTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed' },
  promoTriggerText: { fontSize: 15, color: Colors.textMuted },
  promoBadge: { backgroundColor: Colors.lightGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  promoBadgeText: { fontSize: 10, fontWeight: 'bold', color: Colors.secondary },

  footer: { backgroundColor: '#FFF', padding: 24, borderTopWidth: 1, borderTopColor: Colors.border },
  priceContainer: { marginBottom: 16, flexDirection: 'row', justifyContent: 'space-between' },
  priceLabel: { fontSize: 14, color: Colors.textMuted },
  priceText: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  priceStrike: { fontSize: 14, color: Colors.textMuted, textDecorationLine: 'line-through' },

  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '70%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  closeBtn: { padding: 4 },
  
  promoCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, marginBottom: 12 },
  promoCardActive: { borderColor: Colors.primary, backgroundColor: Colors.lightBlue },
  promoIconBg: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.orange, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  promoInfo: { flex: 1 },
  promoCode: { fontSize: 14, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  promoTitle: { fontSize: 12, color: Colors.textMuted, marginBottom: 2 },
  promoDiscount: { fontSize: 12, fontWeight: 'bold', color: Colors.secondary },
  radioBg: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center' },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },

  cancelPromoBtn: { marginTop: 8, paddingVertical: 12, alignItems: 'center' },
  cancelPromoText: { fontSize: 14, fontWeight: 'bold', color: '#FF4D4D' }
});
