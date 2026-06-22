import "@/app/global.css"
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { Platform, View } from "react-native";
import {  KeyboardStickyView } from "react-native-keyboard-controller";


type LayoutWithBottomButtonProps = {
  children: React.ReactNode;
  buttons: React.ReactNode[];
};

export default function ({ children, buttons }: LayoutWithBottomButtonProps) {
  const isKeyboardVisibled = useKeyboardVisible();
  return (
    <View className="bg-gy-gray-50 flex-1">
      <View className="flex-1" >
        {children}
      </View>

      <KeyboardStickyView
        className={`${!isKeyboardVisibled ? "pb-safe" : ""}`}
        offset={{ closed: 0, opened: Platform.OS === "ios" ? 16 : 0 }}
      >
        {buttons.map((button, index) => (
          <View key={index} className="px-10 py-4 border-t bg-gy-white border-gy-gray-200">
            {button}
          </View>
        ))}
      </KeyboardStickyView>
    </View>
  );
}