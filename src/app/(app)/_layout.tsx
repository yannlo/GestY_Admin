import { StatusBar } from "react-native";
import { Stack } from "expo-router";
import MainHeader from "@/components/layouts/Header/MainHeader";


export default function AppLayout() {
  return (
    <>
      <StatusBar backgroundColor="#effbf1" barStyle="dark-content" />
      <Stack>
        <Stack.Screen name="index" options={{ header: () => <MainHeader />, animationTypeForReplace: "pop", animation: "slide_from_left" }} />
        <Stack.Screen name="profile" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="business" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
