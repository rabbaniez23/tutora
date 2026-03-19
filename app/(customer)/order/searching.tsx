import React, { useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { Search } from 'lucide-react-native';
import Button from '@/src/components/ui/Button';

export default function SearchingRadar() {
  const router = useRouter();
  const pulseAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        })
      ])
    ).start();

    // Simulate found a tutor after 4 seconds
    const timer = setTimeout(() => {
      router.replace('/(customer)/order/tracking');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Map Background (Darken) */}
      <View style={styles.mapArea}>
        <Text style={styles.mapWatermark}>Map View</Text>
      </View>

      <View style={styles.overlay}>
        <View style={styles.radarContainer}>
          <Animated.View style={[styles.pulseCircle, {
            transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.5, 2] }) }],
            opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 0] })
          }]} />
          <View style={styles.radarCenter}>
            <Search size={32} color="#FFF" />
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.title}>Mencari Tutor Terdekat...</Text>
          <Text style={styles.subtitle}>Memeriksa radius 5km di sekitarmu</Text>
          
          <Button 
            title="Batalkan" 
            variant="outline" 
            style={styles.cancelBtn}
            onPress={() => router.back()}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  mapArea: { flex: 1, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center' },
  mapWatermark: { fontSize: 24, fontWeight: 'bold', color: '#555' },
  
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: 'space-between', alignItems: 'center', paddingTop: '40%' },
  
  radarContainer: { justifyContent: 'center', alignItems: 'center' },
  radarCenter: { width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: Colors.primary, shadowOffset: { width:0, height:4 }, shadowOpacity: 0.5, shadowRadius: 10 },
  pulseCircle: { position: 'absolute', width: 160, height: 160, borderRadius: 80, backgroundColor: Colors.primary, zIndex: 1 },

  infoBox: { backgroundColor: '#FFF', width: '100%', padding: 32, borderTopLeftRadius: 32, borderTopRightRadius: 32, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -10 }, shadowOpacity: 0.1, shadowRadius: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.textMuted, marginBottom: 32 },
  cancelBtn: { width: '100%' }
});
