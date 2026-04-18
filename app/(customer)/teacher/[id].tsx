import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Star, MapPin, Award, BookOpen, GraduationCap } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';
import { useReviewStore } from '@/src/store/useReviewStore';

export default function TeacherProfile() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const reviews = useReviewStore((state) => state.reviews);
  const teacherReviews = reviews.filter(r => r.teacherId === (id || "1"));

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Cover & Avatar Header */}
        <View style={styles.coverPhoto}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtnCircle}>
            <ArrowLeft size={24} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.profileBox}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200' }} 
            style={styles.avatar} 
          />
          <Text style={styles.teacherName}>Budi Santoso, S.Pd</Text>
          <Text style={styles.teacherTitle}>Guru Matematika Berpengalaman</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Star size={18} color="#FFD700" fill="#FFD700" />
              <Text style={styles.statValue}>4.9/5</Text>
              <Text style={styles.statLabel}>240 Ulasan</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <BookOpen size={18} color={Colors.primary} />
              <Text style={styles.statValue}>350+</Text>
              <Text style={styles.statLabel}>Sesi Mengajar</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MapPin size={18} color={Colors.secondary} />
              <Text style={styles.statValue}>5 km</Text>
              <Text style={styles.statLabel}>Jarak</Text>
            </View>
          </View>
        </View>

        {/* Content Tabs / Information */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>TENTANG SAYA</Text>
          <Text style={styles.aboutText}>
            Saya adalah lulusan Pendidikan Matematika Universitas Indonesia dengan pengalaman mengajar lebih dari 5 tahun. Saya memiliki pendekatan mengajar yang interaktif dan berfokus pada pemahaman konsep dasar agar siswa tidak hanya menghapal rumus.
          </Text>
          
          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>PENDIDIKAN</Text>
          <View style={styles.educationCard}>
            <GraduationCap size={24} color={Colors.textMuted} />
            <View style={styles.educationInfo}>
              <Text style={styles.eduDegree}>S1 Pendidikan Matematika</Text>
              <Text style={styles.eduUniv}>Universitas Indonesia</Text>
              <Text style={styles.eduYear}>2015 - 2019</Text>
            </View>
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 24 }]}>REVIEW TERBARU ( {teacherReviews.length} )</Text>
          {teacherReviews.length > 0 ? (
            teacherReviews.map(r => (
              <View key={r.id} style={[styles.reviewCard, { marginBottom: 12 }]}>
                <View style={styles.reviewHeader}>
                  <View style={styles.reviewUser}>
                    <View style={styles.reviewAvatarPlaceholder}>
                      <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{r.author.charAt(0)}</Text>
                    </View>
                    <Text style={styles.reviewAuthor}>{r.author}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    {[1,2,3,4,5].map(i => <Star key={i} size={14} color={i <= r.rating ? "#FFD700" : Colors.border} fill={i <= r.rating ? "#FFD700" : "transparent"} />)}
                  </View>
                </View>
                <Text style={styles.reviewContent}>"{r.content}"</Text>
                {r.tags && r.tags.length > 0 && (
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 12 }}>
                    {r.tags.map(t => (
                      <View key={t} style={{ backgroundColor: Colors.lightBlue, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                        <Text style={{ fontSize: 10, color: Colors.primary, fontWeight: 'bold' }}>{t}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 13, color: Colors.textMuted, fontStyle: 'italic' }}>Belum ada ulasan untuk guru ini.</Text>
          )}
        </View>

      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Tarif Per Sesi</Text>
          <Text style={styles.priceText}>Rp 150.000</Text>
        </View>
        <Button title="Pesan Ajaran" onPress={() => router.push('/(customer)/order/location')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  scrollContent: { paddingBottom: 100 },
  
  coverPhoto: { height: 180, backgroundColor: Colors.primary, paddingTop: 40, paddingHorizontal: 16 },
  backBtnCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  
  profileBox: { backgroundColor: '#FFF', marginHorizontal: 20, marginTop: -60, borderRadius: 20, padding: 24, paddingBottom: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width:0, height:4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 6 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 4, borderColor: '#FFF', marginTop: -50, marginBottom: 16, backgroundColor: '#E0E0E0' },
  teacherName: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  teacherTitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 20 },
  
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 16, padding: 16 },
  statItem: { alignItems: 'center', flex: 1, gap: 4 },
  statDivider: { width: 1, height: 30, backgroundColor: Colors.border },
  statValue: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  statLabel: { fontSize: 11, color: Colors.textMuted },

  infoSection: { padding: 24 },
  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 12 },
  aboutText: { fontSize: 14, color: Colors.text, lineHeight: 22 },

  educationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  educationInfo: { marginLeft: 16 },
  eduDegree: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  eduUniv: { fontSize: 13, color: Colors.textMuted, marginTop: 2 },
  eduYear: { fontSize: 12, color: Colors.primary, marginTop: 4, fontWeight: '600' },

  reviewCard: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: Colors.border },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  reviewUser: { flexDirection: 'row', alignItems: 'center' },
  reviewAvatarPlaceholder: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.secondary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  reviewAuthor: { fontSize: 14, fontWeight: 'bold', color: Colors.text },
  reviewContent: { fontSize: 13, color: Colors.text, lineHeight: 20, fontStyle: 'italic' },

  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', flexDirection: 'row', padding: 20, borderTopWidth: 1, borderTopColor: Colors.border, alignItems: 'center', justifyContent: 'space-between' },
  priceContainer: { flex: 1, marginRight: 16 },
  priceLabel: { fontSize: 12, color: Colors.textMuted, marginBottom: 4 },
  priceText: { fontSize: 20, fontWeight: 'bold', color: Colors.text }
});
