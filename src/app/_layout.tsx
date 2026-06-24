import "@/app/global.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { BottomSheetProvider } from "@/contexts/BottomSheetContext";
import { Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { View } from "react-native";
import LoadingScreen from "@/components/layouts/LoadingScreen";

const queryClient = new QueryClient();

function RootLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.replace( '/profile/edit');
  //   }
  // }, [isAuthenticated]);

  if (isLoading) return (
    <View className="flex-1 bg-gy-white">
      <LoadingScreen isLoading={true} />
    </View>
  );

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
