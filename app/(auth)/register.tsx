import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, BookOpen, GraduationCap, CheckCircle } from 'lucide-react-native';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';

export default function RegisterScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'customer' | 'teacher'>('customer');
  const [agreed, setAgreed] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daftar Tutura</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTextRow}>
            <Text style={styles.progressText}>Langkah 1 dari 2</Text>
            <Text style={styles.progressTextGreen}>Hampir Selesai!</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={styles.progressBarFill} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>Buat Akun Baru</Text>
          <Text style={styles.subtitle}>Lengkapi data diri Anda untuk mulai belajar atau mengajar di platform Tutura.</Text>
        </View>

        {/* Form */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Nama Lengkap</Text>
          <View style={styles.inputWrapper}>
            <User size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <Input placeholder="Contoh: Delia puspitasari" style={styles.input} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Alamat Email</Text>
          <View style={styles.inputWrapper}>
            <Mail size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <Input placeholder="Delia.puspitasari@email.com" style={styles.input} />
          </View>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Nomor Telepon</Text>
          <View style={[styles.inputWrapper, { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 24 }]}>
            <Text style={styles.phonePrefix}>+62</Text>
            <View style={styles.phoneDivider} />
            <Input placeholder="812 3456 7890" style={[styles.input, { borderWidth: 0, flex: 1, paddingLeft: 12, backgroundColor: 'transparent' }]} />
          </View>
        </View>

        {/* Role Selection */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Daftar Sebagai</Text>
          <View style={styles.roleGrid}>
            <TouchableOpacity 
              style={[styles.roleCard, role === 'customer' && styles.roleCardActive]}
              onPress={() => setRole('customer')}
            >
              <GraduationCap size={32} color={role === 'customer' ? Colors.secondary : Colors.textMuted} />
              <Text style={[styles.roleText, role === 'customer' && styles.roleTextActiveGreen]}>Siswa</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.roleCard, role === 'teacher' && styles.roleCardActive]}
              onPress={() => setRole('teacher')}
            >
              <BookOpen size={32} color={role === 'teacher' ? Colors.secondary : Colors.textMuted} />
              <Text style={[styles.roleText, role === 'teacher' && styles.roleTextActiveGreen]}>Tutor</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Password */}
        <View style={styles.formGroup}>
          <Text style={styles.label}>Kata Sandi</Text>
          <View style={styles.inputWrapper}>
            <Lock size={20} color={Colors.textMuted} style={styles.inputIcon} />
            <Input 
              placeholder="••••••••" 
              secureTextEntry={!showPassword}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <EyeOff size={20} color={Colors.textMuted} /> : <Eye size={20} color={Colors.textMuted} />}
            </TouchableOpacity>
          </View>
          <Text style={styles.helperText}>Minimal 8 karakter dengan kombinasi huruf dan angka.</Text>
        </View>

        {/* Agreement */}
        <TouchableOpacity style={styles.agreementBox} onPress={() => setAgreed(!agreed)}>
          <CheckCircle size={24} color={agreed ? Colors.secondary : Colors.textMuted} />
          <Text style={styles.agreementText}>
            Dengan mendaftar, Anda menyetujui <Text style={styles.boldBlue}>Ketentuan Layanan</Text> dan <Text style={styles.boldBlue}>Kebijakan Privasi</Text> Tutura.
          </Text>
        </TouchableOpacity>

        {/* Action */}
        <Button 
          title="Daftar Sekarang ➔" 
          disabled={!agreed}
          style={[styles.registerBtn, !agreed && { opacity: 0.5 }]}
          onPress={() => router.replace('/(auth)/login')}
        />

        {/* Footer */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Sudah punya akun? </Text>
          <TouchableOpacity onPress={() => router.replace('/(auth)/login')}>
            <Text style={styles.boldBlue}>Masuk di sini</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },

  scrollContent: { padding: 24, paddingBottom: 40 },
  
  progressContainer: { marginBottom: 32 },
  progressTextRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressText: { fontSize: 12, color: Colors.textMuted, fontWeight: 'bold' },
  progressTextGreen: { fontSize: 12, color: Colors.secondary, fontWeight: 'bold' },
  progressBarBg: { height: 6, backgroundColor: '#E0E0E0', borderRadius: 3 },
  progressBarFill: { height: 6, backgroundColor: Colors.primary, borderRadius: 3, width: '50%' },

  titleSection: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#4A5A75', lineHeight: 22 },

  formGroup: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 8 },
  inputWrapper: { position: 'relative' },
  inputIcon: { position: 'absolute', left: 16, top: 14, zIndex: 1 },
  eyeIcon: { position: 'absolute', right: 16, top: 14, zIndex: 1 },
  input: { paddingLeft: 48, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 24 },
  
  phonePrefix: { paddingLeft: 16, fontSize: 14, fontWeight: 'bold', color: Colors.text },
  phoneDivider: { width: 1, height: 20, backgroundColor: Colors.border, marginHorizontal: 12 },
  helperText: { fontSize: 11, color: Colors.textMuted, marginTop: 8 },

  roleGrid: { flexDirection: 'row', gap: 16 },
  roleCard: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: Colors.border, borderRadius: 20 },
  roleCardActive: { borderColor: Colors.secondary, backgroundColor: Colors.lightGreen },
  roleText: { marginTop: 8, fontSize: 14, fontWeight: 'bold', color: Colors.textMuted },
  roleTextActiveGreen: { color: Colors.secondary },

  agreementBox: { flexDirection: 'row', backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 24, alignItems: 'center' },
  agreementText: { flex: 1, marginLeft: 12, fontSize: 12, color: Colors.text, lineHeight: 18 },
  boldBlue: { fontWeight: 'bold', color: Colors.primary },

  registerBtn: { backgroundColor: Colors.secondary, borderRadius: 30, paddingVertical: 18 },
  
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  footerText: { fontSize: 14, color: Colors.textMuted }
});
