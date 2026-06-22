import "@/app/global.css"
import { View } from "react-native";
import ThemedText from "@/components/ui/ThemedText";

export default function () {


  return (
    <View className="flex-1 bg-gy-gray-50 justify-center items-center" >

          <ThemedText format="heroTitle" color="primary500">
            Informations de l'entreprise
          </ThemedText>
    </View>

  );
}
