import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, User, Lock, Eye, EyeOff, BookOpen, GraduationCap } from 'lucide-react-native';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'customer' | 'teacher' | 'parent'>('customer');

  const handleLogin = () => {
    setAuth(role as any);
    if (role === 'customer') {
      router.replace('/(customer)/(tabs)');
    } else if (role === 'teacher') {
      router.replace('/(teacher)/(tabs)');
    } else if (role === 'parent') {
      router.replace('/(parent)/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.replace('/(auth)/register')} style={styles.backBtn}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tutura</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=400&h=200' }} 
            style={styles.heroImage} 
          />
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.title}>Selamat Datang!</Text>
          <Text style={styles.subtitle}>Masuk ke akun Anda untuk melanjutkan belajar dengan tutor terbaik.</Text>
        </View>

        {/* Form Inputs */}
        <View style={styles.formSection}>
          <Text style={styles.label}>Email atau Nomor HP</Text>
          {/* Properly aligned Row Input Container */}
          <View style={styles.inputRow}>
            <User size={20} color={Colors.textMuted} style={styles.iconSpaced} />
            <TextInput 
              placeholder="Contoh: 08123456789" 
              placeholderTextColor={Colors.textMuted}
              style={styles.inputText}
            />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>Kata Sandi</Text>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputRow}>
            <Lock size={20} color={Colors.textMuted} style={styles.iconSpaced} />
            <TextInput 
              placeholder="Masukkan kata sandi Anda" 
              placeholderTextColor={Colors.textMuted}
              secureTextEntry={!showPassword}
              style={styles.inputText}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.iconHover}>
              {showPassword ? <EyeOff size={20} color={Colors.textMuted} /> : <Eye size={20} color={Colors.textMuted} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Role Selector */}
        <View style={styles.roleSection}>
          <Text style={styles.label}>Masuk Sebagai</Text>
          <View style={styles.roleGrid}>
            <TouchableOpacity 
              style={[styles.roleCard, role === 'customer' && styles.roleCardActive]}
              onPress={() => setRole('customer')}
            >
              <GraduationCap size={24} color={role === 'customer' ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.roleText, role === 'customer' && styles.roleTextActive]}>Siswa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.roleCard, role === 'teacher' && styles.roleCardActive]}
              onPress={() => setRole('teacher')}
            >
              <BookOpen size={24} color={role === 'teacher' ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.roleText, role === 'teacher' && styles.roleTextActive]}>Tutor</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.roleCard, role === 'parent' && styles.roleCardActive]}
              onPress={() => setRole('parent')}
            >
              <User size={24} color={role === 'parent' ? Colors.primary : Colors.textMuted} />
              <Text style={[styles.roleText, role === 'parent' && styles.roleTextActive]}>Wali / Tua</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions */}
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginBtnText}>Masuk ➔</Text>
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Atau masuk dengan</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Social Buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialBtn}>
            <Text style={styles.googleText}>GOOGLE</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}>
            <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/2021_Facebook_icon.svg/256px-2021_Facebook_icon.svg.png' }} style={styles.fbIcon} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Belum punya akun Tutura? </Text>
        <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.footerLink}>Daftar Sekarang</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { padding: 24, paddingBottom: 100 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { padding: 8, backgroundColor: '#FFF', borderRadius: 20, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  
  heroContainer: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  welcomeSection: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  subtitle: { fontSize: 13, color: '#4A5A75', lineHeight: 20 },

  formSection: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  forgotText: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  
  inputRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    borderWidth: 1, 
    borderColor: '#E2E8F0', 
    borderRadius: 24, 
    paddingHorizontal: 16, 
    height: 52 
  },
  iconSpaced: { marginRight: 12 },
  iconHover: { padding: 4 },
  inputText: { flex: 1, fontSize: 14, color: '#0A1E3F', height: '100%' },

  roleSection: { marginBottom: 24 },
  roleGrid: { flexDirection: 'row', gap: 8 },
  roleCard: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 20 },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.lightBlue },
  roleText: { marginTop: 8, fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, textAlign: 'center' },
  roleTextActive: { color: Colors.primary },

  loginBtn: { backgroundColor: Colors.primary, borderRadius: 30, paddingVertical: 18, marginTop: 8, alignItems: 'center' },
  loginBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
  
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dividerText: { marginHorizontal: 16, color: '#999', fontSize: 13 },

  socialRow: { flexDirection: 'row', gap: 16 },
  socialBtn: { flex: 1, height: 50, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  googleText: { color: '#EA4335', fontSize: 18, fontWeight: 'bold' },
  fbIcon: { width: 24, height: 24 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, padding: 24, flexDirection: 'row', justifyContent: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  footerText: { fontSize: 13, color: Colors.textMuted },
  footerLink: { fontSize: 13, fontWeight: 'bold', color: Colors.secondary }
});
