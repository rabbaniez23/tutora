import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Image, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../../src/constants/Colors';
import { Wallet, Search, Bell, MessageCircle, PlusCircle, Clock, GraduationCap, Sigma, FlaskConical, Microscope, Globe, ScrollText, BookOpen, Palette, MoreHorizontal } from 'lucide-react-native';

const SERVICES = [
  { id: 1, name: 'Matematika', icon: Sigma, color: Colors.primary, bgColor: Colors.lightBlue },
  { id: 2, name: 'Fisika', icon: FlaskConical, color: Colors.orange, bgColor: Colors.lightYellow },
  { id: 3, name: 'Biologi', icon: Microscope, color: Colors.secondary, bgColor: Colors.lightGreen },
  { id: 4, name: 'English', icon: Globe, color: Colors.purple, bgColor: Colors.lightPurple },
  { id: 5, name: 'Sejarah', icon: ScrollText, color: Colors.secondary, bgColor: Colors.lightRed },
  { id: 6, name: 'Indo', icon: BookOpen, color: '#00AED6', bgColor: Colors.lightCyan },
  { id: 7, name: 'Seni', icon: Palette, color: '#D4AF37', bgColor: Colors.lightYellow },
  { id: 8, name: 'Lainnya', icon: MoreHorizontal, color: Colors.textMuted, bgColor: Colors.lightGray },
];

export default function CustomerHome() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      {/* Scrollable Container */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Blue Header Section */}
        <View style={styles.headerBackground}>
          {Platform.OS === 'ios' && <View style={{ height: 50 }} />} {/* Native Safe Area Top */}
          <View style={styles.topNav}>
            <View style={styles.profileSection}>
              {/* Gunakan require() untuk asset lokal bundler */}
              <Image 
                source={require('../../../assets/delia.webp')} 
                style={styles.avatar} 
              />
              <View style={styles.greetingText}>
                <Text style={styles.greetingTitle}>Halo, Delia!</Text>
                <Text style={styles.greetingSub}>Mau belajar apa hari ini?</Text>
              </View>
            </View>
            
            <View style={styles.navActions}>
              <TouchableOpacity style={styles.iconCircle}>
                <Bell size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconCircle}>
                <MessageCircle size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Floating Wallet Card */}
        <View style={styles.walletContainer}>
          <View style={styles.walletCard}>
            <View style={styles.walletLeft}>
              <View style={styles.walletIconBox}>
                <Wallet size={24} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.walletLabel}>TUTORPAY</Text>
                <Text style={styles.walletBalance}>Rp 250.000</Text>
              </View>
            </View>
            <View style={styles.walletRight}>
              <TouchableOpacity style={styles.walletAction}>
                <PlusCircle size={24} color={Colors.primary} />
                <Text style={styles.walletActionText}>Top Up</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.walletAction}>
                <Clock size={24} color={Colors.primary} />
                <Text style={styles.walletActionText}>Riwayat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Green CTA Banner */}
        <View style={styles.ctaBanner}>
          <View style={styles.ctaBannerContent}>
            <Text style={styles.ctaTitle}>Butuh Guru Segera?</Text>
            <Text style={styles.ctaDesc}>Panggil tutor ke rumahmu sekarang.</Text>
            <TouchableOpacity 
              style={styles.ctaBtn} 
              onPress={() => router.push('/(customer)/order/location')}
            >
              <Text style={styles.ctaBtnText}>Pesan Guru Sekarang</Text>
            </TouchableOpacity>
          </View>
          <GraduationCap size={160} color="rgba(255,255,255,0.15)" style={styles.watermarkIcon} />
        </View>

        {/* Services / Lessons Grid */}
        <View style={styles.servicesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pilih Pelajaran</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>Lihat Semua</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.servicesGrid}>
            {SERVICES.map((service) => {
              const Icon = service.icon;
              return (
                <TouchableOpacity 
                  key={service.id} 
                  style={styles.serviceItem} 
                  onPress={() => router.push('/(customer)/order/location')}
                >
                  <View style={[styles.iconContainer, { backgroundColor: service.bgColor }]}>
                    <Icon size={28} color={service.color} strokeWidth={2.5} />
                  </View>
                  <Text style={styles.serviceName}>{service.name}</Text>
                </TouchableOpacity>
              )
            })}
          </View>
        </View>

        {/* Promo Section */}
        <View style={styles.promoSection}>
          <Text style={styles.sectionTitle}>Promo Spesial</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.promoScroll}>
            {/* Promo Card 1 */}
            <View style={styles.promoCard}>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>DISKON 50%</Text>
              </View>
              <Text style={styles.promoCardTitle}>Paket Ujian Nasional</Text>
              <Text style={styles.promoCardDesc}>Persiapan matang dengan tutor ahli.</Text>
              {/* Dummy Image Box for the screenshot content */}
              <View style={styles.promoImagePlaceholder}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=200&h=100' }} 
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
                  source={{ uri: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&q=80&w=200&h=100' }} 
                  style={styles.promoImage} 
                />
              </View>
            </View>
          </ScrollView>
        </View>

        {/* Spacer for bottom tabs */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  
  /* Header Section */
  headerBackground: {
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 50 : 20,
    paddingBottom: 60, // space for overlapping wallet
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#D9D9D9',
    marginRight: 12,
  },
  greetingText: {
    justifyContent: 'center',
  },
  greetingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  greetingSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  navActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Wallet Card */
  walletContainer: {
    marginTop: -40, // overlap
    paddingHorizontal: 20,
    zIndex: 10,
  },
  walletCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIconBox: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: Colors.surface, // mild cream/blue tint
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  walletLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  walletBalance: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  walletRight: {
    flexDirection: 'row',
    gap: 16,
  },
  walletAction: {
    alignItems: 'center',
  },
  walletActionText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
  },

  /* CTA Banner */
  ctaBanner: {
    backgroundColor: Colors.secondary,
    marginHorizontal: 20,
    marginTop: 24,
    borderRadius: 20,
    padding: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  ctaBannerContent: {
    zIndex: 2,
    maxWidth: '70%',
  },
  ctaTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 4,
  },
  ctaDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 16,
    lineHeight: 20,
  },
  ctaBtn: {
    backgroundColor: '#FFF',
    alignSelf: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  ctaBtnText: {
    color: Colors.secondary,
    fontWeight: 'bold',
    fontSize: 14,
  },
  watermarkIcon: {
    position: 'absolute',
    right: -20,
    bottom: -30,
    zIndex: 1,
    transform: [{ rotate: '-10deg' }],
  },

  /* Services Grid Section */
  servicesSection: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sectionLink: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  serviceItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  serviceName: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  /* Promo Section */
  promoSection: {
    marginTop: 8,
  },
  promoScroll: {
    paddingHorizontal: 20,
    gap: 16,
    paddingBottom: 20,
  },
  promoCard: {
    backgroundColor: Colors.surface, // Cream background as requested
    width: 260,
    borderRadius: 24,
    padding: 20,
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
    fontSize: 10,
    fontWeight: 'bold',
  },
  promoCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  promoCardDesc: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 16,
  },
  promoImagePlaceholder: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    overflow: 'hidden',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  promoImage: {
    width: '80%',
    height: '100%',
    resizeMode: 'cover',
  }
});
