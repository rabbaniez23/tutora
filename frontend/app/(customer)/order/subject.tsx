import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, CheckCircle2, Ticket, X, Clock, Calendar, Users, Moon } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

const LEVELS = [
  { id: 'SD', price: 60000 },
  { id: 'SMP', price: 70000 },
  { id: 'SMA', price: 80000 }
];
const SUBJECTS = ['Matematika', 'Fisika', 'Kimia', 'Biologi', 'Bahasa Inggris', 'Bahasa Indonesia'];
const DURATIONS = [{ id: 1, label: '1 Jam' }, { id: 1.5, label: '1.5 Jam' }];
const PACKAGES = [{ id: 1, label: '1 Pertemuan' }, { id: 4, label: '4 Pertemuan' }, { id: 8, label: '8 Pertemuan' }];
const GENDERS = ['Bebas', 'Laki-laki', 'Perempuan'];
const SCHEDULES = ['Sekarang', 'Terjadwal'];
const TIME_SLOTS = ['10:00 - 12:00', '13:00 - 15:00', '15:00 - 17:00', '19:00 - 21:00'];

const PROMOS = [
  { id: '1', code: 'TUTORBARU', title: 'Diskon Pengguna Baru', discountValue: 50000, discountText: 'Rp 50.000' },
  { id: '2', code: 'WEEKEND', title: 'Promo Akhir Pekan', discountValue: 20000, discountText: 'Rp 20.000' },
];

export default function SubjectSelection() {
  const router = useRouter();
  
  const [level, setLevel] = useState('SMA');
  const [subject, setSubject] = useState('Matematika');
  const [duration, setDuration] = useState(1);
  const [packageQty, setPackageQty] = useState(1);
  const [gender, setGender] = useState('Bebas');
  const [schedule, setSchedule] = useState('Sekarang');
  const [selectedTime, setSelectedTime] = useState('15:00 - 17:00');
  
  const [promoModalVisible, setPromoModalVisible] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/(customer)/order/searching');
    }, 1500);
  };

  // Price Calculation
  const basePrice = LEVELS.find(l => l.id === level)?.price || 80000;
  const subTotal = basePrice * duration * packageQty;
  
  const isFlashDeal = schedule === 'Terjadwal' && selectedTime === '19:00 - 21:00';
  const flashDealDiscount = isFlashDeal ? subTotal * 0.2 : 0;
  const voucherDiscount = selectedPromo ? selectedPromo.discountValue : 0;
  
  let grandTotal = subTotal - flashDealDiscount - voucherDiscount;
  if(grandTotal < 0) grandTotal = 0;

  const formatRp = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Pemesanan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Tingkat & Pelajaran */}
        <Text style={styles.sectionTitle}>Tingkat Pendidikan</Text>
        <View style={styles.chipRow}>
          {LEVELS.map(l => (
            <TouchableOpacity 
              key={l.id} 
              style={[styles.chip, level === l.id && styles.chipActive]}
              onPress={() => setLevel(l.id)}
            >
              <Text style={[styles.chipText, level === l.id && styles.chipTextActive]}>{l.id}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Mata Pelajaran</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 24 }}>
          {SUBJECTS.map(s => (
            <TouchableOpacity 
              key={s} 
              style={[styles.subjectCard, subject === s && styles.subjectCardActive]}
              onPress={() => setSubject(s)}
            >
              <Text style={[styles.subjectText, subject === s && styles.subjectTextActive]}>{s}</Text>
              {subject === s && <CheckCircle2 size={16} color={Colors.primary} style={{ marginTop: 8 }} />}
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Durasi & Paket */}
        <Text style={styles.sectionTitle}>Durasi & Paket</Text>
        <View style={styles.rowGrid}>
          {DURATIONS.map(d => (
            <TouchableOpacity 
              key={d.id} 
              style={[styles.gridBox, duration === d.id && styles.gridBoxActive]}
              onPress={() => setDuration(d.id)}
            >
              <Clock size={20} color={duration === d.id ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.gridText, duration === d.id && styles.gridTextActive]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.rowGrid}>
          {PACKAGES.map(p => (
            <TouchableOpacity 
              key={p.id} 
              style={[styles.gridBox, packageQty === p.id && styles.gridBoxActive]}
              onPress={() => setPackageQty(p.id)}
            >
              <Calendar size={20} color={packageQty === p.id ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.gridText, packageQty === p.id && styles.gridTextActive]}>{p.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preferensi Guru */}
        <Text style={styles.sectionTitle}>Preferensi Guru</Text>
        <View style={styles.chipRow}>
          {GENDERS.map(g => (
            <TouchableOpacity 
              key={g} 
              style={[styles.chip, gender === g && styles.chipActive]}
              onPress={() => setGender(g)}
            >
              <Users size={16} color={gender === g ? '#FFF' : Colors.textMuted} style={{ marginRight: 6 }} />
              <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>{g}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Jadwal Pelaksanaan */}
        <Text style={styles.sectionTitle}>Jadwal Pelaksanaan</Text>
        <View style={styles.chipRow}>
          {SCHEDULES.map(s => (
            <TouchableOpacity 
              key={s} 
              style={[styles.chip, schedule === s && styles.chipActive]}
              onPress={() => setSchedule(s)}
            >
              <Text style={[styles.chipText, schedule === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {schedule === 'Terjadwal' && (
          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(t => (
              <TouchableOpacity 
                key={t}
                style={[
                  styles.timeBox, 
                  selectedTime === t && styles.timeBoxActive,
                  t === '19:00 - 21:00' && styles.timeBoxPromo
                ]}
                onPress={() => setSelectedTime(t)}
              >
                {t === '19:00 - 21:00' && <Moon size={14} color={Colors.orange} style={{ marginBottom: 4 }} />}
                <Text style={[styles.timeText, selectedTime === t && styles.timeTextActive]}>{t}</Text>
                {t === '19:00 - 21:00' && <Text style={styles.flashDealText}>Flash Deal -20%</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Promo Voucher */}
        <Text style={styles.sectionTitle}>Promo Tambahan</Text>
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

      {/* Rincian Harga Footer */}
      <View style={styles.footer}>
        <View style={styles.receiptContainer}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptLabel}>Subtotal ({packageQty}x Sesi {duration}J)</Text>
            <Text style={styles.receiptValue}>{formatRp(subTotal)}</Text>
          </View>
          {isFlashDeal && (
            <View style={styles.receiptRow}>
              <Text style={styles.receiptPromo}>Flash Deal Malam (20%)</Text>
              <Text style={styles.receiptPromo}>-{formatRp(flashDealDiscount)}</Text>
            </View>
          )}
          {selectedPromo && (
            <View style={styles.receiptRow}>
              <Text style={styles.receiptPromo}>Voucher ({selectedPromo.code})</Text>
              <Text style={styles.receiptPromo}>-{formatRp(voucherDiscount)}</Text>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.receiptRow}>
            <Text style={styles.grandTotalLabel}>Total Bayar</Text>
            <Text style={styles.grandTotalValue}>{formatRp(grandTotal)}</Text>
          </View>
        </View>

        <Button 
          title="Cari Tutor Sekarang" 
          onPress={handleOrder}
          loading={loading}
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
                    <Text style={styles.promoDiscount}>{promo.discountText}</Text>
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
  container: { flex: 1, backgroundColor: Colors.surfaceLight },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#FFF' },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  
  content: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.text, marginBottom: 12, marginTop: 12 },
  
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  chip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFF' },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.text },
  chipTextActive: { color: '#FFF', fontWeight: 'bold' },

  subjectCard: { width: 110, height: 70, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: Colors.border, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  subjectCardActive: { borderColor: Colors.primary, backgroundColor: Colors.lightBlue },
  subjectText: { fontSize: 13, color: Colors.text, textAlign: 'center', fontWeight: '500' },
  subjectTextActive: { color: Colors.primary, fontWeight: 'bold' },

  rowGrid: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  gridBox: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: Colors.border, gap: 8 },
  gridBoxActive: { borderColor: Colors.primary, backgroundColor: Colors.lightBlue },
  gridText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  gridTextActive: { color: Colors.primary },

  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  timeBox: { width: '47%', paddingVertical: 12, backgroundColor: '#FFF', borderRadius: 12, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  timeBoxActive: { borderColor: Colors.primary, backgroundColor: Colors.primary },
  timeBoxPromo: { borderColor: Colors.orange, borderWidth: 2 },
  timeText: { fontSize: 13, fontWeight: '600', color: Colors.text },
  timeTextActive: { color: '#FFF' },
  flashDealText: { fontSize: 10, fontWeight: 'bold', color: Colors.orange, marginTop: 4 },

  promoTrigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border, borderStyle: 'dashed', marginBottom: 20 },
  promoTriggerText: { fontSize: 14, color: Colors.textMuted },
  promoBadge: { backgroundColor: Colors.lightGreen, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  promoBadgeText: { fontSize: 10, fontWeight: 'bold', color: Colors.secondary },

  footer: { backgroundColor: '#FFF', padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, borderTopLeftRadius: 24, borderTopRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 10 },
  receiptContainer: { marginBottom: 20 },
  receiptRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  receiptLabel: { fontSize: 13, color: Colors.textMuted },
  receiptValue: { fontSize: 13, fontWeight: 'bold', color: Colors.text },
  receiptPromo: { fontSize: 13, color: Colors.orange, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: Colors.border, marginVertical: 8 },
  grandTotalLabel: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  grandTotalValue: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },

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
