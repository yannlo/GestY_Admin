import "@/app/global.css"
import { useState } from "react";
import { View } from "react-native";
import { Button } from "@/components/ui/Button";
import BottomSheetDefault from "@/components/ui/BottomSheet/BottomSheetBase";
import ThemedText from "@/components/ui/ThemedText";

export default function App() {
  const [showBS1, setShowBS1] = useState(false);
  const [showBS2, setShowBS2] = useState(false);

  return (
    <View className="flex-1 items-center justify-center bg-gy-gray-50">

      <Button title="Ouvrir le sheet" onPress={() => setShowBS1(true)} />

      <BottomSheetDefault visible={showBS1} onClose={() => setShowBS1(false)} title="Options">
        <ThemedText className="px-6 py-3">Contenu du bottom sheet</ThemedText>
        <Button title="Open BS 2" onPress={() => setShowBS2(true)} className="mb-300" />
        <Button title="Fermer" onPress={() => setShowBS1(false)} />
      </BottomSheetDefault>

      <BottomSheetDefault visible={showBS2} onClose={() => setShowBS2(false)} bgVisible={false} title="Options">
        <ThemedText className="px-6 py-3">Contenu du bottom sheet</ThemedText>
        <Button title="Fermer" onPress={() => setShowBS2(false)} />
      </BottomSheetDefault>

    </View>
  );
}