import { useRef, useState } from "react";
import { View, Pressable, Text, ScrollView, Modal, Animated, type View as ViewType } from "react-native";
import Icon from "../Icon";
import ThemedText from "../ThemedText";
import { inputClassName } from "./BaseInput";
import { ErrorMessage } from "./ErrorMessage";

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
  const triggerRef = useRef<ViewType>(null);
  const anim = useRef(new Animated.Value(0)).current;
  const [dropdownLayout, setDropdownLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);

  const selected = options.find((o) => o.value === current);

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y, width, height });
      setOpen(true);
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    });
  };

  const closeDropdown = () => {
    Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => setOpen(false));
  };

  const dropdownStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) }],
  };

  return (
    <View className="gap-0.5">
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}{required ? " *" : ""}</ThemedText>}
      <Pressable onPress={openDropdown} ref={triggerRef as any}>
        <View className={[inputClassName, "flex-row justify-between items-center pr-3"].join(" ")}>
          <Text className={selected ? "font-baloo text-lg text-gy-black py-1.5" : "font-baloo text-lg text-gy-gray-500"}>
            {selected?.label ?? placeholder}
          </Text>
          <Icon name={open ? "expand-less" : "expand-more"} className="text-gy-gray-500 size-8" />
        </View>
      </Pressable>

      {open && dropdownLayout && (
        <Modal visible transparent animationType="none" onRequestClose={closeDropdown}>
          <Pressable style={{ flex: 1 }} onPress={closeDropdown} />
          <Animated.View
            style={[
              dropdownStyle,
              {
                position: "absolute",
                top: dropdownLayout.y + dropdownLayout.height + 40,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
                backgroundColor: "#effbf1",
                borderRadius: 8,
                borderWidth: 1,
                borderColor: "#c4d4c9",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 6,
                overflow: "hidden",
              },
            ]}
          >
            <ScrollView bounces={false} style={{ maxHeight: 208 }}>
              {options.map((option, index) => (
                <Pressable
                  key={option.value}
                  style={({ pressed }) => ({
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: pressed ? "#ddeee2" : "transparent",
                    borderTopWidth: index === 0 ? 0 : 1,
                    borderTopColor: "#e5f0e8",
                  })}
                  onPress={() => { setCurrent(option.value); onChange?.(option.value); closeDropdown(); }}
                >
                  <Text className="font-baloo text-lg text-gy-black">{option.label}</Text>
                  {option.value === current && <Icon name="check" className="text-gy-primary-500 size-6" />}
                </Pressable>
              ))}
            </ScrollView>
          </Animated.View>
        </Modal>
      )}
      <ErrorMessage error={error} />
    </View>
  );
}
