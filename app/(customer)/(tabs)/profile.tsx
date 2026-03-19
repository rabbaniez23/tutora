import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Colors from "../../../src/constants/Colors";
import { ChevronRight } from "lucide-react-native";
import { useRouter } from 'expo-router';
import { useAuthStore } from "../../../src/store/useAuthStore";

export default function CustomerProfile() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.headerProfile}>
          <View style={styles.avatarPlaceholder}>
             <Image 
                source={require('../../../../assets/delia.webp')} 
                style={styles.avatarImage} 
              />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.name}>Delia</Text>
            <Text style={styles.phone}>+62 812-3456-7890</Text>
            <View style={styles.roleBadge}>
              <Text style={styles.roleText}>Akun Siswa Independen</Text>
            </View>
          </View>
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.groupTitle}>Akun & Keamanan</Text>
          <MenuItem title="Ubah Profil" />
          <MenuItem title="Alamat Tersimpan" />
          <MenuItem title="Voucher Saya" />
        </View>

        <View style={styles.menuGroup}>
          <Text style={styles.groupTitle}>Lainnya</Text>
          <MenuItem title="Pusat Bantuan" />
          <MenuItem title="Syarat & Ketentuan" />
          <TouchableOpacity
            style={[styles.menuItem, styles.logoutItem]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutText}>Keluar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MenuItem({ title }: { title: string }) {
  return (
    <TouchableOpacity style={styles.menuItem}>
      <Text style={styles.menuTitle}>{title}</Text>
      <ChevronRight size={20} color={Colors.textMuted} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  headerProfile: {
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    overflow: 'hidden'
  },
  avatarImage: { width: 64, height: 64, resizeMode: 'cover' },
  avatarText: { color: "#FFF", fontSize: 24, fontWeight: "bold" },
  profileInfo: { flex: 1 },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  phone: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  roleBadge: {
    backgroundColor: Colors.blue + "20",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  roleText: { color: Colors.blue, fontSize: 12, fontWeight: "bold" },
  menuGroup: {
    backgroundColor: "#FFF",
    marginBottom: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  groupTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.textMuted,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.surface,
  },
  menuTitle: { fontSize: 16, color: Colors.text },
  logoutItem: { borderBottomWidth: 0 },
  logoutText: { fontSize: 16, color: Colors.secondary, fontWeight: "bold" },
});
