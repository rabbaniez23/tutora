import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { MapView, Marker } from '@/src/components/MapComponent';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { MapPin, ArrowLeft, Search } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function LocationPicker() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [addressTitle, setAddressTitle] = useState('Lokasi Saat Ini');
  const [addressSub, setAddressSub] = useState('Jl. Sudirman No. 123, Jakarta Selatan');
  
  const [region, setRegion] = useState({
    latitude: -6.200000, 
    longitude: 106.816666,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const updateLocation = (lat: number, lng: number, title: string, subtitle: string) => {
    setRegion({
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setAddressTitle(title);
    setAddressSub(subtitle);
  };

  const handleSearch = () => {
    Keyboard.dismiss();
    const q = searchQuery.toLowerCase();
    
    if (q.includes('bandung')) {
      updateLocation(-6.914744, 107.609810, 'Bandung', 'Jl. Braga, Bandung, Jawa Barat');
    } else if (q.includes('surabaya')) {
      updateLocation(-7.250445, 112.768845, 'Surabaya', 'Jl. Tunjungan, Surabaya, Jawa Timur');
    } else if (q.includes('yogya') || q.includes('jogja')) {
      updateLocation(-7.795580, 110.369490, 'Yogyakarta', 'Jl. Malioboro, Daerah Istimewa Yogyakarta');
    } else if (q.includes('bali')) {
      updateLocation(-8.409518, 115.188919, 'Bali', 'Denpasar, Bali');
    } else {
      updateLocation(-6.200000, 106.816666, 'Jakarta', 'Kawasan SCBD, Jakarta Selatan');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pilih Lokasi Belajar</Text>
      </View>

      {/* Search Bar Overlay */}
      <View style={styles.searchContainer}>
        <Search size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput 
          style={styles.searchInput}
          placeholder="Cari Kota (contoh: Bandung, Surabaya)"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Text style={styles.searchBtnText}>Cari</Text>
          </TouchableOpacity>
        )}
      </View>

      <MapView 
        style={styles.mapArea}
        region={region}
        onRegionChangeComplete={(r: any) => setRegion(r)}
      >
        <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}>
          <MapPin size={32} color={Colors.primary} fill="#FFF" />
        </Marker>
      </MapView>

      <View style={styles.overlayTop}>
        <Text style={styles.overlayDesc}>Geser peta atau gunakan pencarian</Text>
      </View>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        <View style={styles.addressBox}>
          <MapPin size={24} color={Colors.primary} />
          <View style={styles.addressDetails}>
            <Text style={styles.addressTitle}>{addressTitle}</Text>
            <Text style={styles.addressSub}>{addressSub}</Text>
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
  
  searchContainer: { 
    position: 'absolute', 
    top: 120, 
    left: 20, 
    right: 20, 
    backgroundColor: '#FFF', 
    flexDirection: 'row', 
    alignItems: 'center', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    elevation: 6,
    shadowColor: '#000', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.15, shadowRadius: 8,
    zIndex: 20
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, height: 50, fontSize: 15, color: Colors.text },
  searchBtn: { backgroundColor: Colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  searchBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 13 },

  mapArea: { flex: 1, backgroundColor: '#E0E0E0' },
  overlayTop: { position: 'absolute', top: 184, alignSelf: 'center', backgroundColor: '#FFF', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity: 0.1, zIndex: 10 },
  overlayDesc: { fontSize: 13, fontWeight: 'bold', color: Colors.text },

  bottomSheet: { backgroundColor: '#FFF', padding: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, elevation: 16, shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.1, shadowRadius: 12 },
  addressBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, padding: 16, borderRadius: 12, marginBottom: 24 },
  addressDetails: { marginLeft: 16, flex: 1 },
  addressTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  addressSub: { fontSize: 14, color: Colors.textMuted, marginTop: 4 },
  confirmBtn: { width: '100%' }
});
