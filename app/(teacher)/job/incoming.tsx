import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '../../../src/constants/Colors';
import { MapPin, Briefcase } from 'lucide-react-native';
import Button from '../../../src/components/ui/Button';

export default function IncomingJob() {
  const router = useRouter();
  const progressAnim = new Animated.Value(100);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: 0,
      duration: 15000, // 15 seconds timer
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      // Auto reject after 15s
      router.back();
    }, 15000);

    return () => clearTimeout(timer);
  }, []);

  const widthInterpolated = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%']
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.modalContent}>
        <View style={styles.timerBarWrapper}>
          <Animated.View style={[styles.timerBar, { width: widthInterpolated }]} />
        </View>

        <View style={styles.header}>
          <Text style={styles.title}>Pesanan Masuk!</Text>
          <Text style={styles.price}>Rp 150.000</Text>
        </View>

        <View style={styles.detailsGroup}>
          <View style={styles.detailRow}>
            <Briefcase size={24} color={Colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Mata Pelajaran</Text>
              <Text style={styles.detailValue}>Matematika SMA</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <MapPin size={24} color={Colors.primary} />
            <View style={styles.detailTextContainer}>
              <Text style={styles.detailLabel}>Lokasi (Jarak: 2 km)</Text>
              <Text style={styles.detailValue}>Jl. Sudirman No. 123</Text>
            </View>
          </View>
        </View>

        <View style={styles.btnGroup}>
          <Button 
            title="Abaikan" 
            variant="outline" 
            style={styles.rejectBtn}
            onPress={() => router.back()}
          />
          <Button 
            title="Terima (2km)" 
            style={styles.acceptBtn}
            onPress={() => router.replace('/(teacher)/job/active')}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  timerBarWrapper: { width: '100%', height: 4, backgroundColor: Colors.surface, borderRadius: 2, overflow: 'hidden', marginBottom: 24 },
  timerBar: { height: '100%', backgroundColor: Colors.primary },
  
  header: { alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  price: { fontSize: 32, fontWeight: 'bold', color: Colors.primary },

  detailsGroup: { backgroundColor: Colors.surface, padding: 16, borderRadius: 16, marginBottom: 32 },
  detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  detailTextContainer: { marginLeft: 16 },
  detailLabel: { fontSize: 12, color: Colors.textMuted },
  detailValue: { fontSize: 16, fontWeight: 'bold', color: Colors.text },

  btnGroup: { flexDirection: 'row', gap: 16 },
  rejectBtn: { flex: 1 },
  acceptBtn: { flex: 2 }
});
