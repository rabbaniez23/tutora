import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Colors from '@/src/constants/Colors';
import { ArrowLeft, MoreVertical, Search } from 'lucide-react-native';

const CHATS = [
  {
    id: '1',
    name: 'Dr. Sarah Wilson',
    message: 'Halo, apakah jadwal bimbingan...',
    time: '14.30',
    unread: 2,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '2',
    name: 'Prof. James Miller',
    message: 'Materi untuk pertemuan minggu depan...',
    time: '10.15',
    unread: 0,
    online: false,
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '3',
    name: 'Maria Elena, M.Pd.',
    message: 'Terima kasih atas diskusinya tadi, Kak!',
    time: 'Kemarin',
    unread: 0,
    online: false,
    avatar: 'https://images.unsplash.com/photo-1580894732444-8ecded790047?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '4',
    name: 'Budi Santoso',
    message: 'Bagaimana dengan progres...',
    time: 'Senin',
    unread: 1,
    online: true,
    avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=150&q=80',
  },
  {
    id: '5',
    name: 'Dr. Amanda Putri',
    message: 'Sama-sama, selamat belajar ya.',
    time: '22 Okt',
    unread: 0,
    online: false,
    avatar: 'https://images.unsplash.com/photo-1598550874175-4d0ef43ee90d?auto=format&fit=crop&w=150&q=80',
  },
];

export default function ChatScreen() {
  const router = useRouter();

  const renderChatItem = ({ item }: { item: typeof CHATS[0] }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => router.push('/(customer)/chat/room')}
    >
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        {item.online && <View style={styles.onlineDot} />}
      </View>
      
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={[styles.chatMessage, item.unread > 0 && styles.chatMessageUnread]} numberOfLines={1}>
          {item.message}
        </Text>
      </View>

      <View style={styles.chatRight}>
        <Text style={[styles.chatTime, item.unread > 0 && styles.chatTimeActive]}>
          {item.time}
        </Text>
        {item.unread > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{item.unread}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <ArrowLeft size={24} color="#0A1E3F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pesan</Text>
        <TouchableOpacity style={styles.headerBtn}>
          <MoreVertical size={24} color="#0A1E3F" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color={Colors.textMuted} />
          <TextInput 
            placeholder="Cari pesan atau tutor" 
            placeholderTextColor={Colors.textMuted}
            style={styles.searchInput}
          />
        </View>
      </View>

      {/* Chat List */}
      <FlatList 
        data={CHATS}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingTop: 16, 
    paddingBottom: 16, 
    backgroundColor: '#FFF',
  },
  headerBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0A1E3F' },

  searchContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 16,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 14, color: '#0A1E3F' },

  listContent: {
    paddingBottom: 40,
  },
  chatItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F2F5',
    backgroundColor: '#FFF',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E2E8F0',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1C9672',
    borderWidth: 2,
    borderColor: '#FFF',
  },
  chatContent: {
    flex: 1,
    justifyContent: 'center',
  },
  chatName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0A1E3F',
    marginBottom: 4,
  },
  chatMessage: {
    fontSize: 13,
    color: '#7A8C9E',
  },
  chatMessageUnread: {
    fontWeight: 'bold',
    color: '#4A5A75',
  },
  chatRight: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingVertical: 2,
    minWidth: 50,
  },
  chatTime: {
    fontSize: 11,
    color: '#A0AEC0',
    fontWeight: '600',
  },
  chatTimeActive: {
    color: '#1C9672',
  },
  unreadBadge: {
    backgroundColor: '#1C9672',
    paddingHorizontal: 6,
    height: 20,
    minWidth: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  unreadText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
});
