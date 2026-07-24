import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, Phone, Video, Send, CheckCheck } from 'lucide-react-native';

export default function ChatRoomScreen() {
  const router = useRouter();
  const [message, setMessage] = useState('');

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <ArrowLeft size={24} color="#0A1E3F" />
          </TouchableOpacity>
          
          <View style={styles.headerAvatarContainer}>
            <Image 
              source={require('@/assets/delia.webp')} 
              style={styles.headerAvatar} 
            />
            <View style={styles.onlineDot} />
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Delia puspitasari</Text>
            <Text style={styles.headerStatus}>Online</Text>
          </View>

          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.iconBtn}>
              <Phone size={22} color="#1f4e8c" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn}>
              <Video size={24} color="#1f4e8c" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Area */}
        <ScrollView 
          contentContainerStyle={styles.chatScroll} 
          showsVerticalScrollIndicator={false}
        >
          {/* Date Badge */}
          <View style={styles.dateBadgeContainer}>
            <View style={styles.dateBadge}>
              <Text style={styles.dateBadgeText}>TODAY</Text>
            </View>
          </View>

          {/* Left Message 1 */}
          <View style={styles.messageRowLeft}>
            <Image source={require('@/assets/delia.webp')} style={styles.messageAvatar} />
            <View style={styles.messageContentLeft}>
              <View style={styles.bubbleLeft}>
                <Text style={styles.bubbleTextLeft}>halo aku mau belajar</Text>
              </View>
              <Text style={styles.timeTextLeft}>09:15 AM</Text>
            </View>
          </View>

          {/* Right Message 1 */}
          <View style={styles.messageRowRight}>
            <View style={styles.messageContentRight}>
              <View style={styles.bubbleRight}>
                <Text style={styles.bubbleTextRight}>boleh tapi ratingin bintang 5 ya</Text>
              </View>
              <View style={styles.timeRowRight}>
                <Text style={styles.timeTextRight}>09:16 AM</Text>
                <CheckCheck size={14} color="#1C9672" style={{ marginLeft: 4 }} />
              </View>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' }} style={styles.messageAvatar} />
          </View>

          {/* Left Message 2 */}
          <View style={styles.messageRowLeft}>
            <Image source={require('@/assets/delia.webp')} style={styles.messageAvatar} />
            <View style={styles.messageContentLeft}>
              <View style={styles.bubbleLeft}>
                <Text style={styles.bubbleTextLeft}>aman yang penting aku harus ngerti dulu nnti aku kasih bintang 5 ya</Text>
              </View>
              <Text style={styles.timeTextLeft}>09:18 AM</Text>
            </View>
          </View>

          {/* Right Message 2 */}
          <View style={styles.messageRowRight}>
            <View style={styles.messageContentRight}>
              <View style={styles.bubbleRight}>
                <Text style={styles.bubbleTextRight}>gas meluncur ke tkp</Text>
              </View>
              <View style={styles.timeRowRight}>
                <Text style={styles.timeTextRight}>09:20 AM</Text>
                <CheckCheck size={14} color="#1C9672" style={{ marginLeft: 4 }} />
              </View>
            </View>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80' }} style={styles.messageAvatar} />
          </View>

        </ScrollView>

        {/* Input Area */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textInput}
              placeholder="Tulis pesan..."
              placeholderTextColor="#A0AEC0"
              value={message}
              onChangeText={setMessage}
              multiline
            />
            <TouchableOpacity style={styles.sendBtn}>
              <Send size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#EFE7DB' }, // Cream vintage background

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    elevation: 2,
    zIndex: 10,
  },
  backBtn: { padding: 4, marginRight: 8 },
  headerAvatarContainer: { position: 'relative', marginRight: 12 },
  headerAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#E2E8F0' },
  onlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1C9672',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: 'bold', color: '#0A1E3F', marginBottom: 2 },
  headerStatus: { fontSize: 12, fontWeight: 'bold', color: '#1C9672' },
  headerIcons: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBtn: { padding: 4 },

  chatScroll: { paddingHorizontal: 16, paddingVertical: 20 },
  
  dateBadgeContainer: { alignItems: 'center', marginBottom: 24 },
  dateBadge: { backgroundColor: '#D5DFE8', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  dateBadgeText: { fontSize: 10, fontWeight: 'bold', color: '#4A5A75', letterSpacing: 0.5 },

  messageRowLeft: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  messageAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#CBD5E1' },
  
  messageContentLeft: { marginLeft: 12, maxWidth: '75%' },
  bubbleLeft: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 4,
  },
  bubbleTextLeft: { fontSize: 15, color: '#0A1E3F', lineHeight: 22 },
  timeTextLeft: { fontSize: 10, color: '#7A8C9E', marginLeft: 4 },

  messageRowRight: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'flex-start', marginBottom: 20 },
  messageContentRight: { marginRight: 12, maxWidth: '75%', alignItems: 'flex-end' },
  bubbleRight: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    marginBottom: 4,
  },
  bubbleTextRight: { fontSize: 15, color: '#FFF', lineHeight: 22 },
  timeRowRight: { flexDirection: 'row', alignItems: 'center', marginRight: 4 },
  timeTextRight: { fontSize: 10, color: '#7A8C9E' },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F2F5',
  },
  textInput: {
    flex: 1,
    minHeight: 44,
    maxHeight: 120,
    backgroundColor: '#F0F2F5',
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 15,
    color: '#0A1E3F',
    marginRight: 12,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
