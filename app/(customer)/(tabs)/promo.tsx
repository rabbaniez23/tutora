import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';
import Colors from '../../../src/constants/Colors';

export default function CustomerPromo() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Promo & Voucher</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        
        {/* Promo Card 1 */}
        <View style={styles.promoCard}>
          <View style={styles.promoBadge}>
            <Text style={styles.promoBadgeText}>DISKON 50%</Text>
          </View>
          <Text style={styles.promoCardTitle}>Paket Ujian Nasional</Text>
          <Text style={styles.promoCardDesc}>Persiapan matang dengan tutor ahli.</Text>
          <View style={styles.promoImagePlaceholder}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=400&h=200' }} 
              style={styles.promoImage} 
            />
          </View>
        </View>

        {/* Promo Card 2 */}
        <View style={[styles.promoCard, { backgroundColor: Colors.lightCyan }]}>
          <View style={[styles.promoBadge, { backgroundColor: Colors.secondary }]}>
            <Text style={styles.promoBadgeText}>CASHBACK</Text>
          </View>
          <Text style={styles.promoCardTitle}>Voucher Belajar</Text>
          <Text style={styles.promoCardDesc}>Top up mini dan nikmati cashback nya.</Text>
          <View style={styles.promoImagePlaceholder}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=400&h=200' }} 
              style={styles.promoImage} 
            />
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surfaceLight },
  header: { padding: 16, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderColor: Colors.border },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: Colors.text },
  content: { padding: 20, gap: 20 },
  
  promoCard: {
    backgroundColor: Colors.surface, // Cream background as requested
    width: '100%',
    borderRadius: 24,
    padding: 24,
    overflow: 'hidden',
  },
  promoBadge: {
    backgroundColor: Colors.primary,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  promoBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  promoCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  promoCardDesc: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  promoImagePlaceholder: {
    width: '100%',
    height: 140,
    borderRadius: 16,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  promoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  }
});
