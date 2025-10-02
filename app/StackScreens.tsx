import { Stack } from 'expo-router';

export default function StackScreens() {

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="third"
        options={{
          title: 'Settings',
          headerBackTitle: 'Home',
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
