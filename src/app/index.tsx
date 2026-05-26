import "@/app/global.css"
import { Text, View } from "react-native";
import { Icon } from "@/components/ui/Icon";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-gy-primary-500">
      <Icon name="home" className="text-gy-white size-20" />
      <Text className="mt-5 text-7xl leading-normal  font-baloo-medium text-gy-white ">
        Welcome to GestY
      </Text>
    </View>
  );
}