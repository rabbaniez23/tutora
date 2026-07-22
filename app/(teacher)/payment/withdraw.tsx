import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Landmark, CheckCircle2 } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';
import CustomModal from '@/src/components/ui/CustomModal';

export default function TeacherWithdraw() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);

  const handleWithdraw = () => {
    if (!amount || parseInt(amount) < 50000) {
      setErrorModalVisible(true);
      return;
    }
    setSuccessModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tarik Saldo</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceLabel}>Saldo Tersedia</Text>
          <Text style={styles.balanceAmout}>Rp 450.000</Text>
        </View>

        <Text style={styles.sectionTitle}>REKENING TUJUAN</Text>
        <View style={styles.bankCard}>
          <View style={styles.bankLeft}>
            <View style={styles.bankIconBg}>
              <Landmark size={24} color="#0066AE" />
            </View>
            <View>
              <Text style={styles.bankName}>Bank BCA</Text>
              <Text style={styles.bankNumber}>1234 5678 9012</Text>
              <Text style={styles.bankOwner}>a/n Budi Santoso</Text>
            </View>
          </View>
          <CheckCircle2 size={24} color={Colors.secondary} />
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>NOMINAL PENARIKAN</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.currencyPrefix}>Rp</Text>
          <TextInput 
            style={styles.amountInput}
            placeholder="0"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
          />
        </View>
        <Text style={styles.minAmountHint}>Minimal penarikan Rp 50.000. Biaya admin Rp 2.500 ditanggung mitra.</Text>

      </ScrollView>

      <View style={styles.footer}>
        <Button title="Konfirmasi Penarikan" onPress={handleWithdraw} />
      </View>

      <CustomModal 
        visible={errorModalVisible}
        title="Penarikan Gagal"
        message="Minimal pencairan adalah Rp 50.000"
        confirmText="Tutup"
        onConfirm={() => setErrorModalVisible(false)}
        variant="danger"
      />

      <CustomModal 
        visible={successModalVisible}
        title="Berhasil"
        message="Permintaan pencairan dana sedang diproses oleh sistem."
        confirmText="OK"
        onConfirm={() => {
          setSuccessModalVisible(false);
          router.back();
        }}
        variant="primary"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },

  content: { padding: 24 },

  balanceInfo: { backgroundColor: Colors.primary, padding: 24, borderRadius: 20, alignItems: 'center', marginBottom: 32 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginBottom: 8 },
  balanceAmout: { color: '#FFF', fontSize: 32, fontWeight: 'bold' },

  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 16 },

  bankCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: Colors.secondary },
  bankLeft: { flexDirection: 'row', alignItems: 'center' },
  bankIconBg: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#E6F0FF', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  bankName: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  bankNumber: { fontSize: 14, color: Colors.textMuted, marginBottom: 2 },
  bankOwner: { fontSize: 12, color: Colors.primary, fontWeight: '500' },

  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 16, paddingHorizontal: 20, paddingVertical: 12 },
  currencyPrefix: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginRight: 12 },
  amountInput: { flex: 1, fontSize: 32, fontWeight: 'bold', color: Colors.text },
  minAmountHint: { fontSize: 12, color: Colors.textMuted, marginTop: 12, fontStyle: 'italic' },

  footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: Colors.border }
});
