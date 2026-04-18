import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, ImageBackground, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowRight, UserCheck, Clock, BookOpen } from 'lucide-react-native';

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animation Values
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;
  const buttonOpacityAnim = useRef(new Animated.Value(0)).current;

  // Cards Intro Animation (Scale up sequentially)
  const card1Scale = useRef(new Animated.Value(0)).current;
  const card2Scale = useRef(new Animated.Value(0)).current;
  const card3Scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sequence animations
    Animated.sequence([
      Animated.parallel([
        // Icon Pop Animation
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Text Slide Up Animation
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        })
      ]),
      // Card Pop Sequence effect
      Animated.stagger(150, [
        Animated.spring(card1Scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.spring(card2Scale, { toValue: 1, friction: 5, useNativeDriver: true }),
        Animated.spring(card3Scale, { toValue: 1, friction: 5, useNativeDriver: true }),
      ]),
      // Fade in the button after text
      Animated.timing(buttonOpacityAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      })
    ]).start();
  }, [scaleAnim, opacityAnim, translateYAnim, buttonOpacityAnim, card1Scale, card2Scale, card3Scale]);

  return (
    <ImageBackground 
      source={require('@/assets/welcomelatar.jpg')} 
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Animated.View style={[styles.iconContainer, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
            <Image 
              source={require('@/assets/logowelcome.png')} 
              style={styles.logoImage} 
            />
          </Animated.View>
        
        <Animated.View style={[styles.textContainer, { transform: [{ translateY: translateYAnim }], opacity: opacityAnim }]}>
          <Text style={styles.title}>Ayo Belajar Bersama Kami Tutora</Text>
          
          <View style={styles.featuresRow}>
            {/* CARD 1 */}
            <Animated.View style={[styles.featureCardWrap, { transform: [{ scale: card1Scale }] }]}>
              <View style={styles.featureCard}>
                <UserCheck size={26} color={Colors.secondary} />
                <Text style={styles.featureText}>Tutor Pilihan</Text>
              </View>
            </Animated.View>

            {/* CARD 2 */}
            <Animated.View style={[styles.featureCardWrap, { transform: [{ scale: card2Scale }] }]}>
              <View style={styles.featureCard}>
                <Clock size={26} color={Colors.secondary} />
                <Text style={styles.featureText}>Waktu Fleksibel</Text>
              </View>
            </Animated.View>

            {/* CARD 3 */}
            <Animated.View style={[styles.featureCardWrap, { transform: [{ scale: card3Scale }] }]}>
              <View style={styles.featureCard}>
                <BookOpen size={26} color={Colors.secondary} />
                <Text style={styles.featureText}>Materi Lengkap</Text>
              </View>
            </Animated.View>
          </View>

        </Animated.View>
      </View>

      <Animated.View style={[styles.bottomContainer, { opacity: buttonOpacityAnim, transform: [{ translateY: translateYAnim }] }]}>
        <TouchableOpacity 
          style={styles.startBtn}
          onPress={() => router.push('/(auth)/register')}
          activeOpacity={0.8}
        >
          <Text style={styles.startBtnText}>Ayo Mulai Belajar</Text>
          <ArrowRight size={20} color="#FFF" style={{ marginLeft: 8 }} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginBtnLine} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginBtnText}>Sudah punya akun? Masuk</Text>
        </TouchableOpacity>
      </Animated.View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(10, 30, 63, 0.75)', // Dark blue overlay to ensure text is readable
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  logoImage: {
    width: 220,
    height: 220,
    resizeMode: 'contain',
    elevation: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFF',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
    lineHeight: 34,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 24,
    gap: 12,
  },
  featureCardWrap: {
    flex: 1,
  },
  featureCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)', // Glassmorphism container
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  featureText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 12,
    textAlign: 'center',
  },

  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    width: '100%',
  },
  startBtn: {
    flexDirection: 'row',
    backgroundColor: Colors.secondary, // Uses primary Green
    width: '100%',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    elevation: 6,
    shadowColor: Colors.secondary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  startBtnText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFF',
    letterSpacing: 0.5,
  },
  loginBtnLine: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  loginBtnText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600'
  }
});
