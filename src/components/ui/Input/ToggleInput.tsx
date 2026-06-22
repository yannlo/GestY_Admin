import { View, Pressable, PressableProps } from "react-native";
import Toggle from "../Toggle";
import ThemedText from "../ThemedText";

interface ToggleInputProp {
  label: string;
  isToggled: boolean;
  isDisabled?: boolean;
  onChange: PressableProps["onPress"];
}

export function ToggleInput({ label, onChange, isToggled, isDisabled }: ToggleInputProp) {
  const handleChange: PressableProps["onPress"] = (...params) =>{
    if (isDisabled) return;
    onChange?.(...params)
  }
  return (
    <View className="pl-1 w-full" >
      <View className="py-1 w-full flex-row items-center gap-4">
        <Toggle active={isToggled} disabled={isDisabled} onPress={handleChange} />
        <Pressable onPress={handleChange}>
          <ThemedText color={isDisabled?"gray500" :"black"} className="text-lg font-baloo-medium leading-none">{label}</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}
