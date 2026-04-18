import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Camera, User, Mail, Phone } from 'lucide-react-native';
import Input from '@/src/components/ui/Input';
import Button from '@/src/components/ui/Button';

export default function EditProfile() {
  const router = useRouter();
  const [name, setName] = useState('Delia Puspitasari');
  const [email, setEmail] = useState('delia.puspitasari@email.com');
  const [phone, setPhone] = useState('081234567890');

  const handleSave = () => {
    // Simulasi penyimpanan
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profil</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={require('@/assets/delia.webp')} 
              style={styles.avatarImage} 
            />
            <TouchableOpacity style={styles.cameraBtn}>
              <Camera size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.formSection}>
          <Input 
            label="Nama Lengkap" 
            value={name}
            onChangeText={setName}
            icon={<User size={20} color={Colors.textMuted} />}
          />
          <Input 
            label="Alamat Email" 
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            icon={<Mail size={20} color={Colors.textMuted} />}
          />
          <Input 
            label="Nomor Telepon" 
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            icon={<Phone size={20} color={Colors.textMuted} />}
          />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="Simpan Perubahan" onPress={handleSave} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },

  content: { padding: 24 },
  
  avatarSection: { alignItems: 'center', marginBottom: 32 },
  avatarContainer: { position: 'relative' },
  avatarImage: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.surface },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: Colors.primary, width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },

  formSection: { gap: 8 },

  footer: { padding: 24, borderTopWidth: 1, borderTopColor: Colors.border, backgroundColor: '#FFF' }
});
