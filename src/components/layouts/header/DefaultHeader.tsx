import { View } from "react-native";
import { NativeStackHeaderProps, useRouter } from "expo-router";
import { IconButton } from "../../ui/Button";
import ThemedText from "../../ui/ThemedText";

export default function DefaultHeader({ options: { title } }: NativeStackHeaderProps) {
  const router = useRouter();
  return (
    <View className="bg-gy-white pt-safe border-b border-gy-gray-100">
      <View className="py-2 px-6 gap-4 flex-row justify-start items-center">
        <IconButton onPress={() => router.back()} size="sm" variant="ghost" name="arrow-back-ios-new" />
        <ThemedText format="tab">{title}</ThemedText>
      </View>
    </View>
  );
}