import "@/app/global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { router, Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";

const queryClient = new QueryClient();

function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace('/business/add/account');
  //   }
  // }, [isAuthenticated]);

  if (isLoading) return null;

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
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <AuthProvider>
          <BottomSheetProvider>
            <RootLayout />
          </BottomSheetProvider>
        </AuthProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
