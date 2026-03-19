import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { Star } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';
import Input from '@/src/components/ui/Input';

const TAGS = ['Sabar', 'Jelas', 'Tepat Waktu', 'Ramah', 'Seru'];

export default function ReviewScreen() {
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [review, setReview] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const submitReview = () => {
    router.replace('/(customer)/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.receipt}>
          <Text style={styles.receiptTitle}>Total Pembayaran</Text>
          <Text style={styles.receiptAmount}>Rp 150.000</Text>
          <View style={styles.line} />
          <Text style={styles.receiptDesc}>Pembayaran berhasil menggunakan TutorPay</Text>
        </View>

        <Text style={styles.question}>Bagaimana pengalamanmu belajar bersama Budi?</Text>
        
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Star 
                size={48} 
                color={star <= rating ? "#FFD700" : Colors.border} 
                fill={star <= rating ? "#FFD700" : "transparent"} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {rating > 0 && (
          <View style={styles.feedbackSection}>
            <Text style={styles.label}>Pilih Tag Penilaian:</Text>
            <View style={styles.tagsContainer}>
              {TAGS.map(tag => (
                <TouchableOpacity 
                  key={tag} 
                  style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextSelected]}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input 
              label="Komentar Tambahan"
              placeholder="Guru sangat asik dan jelas dalam mengajar..."
              multiline
              numberOfLines={4}
              style={styles.textArea}
              value={review}
              onChangeText={setReview}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button 
          title="Kirim Ulasan" 
          disabled={rating === 0}
          onPress={submitReview} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  content: { padding: 24, paddingTop: 60, alignItems: 'center' },
  
  receipt: { backgroundColor: '#FFF', padding: 24, borderRadius: 16, width: '100%', alignItems: 'center', marginBottom: 32, shadowColor: '#000', shadowOffset: { width:0, height:2 }, shadowOpacity:0.05, shadowRadius:8, elevation: 4 },
  receiptTitle: { fontSize: 16, color: Colors.textMuted, marginBottom: 8 },
  receiptAmount: { fontSize: 32, fontWeight: 'bold', color: Colors.text, marginBottom: 16 },
  line: { width: '100%', height: 1, backgroundColor: Colors.surface, marginBottom: 16 },
  receiptDesc: { fontSize: 14, color: Colors.primary, fontWeight: 'bold' },

  question: { fontSize: 18, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 24 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 32 },

  feedbackSection: { width: '100%' },
  label: { fontSize: 14, fontWeight: 'bold', marginBottom: 12, color: Colors.text },
  tagsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 },
  tag: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: Colors.border, backgroundColor: '#FFF' },
  tagSelected: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tagText: { color: Colors.text },
  tagTextSelected: { color: '#FFF', fontWeight: 'bold' },
  textArea: { height: 100, textAlignVertical: 'top', paddingTop: 12 },

  footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderColor: Colors.border }
});
