import { Stack } from 'expo-router';

export default function OrderLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="location" />
      <Stack.Screen name="subject" />
      <Stack.Screen name="searching" options={{ animation: 'fade' }} />
      <Stack.Screen name="tracking" />
      <Stack.Screen name="review" options={{ animation: 'slide_from_bottom' }} />
    </Stack>
  );
}
