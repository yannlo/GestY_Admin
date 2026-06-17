import "@/app/global.css"
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/hooks/useAuth";

export default function App() {

  const [isIconFilled, setIsIconFilled] = useState(false);
  const {logout} = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-gy-primary-500">
      <Pressable onPress={() => setIsIconFilled((current) => !current)}>
        <Icon name="groups" fill={isIconFilled} className="text-gy-white size-20" />
      </Pressable>
      
      <Text className="mt-5 text-5xl text-center font-baloo-medium text-gy-white ">
        Welcome to GestY Admin
      </Text>

        <Pressable className="mt-10" onPress={() => logout()}>
        <Icon name="logout" className="text-gy-white size-10" />
      </Pressable>
    </View>
  );
}