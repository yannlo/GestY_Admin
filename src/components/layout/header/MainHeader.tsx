import { Image, View } from "react-native";
import { router } from "expo-router";
import Profile from "../../ui/Profile";

export default function MainHeader() {
    return (
        <View className="bg-gy-white pt-safe">
            <View className="h-18 px-6 flex-row justify-between items-center border-b border-gy-gray-100">
                <Image className="w-38 aspect-59/20" source={require("@/assets/images/logo/green-line-transparent.png")} />
                <Profile size="md" onPress={() => router.push('/profile')} />
            </View>
        </View>
    );
}