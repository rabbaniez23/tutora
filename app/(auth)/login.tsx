import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, User, Lock, Eye, EyeOff, BookOpen, GraduationCap } from 'lucide-react-native';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';
import { useAuthStore } from '@/src/store/useAuthStore';

export default function LoginScreen() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'customer' | 'teacher'>('customer');

  const handleLogin = () => {
    setAuth(role);
    if (role === 'customer') {
      router.replace('/(customer)/(tabs)');
    } else {
      router.replace('/(teacher)/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tutura</Text>
          <View style={{ width: 24 }} /> {/* Balance */}
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
          <View style={styles.inputWrapper}>
            <User size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <Input 
              placeholder="Contoh: 08123456789" 
              style={styles.input}
            />
          </View>

          <View style={styles.labelRow}>
            <Text style={styles.label}>Kata Sandi</Text>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Lupa Password?</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputWrapper}>
            <Lock size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <Input 
              placeholder="Masukkan kata sandi Anda" 
              secureTextEntry={!showPassword}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
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
          </View>
        </View>

        {/* Actions */}
        <Button 
          title="Masuk ➔" 
          onPress={handleLogin}
          style={styles.loginBtn}
        />

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
  scrollContent: { padding: 20, paddingBottom: 100 },
  
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 20 },
  backBtn: { padding: 8, backgroundColor: '#FFF', borderRadius: 20, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.primary },
  
  heroContainer: { width: '100%', height: 180, borderRadius: 20, overflow: 'hidden', marginBottom: 24 },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  
  welcomeSection: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#4A5A75', lineHeight: 22 },

  formSection: { marginBottom: 16 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  forgotText: { fontSize: 13, fontWeight: 'bold', color: Colors.primary, marginBottom: 8 },
  
  inputWrapper: { position: 'relative', marginBottom: 0 },
  inputIcon: { position: 'absolute', left: 16, top: 14, zIndex: 1 },
  eyeIcon: { position: 'absolute', right: 16, top: 14, zIndex: 1 },
  input: { paddingLeft: 48, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 24 },

  roleSection: { marginBottom: 24 },
  roleGrid: { flexDirection: 'row', gap: 12 },
  roleCard: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 16, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  roleText: { marginLeft: 8, fontSize: 14, fontWeight: 'bold', color: Colors.textMuted },
  roleTextActive: { color: Colors.primary },

  loginBtn: { backgroundColor: Colors.primary, borderRadius: 30, paddingVertical: 18, marginTop: 8 },
  
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 30 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { marginHorizontal: 16, color: '#999', fontSize: 13 },

  socialRow: { flexDirection: 'row', gap: 16 },
  socialBtn: { flex: 1, height: 50, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 25, justifyContent: 'center', alignItems: 'center' },
  googleText: { color: '#EA4335', fontSize: 18, fontWeight: 'bold' },
  fbIcon: { width: 24, height: 24 },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.surface, padding: 24, flexDirection: 'row', justifyContent: 'center', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  footerText: { fontSize: 14, color: Colors.text },
  footerLink: { fontSize: 14, fontWeight: 'bold', color: Colors.secondary }
});
