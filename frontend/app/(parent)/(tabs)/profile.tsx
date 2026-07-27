import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "@/src/constants/Colors";
import { ChevronRight, Pencil, ShieldCheck, MapPin, CreditCard, HelpCircle, LogOut } from "lucide-react-native";
import { useRouter } from 'expo-router';
import { useAuthStore } from "@/src/store/useAuthStore";

export default function ParentProfile() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil Orang Tua</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
             <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200' }} 
                style={styles.avatarImage} 
              />
              <TouchableOpacity style={styles.editBadge}>
                <Pencil size={12} color="#FFF" />
              </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Bapak Wahyu</Text>
            <Text style={styles.contactText}>wahyu@email.com</Text>
            <Text style={styles.contactText}>+62 812 3456 7890</Text>
          </View>
        </View>

        {/* Akun Saya Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>AKUN SAYA</Text>
          
          <MenuItem 
            icon={<ShieldCheck size={20} color="#1f4e8c" />} 
            iconBg="#E6F0FF" 
            title="Pengaturan Akun" 
          />
          <MenuItem 
            icon={<MapPin size={20} color="#1C9672" />} 
            iconBg="#E8F6ED" 
            title="Alamat Tersimpan" 
          />
          <MenuItem 
            icon={<CreditCard size={20} color="#FF8C00" />} 
            iconBg="#FFF3E0" 
            title="Metode Pembayaran (Wallet Anak)" 
          />
        </View>

        {/* Lainnya Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>LAINNYA</Text>
          
          <MenuItem 
            icon={<HelpCircle size={20} color="#4A5A75" />} 
            iconBg="#F0F2F5" 
            title="Pusat Bantuan" 
            hideBorder
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#FF4D4D" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Keluar</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ icon, iconBg, title, hideBorder = false, onPress }: { icon: React.ReactNode, iconBg: string, title: string, hideBorder?: boolean, onPress?: () => void }) {
  return (
    <TouchableOpacity style={[styles.menuItem, hideBorder && { borderBottomWidth: 0 }]} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={[styles.menuIconBox, { backgroundColor: iconBg }]}>
          {icon}
        </View>
        <Text style={styles.menuTitle}>{title}</Text>
      </View>
      <ChevronRight size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  header: { 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16, 
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A1E3F', textAlign: 'center' },

  scrollContent: { padding: 24, paddingBottom: 40 },

  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatarImage: { width: 80, height: 80, borderRadius: 40, resizeMode: 'cover', backgroundColor: '#E0E0E0' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#1f4e8c', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  profileInfo: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 4 },
  contactText: { fontSize: 13, color: '#7A8C9E', marginBottom: 2, fontWeight: '500' },

  menuSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#A0AEC0', letterSpacing: 1, marginBottom: 16 },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: '#0A1E3F' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FF4D4D', paddingVertical: 14, borderRadius: 24, marginTop: 16 },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: '#FF4D4D' }
});
