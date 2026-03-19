import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../../src/constants/Colors';
import { MapPin, ArrowLeft } from 'lucide-react-native';
import Button from '../../../src/components/ui/Button';

export default function LocationPicker() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Lokasi Belajar</Text>
      </View>

      {/* Map Placeholder */}
      <View style={styles.mapArea}>
        <View style={styles.pinContainer}>
          <MapPin size={40} color={Colors.secondary} />
        </View>
        <Text style={styles.mapWatermark}>Map View</Text>
        <View style={styles.overlayText}>
          <Text style={styles.overlayDesc}>Geser pin ke lokasi Anda</Text>
        </View>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.addressBox}>
          <MapPin size={24} color={Colors.primary} />
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>Lokasi Saat Ini</Text>
            <Text style={styles.addressSub}>Jl. Sudirman No. 123, Jakarta Selatan</Text>
          </View>
        </View>
        
        <Button 
          title="Konfirmasi Lokasi" 
          onPress={() => router.push('/(customer)/order/subject')} 
          style={styles.confirmBtn}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60, backgroundColor: '#FFF', elevation: 2, zIndex: 10 },
  backBtn: { marginRight: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },
  
  mapArea: { flex: 1, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  mapWatermark: { fontSize: 24, fontWeight: 'bold', color: '#FFF', position: 'absolute', opacity: 0.5 },
  pinContainer: { zIndex: 10, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.2, shadowRadius: 4 },
  overlayText: { position: 'absolute', top: 20, backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, elevation: 4 },
  overlayDesc: { fontSize: 14, fontWeight: 'bold', color: Colors.text },

  bottomSheet: { backgroundColor: '#FFF', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  addressBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 24 },
  addressDetails: { marginLeft: 16, flex: 1 },
  addressTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  addressSub: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  confirmBtn: { width: '100%' }
});
