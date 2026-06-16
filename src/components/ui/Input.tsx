import { useState } from "react";
import { TextInput, View, type TextInputProps } from "react-native";
import ThemedText from "./ThemedText";

const inputClassName =
  "font-baloo text-lg leading-none self-stretch border text-gy-black border-gy-gray-300 rounded-md pl-4 pt-2 pb-2 w-full placeholder:text-gy-gray-500";


type InputProps = {
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  onChangeText?: (text: string) => void;
};

export default function Input({ label, defaultValue, onChangeText, type, placeholder }: InputProps) {


  return (
    <View className="gap-0.5">
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
      <BaseInput
        defaultValue={defaultValue}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={type === "email" ? "email-address" : "default"}
        secureTextEntry={type === "password"}
        autoCapitalize={type === "text" ? "sentences" : "none"}

      />
    </View>
  );
}


type BaseInputProps = TextInputProps & {
  defaultValue?: string;
  onChangeText?: (text: string) => void;
  className?: string;
};


function BaseInput({ defaultValue, onChangeText, className, ...props }: BaseInputProps) {
  const [value, setValue] = useState(defaultValue ?? "");

  return (
    <TextInput
      value={value}
      onChangeText={(text) => {
        setValue(text);
        onChangeText?.(text);
      }}
      className={[inputClassName, className].filter(Boolean).join(" ")}
      placeholderTextColor="#56675c"
      {...props}
    />
  );
}
