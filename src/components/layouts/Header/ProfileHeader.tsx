import { View } from "react-native";
import { useRouter } from "expo-router";
import { Button, IconButton } from "../../ui/Button";
import Profile from "../../ui/Profile";
import ThemedText from "../../ui/ThemedText";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileHeader() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View className="bg-gy-white pt-safe border-b border-l border-r rounded-b-2xl border-gy-gray-200">
      <View className="px-6 pt-4 pb-8 gap-5 justify-between">
        <IconButton onPress={() => router.back()} size="sm" variant="ghost" name="arrow-back-ios-new" />
        <View className="gap-6 items-center">
          <View className="w-full items-center gap-4">
            <Profile size="lg" />
            <View className="items-center gap-0">
              <ThemedText format="profileName">{`${user?.firstname} ${user?.lastname}`}</ThemedText>
              <ThemedText format="profileRole">Administrateur</ThemedText>
            </View>
          </View>
          <Button variant="outline" onPress={() => {router.push("/profile/edit");}} title="Mon Profil" />
        </View>
      </View>
    </View>
  );
}