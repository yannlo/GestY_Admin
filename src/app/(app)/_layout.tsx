import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import MainHeader from "@/components/layouts/header/MainHeader";


export default function AppLayout() {
  return (
    <>
      <StatusBar backgroundColor="#effbf1" barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="index" options={{ header: () => <MainHeader /> }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
