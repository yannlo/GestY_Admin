import "@/app/global.css"
import { Pressable, View, ScrollView, Image } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import ThemedText from "@/components/ui/ThemedText";
import { MenuItem } from "@/components/layouts/Menu/MenuItem";

export default function () {

  const { logout } = useAuth();

  return (
    <ScrollView className="flex-1 bg-gy-gray-50 pb-safe" contentContainerClassName="flex-1 items-center justify-center">
      <View className="flex-1 w-full py-8" >
        <MenuItem href="/settings/auth" icon="admin-panel-settings" title="Paramètres de connexion" />
      </View>
      <View className="mb-12 gap-8 w-full items-center">
        <Pressable className="w-full active:bg-gy-gray-200" onPress={logout}>
          <View className="mx-8 py-2.5 items-center w-max border-t border-b border-gy-gray-300">
            <ThemedText format="menu" color="black">Déconnexion</ThemedText>
          </View>
        </Pressable>
        <Image className="size-32 aspect-square rounded-xl" source={require("@/assets/images/logo/white-full-green.png")} />
      </View>
    </ScrollView>
  );
}