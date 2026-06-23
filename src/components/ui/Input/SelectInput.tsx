import { useRef, useState } from "react";
import { View, Pressable, Text, ScrollView, Animated, Dimensions } from "react-native";
import Icon from "../Icon";
import ThemedText from "../ThemedText";
import { inputClassName } from "./BaseInput";
import { ErrorMessage } from "./ErrorMessage";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

export type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type SelectInputProps<T extends string = string> = {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
  error?: string;
  required?: boolean;
};

export function SelectInput<T extends string = string>({ label, placeholder = "Sélectionner…", options, value, onChange, error, required }: SelectInputProps<T>) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<T | undefined>(value);
  const anim = useRef(new Animated.Value(0)).current;

  const selected = options.find((o) => o.value === current);

  const openDropdown = () => {
    setOpen(true);
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  const closeDropdown = () => {
    Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => setOpen(false));
  };

  const toggleDropdown = () => (open ? closeDropdown() : openDropdown());

  const dropdownStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) }],
  };

  return (
    <View className="gap-0.5" style={open ? { zIndex: 50 } : undefined}>
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}{required ? " *" : ""}</ThemedText>}
      <View className="relative">
        <Pressable onPress={toggleDropdown}>
          <View className={[inputClassName, "flex-row justify-between items-center pr-3"].join(" ")}>
            <Text className={selected ? "font-baloo text-lg text-gy-black py-1.5" : "font-baloo text-lg text-gy-gray-500"}>
              {selected?.label ?? placeholder}
            </Text>
            <Icon name={open ? "expand-less" : "expand-more"} className="text-gy-gray-500 size-8" />
          </View>
        </Pressable>

        {open && (
          <Pressable
            onPress={closeDropdown}
            style={{
              position: "absolute",
              top: -SCREEN_H,
              left: -SCREEN_W,
              width: SCREEN_W * 3,
              height: SCREEN_H * 3,
              zIndex: 40,
            }}
          />
        )}

        {open && (
          <Animated.View
            className="absolute left-0 right-0 top-full mt-1 bg-gy-white rounded-md border border-gy-gray-200 shadow-md overflow-hidden"
            style={[dropdownStyle, { zIndex: 50, elevation: 8 }]}
          >
            <ScrollView bounces={false} className="max-h-52" keyboardShouldPersistTaps="handled" nestedScrollEnabled>
              {options.map((option, index) => (
                <Pressable
                  key={option.value}
                  className={`px-4 py-3 flex-row justify-between items-center ${index !== 0 ? "border-t border-gy-gray-100" : ""}`}
                  onPress={() => { setCurrent(option.value); onChange?.(option.value); closeDropdown(); }}
                  style={({ pressed }) => ({ backgroundColor: pressed ? "#dde9df" : "transparent" })}
                >
                  <Text className="font-baloo text-lg text-gy-black">{option.label}</Text>
                  {option.value === current && <Icon name="check" className="text-gy-primary-500 size-6" />}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        )}
      </View>
      <ErrorMessage error={error} />
    </View>
  );
}
