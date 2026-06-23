import { useRef, useState } from "react";
import { View, Pressable, Text, Animated, Dimensions } from "react-native";
import { Calendar } from "./Calendar";
import Icon from "../Icon";
import ThemedText from "../ThemedText";
import { inputClassName } from "./BaseInput";
import { ErrorMessage } from "./ErrorMessage";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

type DateInputProps = {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
};

export function DateInput({ label, value, onChange, placeholder = "JJ/MM/AAAA", error, required }: DateInputProps) {
  const [date, setDate] = useState<Date | undefined>(value);
  const [showPicker, setShowPicker] = useState(false);
  const anim = useRef(new Animated.Value(0)).current;

  const formatted = date
    ? date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : undefined;

  const handleDayPress = (selectedDate: Date) => {
    setDate(selectedDate);
    closePicker();
    onChange?.(selectedDate);
  };

  const openPicker = () => {
    setShowPicker(true);
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
  };

  const closePicker = () => {
    Animated.timing(anim, { toValue: 0, duration: 100, useNativeDriver: true }).start(() => setShowPicker(false));
  };

  const togglePicker = () => (showPicker ? closePicker() : openPicker());

  const pickerStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-6, 0] }) }],
  };

  return (
    <View className="gap-0.5" style={showPicker ? { zIndex: 50 } : undefined}>
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}{required ? " *" : ""}</ThemedText>}
      <View className="relative">
        <Pressable onPress={togglePicker}>
          <View className={[inputClassName, "flex-row justify-between items-center pr-3"].join(" ")} style={{ pointerEvents: "none" }}>
            <Text className={formatted ? "font-baloo text-lg text-gy-black py-1.5" : "font-baloo text-lg text-gy-gray-500"}>
              {formatted ?? placeholder}
            </Text>
            <Icon name={showPicker ? "expand-less" : "expand-more"} className="text-gy-gray-500 size-8" />
          </View>
        </Pressable>

        {showPicker && (
          <Pressable
            onPress={closePicker}
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

        {showPicker && (
          <Animated.View
            className="absolute left-0 right-0 top-full mt-1 bg-gy-white rounded-xl border border-gy-gray-200 shadow-md overflow-hidden p-2"
            style={[pickerStyle, { zIndex: 50, elevation: 8 }]}
          >
            <Calendar value={date} onChange={handleDayPress} />
          </Animated.View>
        )}
      </View>
      <ErrorMessage error={error} />
    </View>
  );
}
