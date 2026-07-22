import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Bell, Globe, Moon, Shield, ChevronRight } from 'lucide-react-native';
import CustomModal from '@/src/components/ui/CustomModal';

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setDeleteModalVisible(false);
      router.replace('/(auth)/login');
    }, 1500);
  };

  const handleChangePassword = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordModalVisible(false);
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Akun</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>PREFERENSI APLIKASI</Text>
        
        <View style={styles.settingGroup}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: Colors.lightBlue }]}>
                <Bell size={20} color={Colors.primary} />
              </View>
              <Text style={styles.settingLabel}>Notifikasi Push</Text>
            </View>
            <Switch 
              value={notifications} 
              onValueChange={setNotifications} 
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: '#F0F2F5' }]}>
                <Moon size={20} color="#4A5A75" />
              </View>
              <Text style={styles.settingLabel}>Mode Gelap</Text>
            </View>
            <Switch 
              value={darkMode} 
              onValueChange={setDarkMode} 
              trackColor={{ false: Colors.border, true: Colors.primary }}
              thumbColor="#FFF"
            />
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: Colors.lightGreen }]}>
                <Globe size={20} color={Colors.secondary} />
              </View>
              <Text style={styles.settingLabel}>Bahasa</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={styles.settingValue}>Indonesia</Text>
              <ChevronRight size={20} color={Colors.textMuted} />
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>PRIVASI & KEAMANAN</Text>
        
        <View style={styles.settingGroup}>
          <TouchableOpacity style={styles.settingItem} onPress={() => setPasswordModalVisible(true)}>
            <View style={styles.settingLeft}>
              <View style={[styles.iconBox, { backgroundColor: Colors.lightRed }]}>
                <Shield size={20} color="#FF4D4D" />
              </View>
              <Text style={styles.settingLabel}>Ganti Kata Sandi</Text>
            </View>
            <ChevronRight size={20} color={Colors.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingItem} onPress={() => setDeleteModalVisible(true)}>
            <Text style={[styles.settingLabel, { color: '#FF4D4D', marginLeft: 16 }]}>Hapus Akun Permanen</Text>
            <ChevronRight size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <CustomModal 
        visible={deleteModalVisible}
        title="Hapus Akun Permanen?"
        message="Tindakan ini tidak dapat dibatalkan. Semua data riwayat pesanan, profil, dan saldo Anda akan dihapus selamanya."
        confirmText="Hapus Akun"
        cancelText="Batal"
        onConfirm={handleDeleteAccount}
        onCancel={() => setDeleteModalVisible(false)}
        variant="danger"
        loading={loading}
      />

      <CustomModal 
        visible={passwordModalVisible}
        title="Ganti Kata Sandi"
        message="Tautan untuk mengatur ulang kata sandi akan dikirimkan ke email terdaftar Anda. Lanjutkan?"
        confirmText="Kirim Email"
        cancelText="Batal"
        onConfirm={handleChangePassword}
        onCancel={() => setPasswordModalVisible(false)}
        variant="primary"
        loading={loading}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },

  content: { padding: 24 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 16, marginTop: 8 },
  
  settingGroup: { backgroundColor: '#FFF', borderRadius: 16, borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: 24 },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: Colors.text },
  settingValue: { fontSize: 14, color: Colors.textMuted, marginRight: 8 }
});
