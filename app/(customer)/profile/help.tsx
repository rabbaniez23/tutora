import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, MessageCircle, Mail, HelpCircle, ChevronRight } from 'lucide-react-native';

const FAQS = [
  "Bagaimana cara membatalkan pesanan?",
  "Apa yang terjadi jika guru tidak datang?",
  "Bagaimana sistem pengembalian dana bekerja?",
  "Apakah saya bisa pesankan tutor untuk orang lain?"
];

export default function HelpCenter() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pusat Bantuan</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        
        <View style={styles.heroSection}>
          <HelpCircle size={48} color={Colors.primary} style={{ marginBottom: 16 }} />
          <Text style={styles.heroTitle}>Ada yang bisa kami bantu?</Text>
          <Text style={styles.heroDesc}>Tim Tutora siap sedia membantu menyelesaikan kendalamu kapan pun.</Text>
        </View>

        <Text style={styles.sectionTitle}>HUBUNGI KAMI</Text>
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard}>
            <View style={[styles.contactIconBg, { backgroundColor: '#E8F6ED' }]}>
              <MessageCircle size={28} color={Colors.secondary} />
            </View>
            <Text style={styles.contactTitle}>WhatsApp</Text>
            <Text style={styles.contactSub}>Respon Cepat</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.contactCard}>
            <View style={[styles.contactIconBg, { backgroundColor: Colors.lightRed }]}>
              <Mail size={28} color="#FF4D4D" />
            </View>
            <Text style={styles.contactTitle}>Email Kami</Text>
            <Text style={styles.contactSub}>Bantuan Bisnis</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>PERTANYAAN UMUM (FAQ)</Text>
        <View style={styles.faqGroup}>
          {FAQS.map((faq, index) => (
            <TouchableOpacity key={index} style={styles.faqItem}>
              <Text style={styles.faqText}>{faq}</Text>
              <ChevronRight size={20} color={Colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

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
  heroSection: { alignItems: 'center', marginBottom: 40, marginTop: 16 },
  heroTitle: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  heroDesc: { fontSize: 14, color: Colors.textMuted, textAlign: 'center', paddingHorizontal: 24, lineHeight: 22 },

  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 16 },
  
  contactRow: { flexDirection: 'row', gap: 16, marginBottom: 40 },
  contactCard: { flex: 1, backgroundColor: '#FFF', padding: 20, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: Colors.border },
  contactIconBg: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  contactTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  contactSub: { fontSize: 12, color: Colors.textMuted },

  faqGroup: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden' },
  faqItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  faqText: { fontSize: 14, color: Colors.text, flex: 1, paddingRight: 16, fontWeight: '500', lineHeight: 20 }
});
