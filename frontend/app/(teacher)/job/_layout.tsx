import { Stack } from 'expo-router';

export default function JobLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="incoming" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
      <Stack.Screen name="active" />
    </Stack>
  );
}
