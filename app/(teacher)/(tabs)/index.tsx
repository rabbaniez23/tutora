import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, Switch, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import Colors from "../../../src/constants/Colors";
import { BookOpen, MapPin, Star } from "lucide-react-native";

export default function TeacherDashboard() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Halo, Budi (Level: Senior)</Text>
          <Text style={styles.subtitle}>Siap mengajar hari ini?</Text>
        </View>
        <UserStatusToggle isOnline={isOnline} onToggle={setIsOnline} />
      </View>

      {/* Online Status Card */}
      <View
        style={[
          styles.statusCard,
          isOnline ? styles.onlineCard : styles.offlineCard,
        ]}
      >
        <Text
          style={[styles.statusTitle, { color: isOnline ? "#FFF" : "#333" }]}
        >
          {isOnline ? "Anda Sedang Online" : "Anda Sedang Offline"}
        </Text>
        <Text
          style={[
            styles.statusDesc,
            { color: isOnline ? "rgba(255,255,255,0.8)" : "#666" },
          ]}
        >
          {isOnline
            ? "Menunggu order masuk di sekitar Anda..."
            : "Aktifkan status online untuk mulai menerima order."}
        </Text>

        {isOnline && (
          <TouchableOpacity 
            style={styles.simBtn} 
            onPress={() => router.push('/(teacher)/job/incoming')}
          >
            <Text style={styles.simBtnText}>Simulasikan Order Masuk 🚀</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard title="Pendapatan Hari Ini" value="Rp 120.000" />
        <StatCard title="Total Sesi" value="2 Sesi" />
        <StatCard
          title="Rating"
          value="4.9"
          icon={<Star size={18} color="#FFD700" />}
        />
      </View>
    </SafeAreaView>
  );
}

function UserStatusToggle({
  isOnline,
  onToggle,
}: {
  isOnline: boolean;
  onToggle: (val: boolean) => void;
}) {
  return (
    <View style={styles.toggleContainer}>
      <Text
        style={[
          styles.toggleText,
          { color: isOnline ? Colors.primary : Colors.textMuted },
        ]}
      >
        {isOnline ? "Online" : "Offline"}
      </Text>
      <Switch
        value={isOnline}
        onValueChange={onToggle}
        trackColor={{ false: Colors.border, true: Colors.primary }}
      />
    </View>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        {icon && <View style={styles.statIcon}>{icon}</View>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#FFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  toggleContainer: {
    alignItems: "flex-end",
  },
  toggleText: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statusCard: {
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
  },
  onlineCard: {
    backgroundColor: Colors.primary,
  },
  offlineCard: {
    backgroundColor: Colors.border,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  statusDesc: {
    fontSize: 14,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 8,
  },
  statCard: {
    backgroundColor: "#FFF",
    width: "45%",
    margin: "2.5%",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statTitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
  },
  statIcon: {
    marginLeft: 6,
  },
  simBtn: {
    marginTop: 16,
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  simBtnText: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  }
});
