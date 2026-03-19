import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../src/store/useAuthStore";
import Colors from "../../src/constants/Colors";
import Button from "../../src/components/ui/Button";
import Input from "../../src/components/ui/Input";

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleLoginCustomer = () => {
    login("customer");
    router.replace("/(customer)/(tabs)");
  };

  const handleLoginTeacher = () => {
    login("teacher");
    router.replace("/(teacher)/(tabs)");
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.heroSection}>
          <Text style={styles.appName}>Tutora</Text>
          <Text style={styles.tagline}>
            Mencari guru privat menjadi semudah pesan makanan.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Masuk / Daftar</Text>
          <Input
            label="Nomor Telepon"
            placeholder="0812xxxxxx"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <View style={styles.btnContainer}>
            <Button
              title="Masuk sebagai Siswa"
              onPress={handleLoginCustomer}
              style={{ marginBottom: 16 }}
            />
            <Button
              title="Masuk sebagai Mitra Tutor"
              variant="outline"
              onPress={handleLoginTeacher}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  keyboardView: {
    flex: 1,
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 20,
  },
  appName: {
    color: "#FFF",
    fontSize: 42,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tagline: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 18,
    lineHeight: 26,
  },
  formSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 24,
  },
  btnContainer: {
    marginTop: 24,
  },
});
