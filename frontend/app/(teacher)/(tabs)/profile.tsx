import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from "@/src/constants/Colors";
import { ChevronRight, ArrowLeft, Pencil, Award, Star, MapPin, CreditCard, HelpCircle, LogOut } from "lucide-react-native";
import { useRouter } from 'expo-router';
import { useAuthStore } from "@/src/store/useAuthStore";

export default function TeacherProfile() {
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
        <Text style={styles.headerTitle}>Profil Mitra Tutor</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
             <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200' }} 
                style={styles.avatarImage} 
              />
              <TouchableOpacity style={styles.editBadge}>
                <Pencil size={12} color="#FFF" />
              </TouchableOpacity>
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Budi Santoso, S.Pd</Text>
            <Text style={styles.contactText}>budi.guru@email.com</Text>
            <Text style={styles.contactText}>+62 811 2233 4455</Text>
          </View>
        </View>

        {/* Rating/Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.statsLeft}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.statsTitle}>Rating Pengajar</Text>
          </View>
          <Text style={styles.statsPoints}>4.9 / 5.0</Text>
        </View>

        {/* Akun Saya Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>AKUN SAYA</Text>
          
          <MenuItem 
            icon={<Pencil size={20} color="#1f4e8c" />} 
            iconBg="#E6F0FF" 
            title="Edit Portofolio" 
          />
          <MenuItem 
            icon={<CreditCard size={20} color="#1C9672" />} 
            iconBg="#E8F6ED" 
            title="Rekening Pencairan" 
          />
        </View>

        {/* Aktivitas Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>PERFORMA</Text>
          <MenuItem 
            icon={<Star size={20} color="#FF8C00" />} 
            iconBg="#FFF3E0" 
            title="Ulasan Saya" 
            onPress={() => router.push('/(teacher)/profile/reviews')}
          />
        </View>

        {/* Lainnya Section */}
        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>LAINNYA</Text>
          <MenuItem 
            icon={<HelpCircle size={20} color="#4A5A75" />} 
            iconBg="#F0F2F5" 
            title="Pusat Bantuan CS" 
            hideBorder
          />
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={20} color="#FF4D4D" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Keluar dari Aplikasi</Text>
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
    borderBottomColor: '#F0F2F5',
    alignItems: 'center'
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#0A1E3F' },

  scrollContent: { padding: 24, paddingBottom: 40 },

  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  avatarContainer: { position: 'relative', marginRight: 16 },
  avatarImage: { width: 80, height: 80, borderRadius: 40, resizeMode: 'cover', backgroundColor: '#E0E0E0' },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#1f4e8c', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  profileInfo: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 4 },
  contactText: { fontSize: 13, color: '#7A8C9E', marginBottom: 2, fontWeight: '500' },

  statsCard: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FEF4E8', paddingHorizontal: 20, paddingVertical: 16, borderRadius: 24, marginBottom: 32 },
  statsLeft: { flexDirection: 'row', alignItems: 'center' },
  statsTitle: { fontSize: 15, fontWeight: 'bold', color: '#0A1E3F', marginLeft: 12 },
  statsPoints: { fontSize: 15, fontWeight: 'bold', color: '#FF8C00' },

  menuSection: { marginBottom: 24 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: '#A0AEC0', letterSpacing: 1, marginBottom: 16 },
  
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F0F2F5' },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuIconBox: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  menuTitle: { fontSize: 15, fontWeight: '700', color: '#0A1E3F' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#FF4D4D', paddingVertical: 14, borderRadius: 24, marginTop: 16 },
  logoutText: { fontSize: 15, fontWeight: 'bold', color: '#FF4D4D' }
});
