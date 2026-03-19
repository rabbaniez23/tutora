import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from "react-native";
import Colors from "@/src/constants/Colors";

export default function TeacherEarnings() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Pendapatan</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Saldo Dompet Tutor</Text>
          <Text style={styles.balanceAmount}>Rp 450.000</Text>
          <View style={styles.withdrawBtn}>
            <Text style={styles.withdrawText}>Tarik Saldo</Text>
          </View>
        </View>

        <Text style={styles.historyTitle}>Riwayat Transaksi</Text>
        <View style={styles.historyItem}>
          <View>
            <Text style={styles.historyName}>Sesi Matematika - Andi</Text>
            <Text style={styles.historyDate}>Hari ini, 15:30</Text>
          </View>
          <Text style={styles.historyAdd}>+ Rp 120.000</Text>
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
  balanceCard: {
    backgroundColor: Colors.primary,
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    alignItems: "center",
  },
  balanceLabel: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginBottom: 8,
  },
  balanceAmount: {
    color: "#FFF",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 16,
  },
  withdrawBtn: {
    backgroundColor: "#FFF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  withdrawText: { color: Colors.primary, fontWeight: "bold", fontSize: 16 },
  historyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: Colors.text,
  },
  historyItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  historyName: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 4,
  },
  historyDate: { fontSize: 12, color: Colors.textMuted },
  historyAdd: { fontSize: 16, fontWeight: "bold", color: Colors.primary },
});
