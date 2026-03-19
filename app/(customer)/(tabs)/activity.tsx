import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Colors from "../../../src/constants/Colors";
import { Clock, CheckCircle } from "lucide-react-native";

export default function CustomerActivity() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Riwayat Belajar</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>Hari ini, 14:00</Text>
            <View
              style={[styles.badge, { backgroundColor: Colors.primary + "20" }]}
            >
              <Text style={[styles.badgeText, { color: Colors.primary }]}>
                Selesai
              </Text>
            </View>
          </View>
          <Text style={styles.subject}>Matematika SMA</Text>
          <Text style={styles.teacherName}>Tutor: Budi Santoso</Text>
          <Text style={styles.price}>Rp 120.000</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.date}>Kemarin, 16:30</Text>
            <View style={[styles.badge, { backgroundColor: Colors.border }]}>
              <Text style={[styles.badgeText, { color: Colors.textMuted }]}>
                Dibatalkan
              </Text>
            </View>
          </View>
          <Text style={styles.subject}>Bahasa Inggris SMP</Text>
          <Text style={styles.teacherName}>Tutor: Siti Aminah</Text>
          <Text style={styles.price}>Rp 85.000</Text>
        </View>
      </ScrollView>
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
  content: { padding: 16 },
  card: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  date: { fontSize: 12, color: Colors.textMuted },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 10, fontWeight: "bold" },
  subject: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  teacherName: { fontSize: 14, color: Colors.textMuted, marginBottom: 8 },
  price: { fontSize: 16, fontWeight: "bold", color: Colors.text },
});
