import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Colors from "../../../src/constants/Colors";
import { MessageCircle } from "lucide-react-native";

const CHATS = [
  {
    id: "1",
    name: "Budi Santoso",
    message: "Baik pak, saya segera meluncur.",
    time: "14:20",
    unread: 2,
  },
  {
    id: "2",
    name: "Siti Aminah",
    message: "Tugas minggu lalu sudah selesai?",
    time: "Kemarin",
    unread: 0,
  },
];

export default function CustomerChat() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pesan</Text>
      </View>
      <FlatList
        data={CHATS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.chatItem}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{item.name[0]}</Text>
            </View>
            <View style={styles.chatContent}>
              <View style={styles.chatHeader}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.time}>{item.time}</Text>
              </View>
              <View style={styles.messageRow}>
                <Text style={styles.message} numberOfLines={1}>
                  {item.message}
                </Text>
                {item.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MessageCircle size={48} color={Colors.border} />
            <Text style={styles.emptyText}>Belum ada pesan</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.surface },
  header: {
    padding: 16,
    paddingTop: 60,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: Colors.text },
  list: { padding: 0 },
  chatItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderColor: Colors.surface,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: { color: "#FFF", fontSize: 18, fontWeight: "bold" },
  chatContent: { flex: 1, justifyContent: "center" },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  name: { fontSize: 16, fontWeight: "bold", color: Colors.text },
  time: { fontSize: 12, color: Colors.textMuted },
  messageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  message: { fontSize: 14, color: Colors.textMuted, flex: 1, marginRight: 8 },
  unreadBadge: {
    backgroundColor: Colors.secondary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadText: { color: "#FFF", fontSize: 10, fontWeight: "bold" },
  emptyState: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 16, color: Colors.textMuted, fontSize: 16 },
});
