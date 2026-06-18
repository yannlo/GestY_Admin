import "@/app/global.css"
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useState } from "react";
import { Platform, View } from "react-native";
import { KeyboardAwareScrollView, KeyboardStickyView } from "react-native-keyboard-controller";


type LayoutWithBottomButtonProps = {
  children: React.ReactNode;
  buttons: React.ReactNode[];
};

export default function ({ children, buttons }: LayoutWithBottomButtonProps) {
  const [stickyHeight, setStickyHeight] = useState(0);
  const isKeyboardVisibled = useKeyboardVisible();
  return (
    <View className="bg-gy-gray-50 flex-1">
      <KeyboardAwareScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="pb-5"
        bottomOffset={stickyHeight}
      >
        {children}

      </KeyboardAwareScrollView>

      <KeyboardStickyView
        className={`${!isKeyboardVisibled ? "pb-safe" : ""}`}
        offset={{ closed: 0, opened: Platform.OS === "ios" ? 16 : 0 }}
        onLayout={(e) => setStickyHeight(e.nativeEvent.layout.height+8)}
      >
        {buttons.map((button, index) => (
          <View key={index} className="px-10 py-4 border-t bg-gy-gray-50 border-gy-gray-200">
            {button}
          </View>
        ))}
      </KeyboardStickyView>
    </View>
  );
}