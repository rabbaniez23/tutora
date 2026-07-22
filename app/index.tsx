import { Redirect } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";
import { View, ActivityIndicator } from "react-native";
import Colors from "@/src/constants/Colors";
import { useEffect } from "react";

// Main gateway that decides where the user should be routed initially
export default function Index() {
  const { isAuthenticated, role, _hasHydrated, loadSession } = useAuthStore();

  useEffect(() => {
    if (!_hasHydrated) {
      loadSession();
    }
  }, [_hasHydrated, loadSession]);

  if (!_hasHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (role === "teacher") {
    return <Redirect href="/(teacher)/(tabs)" />;
  }

  return <Redirect href="/(customer)/(tabs)" />;
}
