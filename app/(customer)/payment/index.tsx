import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Wallet, Plus, CreditCard, Landmark, CheckCircle2 } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

const SAVED_METHODS = [
  { id: '1', type: 'wallet', name: 'TutorPay', balance: 'Rp 125.000', icon: Wallet, color: Colors.primary },
  { id: '2', type: 'bank', name: 'Bank BCA', number: '•••• 4532', icon: Landmark, color: '#0066AE' },
  { id: '3', type: 'cc', name: 'Mastercard', number: '•••• 9012', icon: CreditCard, color: '#EB001B' }
];

export default function PaymentMethods() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Metode Pembayaran</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Wallet Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletTop}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Wallet size={20} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={styles.walletTitle}>TutorPay Balance</Text>
            </View>
            <Text style={styles.walletBalance}>Rp 125.000</Text>
          </View>
          <View style={styles.walletBottom}>
            <TouchableOpacity style={styles.topUpBtn}>
              <Plus size={16} color={Colors.primary} />
              <Text style={styles.topUpText}>Top Up Saldo</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>METODE TERSIMPAN</Text>

        <View style={styles.methodsContainer}>
          {SAVED_METHODS.map((method, index) => {
            const Icon = method.icon;
            return (
              <TouchableOpacity key={method.id} style={styles.methodItem}>
                <View style={styles.methodLeft}>
                  <View style={[styles.methodIconBg, { backgroundColor: method.color + '15' }]}>
                    <Icon size={24} color={method.color} />
                  </View>
                  <View>
                    <Text style={styles.methodName}>{method.name}</Text>
                    <Text style={styles.methodSub}>
                      {method.balance ? `Saldo: ${method.balance}` : method.number}
                    </Text>
                  </View>
                </View>
                {index === 0 && <CheckCircle2 size={24} color={Colors.secondary} />}
              </TouchableOpacity>
            )
          })}
        </View>

        <TouchableOpacity style={styles.addMethodBtn}>
          <Plus size={20} color={Colors.primary} />
          <Text style={styles.addMethodText}>Tambah Metode Pembayaran</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },

  content: { padding: 24 },
  
  walletCard: { backgroundColor: Colors.primary, borderRadius: 20, padding: 20, marginBottom: 32, shadowColor: Colors.primary, shadowOffset: { width:0, height:8 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  walletTop: { marginBottom: 20 },
  walletTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '600' },
  walletBalance: { color: '#FFF', fontSize: 32, fontWeight: 'bold', marginTop: 8 },
  walletBottom: { flexDirection: 'row', justifyContent: 'flex-end' },
  topUpBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  topUpText: { color: Colors.primary, fontWeight: 'bold', fontSize: 13, marginLeft: 6 },

  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 16 },

  methodsContainer: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 24 },
  methodItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  methodLeft: { flexDirection: 'row', alignItems: 'center' },
  methodIconBg: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  methodName: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  methodSub: { fontSize: 13, color: Colors.textMuted },

  addMethodBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.primary },
  addMethodText: { fontSize: 15, fontWeight: 'bold', color: Colors.primary, marginLeft: 8 }
});
