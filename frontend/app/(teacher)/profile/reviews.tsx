import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Star, MessageSquare } from 'lucide-react-native';
import { useReviewStore } from '@/src/store/useReviewStore';

export default function TeacherReviews() {
  const router = useRouter();
  
  // Asumsikan teacher yang login memiliki ID "1" (Budi Santoso)
  const reviews = useReviewStore((state) => state.reviews);
  const myReviews = reviews.filter(r => r.teacherId === "1");

  const averageRating = myReviews.reduce((acc, curr) => acc + curr.rating, 0) / (myReviews.length || 1);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ulasan Saya</Text>
        <View style={{width: 24}} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Rating Rata-Rata</Text>
          <Text style={styles.summaryScore}>{averageRating.toFixed(1)} / 5.0</Text>
          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map(i => (
              <Star key={i} size={28} color={i <= Math.round(averageRating) ? "#FFD700" : Colors.border} fill={i <= Math.round(averageRating) ? "#FFD700" : "transparent"} />
            ))}
          </View>
          <Text style={styles.summaryCount}>Dari {myReviews.length} ulasan siswa</Text>
        </View>

        <Text style={styles.sectionTitle}>SEMUA ULASAN</Text>
        
        {myReviews.length === 0 ? (
          <View style={styles.emptyState}>
            <MessageSquare size={48} color={Colors.border} />
            <Text style={styles.emptyText}>Belum ada ulasan yang masuk saat ini.</Text>
          </View>
        ) : (
          myReviews.map(review => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.authorBadge}>
                  <Text style={styles.authorBadgeText}>{review.author.charAt(0)}</Text>
                </View>
                <View style={styles.authorInfo}>
                  <Text style={styles.authorName}>{review.author}</Text>
                  <View style={{ flexDirection: 'row' }}>
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star key={i} size={12} color={i <= review.rating ? "#FFD700" : Colors.border} fill={i <= review.rating ? "#FFD700" : "transparent"} />
                    ))}
                  </View>
                </View>
              </View>

              <Text style={styles.reviewContent}>"{review.content}"</Text>
              
              {review.tags && review.tags.length > 0 && (
                <View style={styles.tagsRow}>
                  {review.tags.map(t => (
                    <View key={t} style={styles.tagPill}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, paddingTop: 60, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text },

  content: { padding: 24, paddingBottom: 40 },
  
  summaryCard: { backgroundColor: '#FFF', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 24, borderWidth: 1, borderColor: Colors.border },
  summaryTitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  summaryScore: { fontSize: 40, fontWeight: 'bold', color: '#FF8C00', marginBottom: 12 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  summaryCount: { fontSize: 13, color: Colors.textMuted },

  sectionTitle: { fontSize: 12, fontWeight: 'bold', color: Colors.textMuted, letterSpacing: 1, marginBottom: 16 },

  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 16, color: Colors.textMuted, fontSize: 14, textAlign: 'center' },

  reviewCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, borderColor: Colors.border },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  authorBadge: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  authorBadgeText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  authorInfo: { flex: 1 },
  authorName: { fontSize: 15, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  
  reviewContent: { fontSize: 14, color: Colors.text, lineHeight: 22, fontStyle: 'italic', marginBottom: 16 },
  
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagPill: { backgroundColor: '#E8F6ED', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12 },
  tagText: { color: '#1C9672', fontSize: 11, fontWeight: 'bold' }
});
