import { View } from "react-native";
import ThemedText from "../ThemedText";
import { BaseInput } from "./BaseInput";
import { PhoneInput } from "./PhoneInput";
import { ErrorMessage } from "./ErrorMessage";

type InputProps = {
  label?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "phone";
  onChangeText?: (text: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
};

export default function Input({ label, defaultValue, value, onChangeText, type, placeholder, onBlur, error, required }: InputProps) {
  if (type === "phone") {
    return <PhoneInput label={label} defaultValue={defaultValue} value={value} onChangeText={onChangeText} error={error} required={required} />;
  }

  return (
    <View className="gap-0.5">
      {label && (
        <ThemedText format="label" color="gray800" className="mx-3">
          {label}{required ? " *" : ""}
        </ThemedText>
      )}
      <BaseInput
        defaultValue={defaultValue}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        error={error}
        placeholder={placeholder}
        keyboardType={type === "email" ? "email-address" : "default"}
        secureTextEntry={type === "password"}
        autoCapitalize={type === "text" ? "sentences" : "none"}
      />
      <ErrorMessage error={error} />
    </View>
  );
}
