import { useState } from "react";
import { View, Pressable, Text, Platform } from "react-native";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ThemedText from "../ThemedText";
import { inputClassName } from "./BaseInput";
import { ErrorMessage } from "./ErrorMessage";

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

  const formatted = date
    ? date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" })
    : undefined;

  const handleChange = (_: unknown, selected?: Date) => {
    setShowPicker(false);
    if (selected) {
      setDate(selected);
      onChange?.(selected);
    }
  };

  const openPicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: date ?? new Date(),
        mode: "date",
        onChange: handleChange,
      });
    } else {
      setShowPicker(true);
    }
  };

  return (
    <View className="gap-0.5">
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}{required ? " *" : ""}</ThemedText>}
      <Pressable onPress={openPicker}>
        <View className={[inputClassName, "flex-row justify-between items-center"].join(" ")} style={{ pointerEvents: "none" }}>
          <Text className={formatted ? "font-baloo text-lg text-gy-black py-1.5" : "font-baloo text-lg text-gy-gray-500"}>
            {formatted ?? placeholder}
          </Text>
        </View>
      </Pressable>
      {showPicker && Platform.OS === "ios" && (
        <DateTimePicker
          value={date ?? new Date()}
          mode="date"
          display="spinner"
          onValueChange={(_, selected) => {
            if (selected) {
              setDate(selected);
              onChange?.(selected);
            }
          }}
          locale="fr-FR"
        />
      )}
      <ErrorMessage error={error} />
    </View>
  );
}
