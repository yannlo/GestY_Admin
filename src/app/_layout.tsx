import "@/app/global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

function RootLayout() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function ProviderLayout() {

  return (
    <AuthProvider>
      <RootLayout />
    </AuthProvider>
  );
}
