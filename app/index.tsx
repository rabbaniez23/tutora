import { Redirect } from "expo-router";
import { useAuthStore } from "@/src/store/useAuthStore";

// Main gateway that decides where the user should be routed initially
export default function Index() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (role === "teacher") {
    return <Redirect href="/(teacher)/(tabs)" />;
  }

  return <Redirect href="/(customer)/(tabs)" />;
}
