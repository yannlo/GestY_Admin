import "@/app/global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Stack, useRouter } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

function RootLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/settings/setPassword');
  //   }
  // }, [isAuthenticated]);

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
