import { useState } from "react";
import { View, TextInput } from "react-native";
import ThemedText from "../ThemedText";
import { inputClassName } from "./BaseInput";
import { ErrorMessage } from "./ErrorMessage";

type PhoneInputProps = {
  label?: string;
  defaultValue?: string;
  value?: string;
  onChangeText?: (raw: string) => void;
  error?: string;
  required?: boolean;
};

export function PhoneInput({ label, defaultValue, value: controlledValue, onChangeText, required, error }: PhoneInputProps) {
  const format = (raw: string) =>
    raw.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

  const isControlled = controlledValue !== undefined;
  const [internalDisplay, setInternalDisplay] = useState(
    defaultValue ? format(defaultValue.replace(/\D/g, "").slice(0, 10)) : ""
  );

  const displayValue = isControlled
    ? format((controlledValue ?? "").replace(/\D/g, "").slice(0, 10))
    : internalDisplay;

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    if (!isControlled) {
      setInternalDisplay(format(digits));
    }
    onChangeText?.(digits);
  };

  return (
    <View className="gap-0.5 flex-1">
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}{required ? " *" : ""}</ThemedText>}
      <TextInput
        value={displayValue}
        onChangeText={handleChange}
        keyboardType="phone-pad"
        maxLength={14}
        placeholder="01 02 03 04 05"
        placeholderTextColor="#56675c"
        className={inputClassName}
      />
      <ErrorMessage error={error} />

    </View>
  );
}
