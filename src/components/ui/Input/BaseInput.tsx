import { useState } from "react";
import { TextInput, type TextInputProps } from "react-native";

export const inputClassName =
  "bg-gy-white h-12 font-baloo text-lg leading-none self-stretch border text-gy-black border-gy-gray-300 rounded-md pl-4 pt-2 pb-2 w-full placeholder:text-gy-gray-500";

type BaseInputProps = TextInputProps & {
  defaultValue?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
  error?: string;
};

export function BaseInput({ defaultValue, value: controlledValue, onChangeText, className, error, ...props }: BaseInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const displayValue = isControlled ? controlledValue : internalValue;

  const errorClassName = error ? "border-gy-product-red" : "";

  return (
    <TextInput
      value={displayValue}
      onChangeText={(text) => {
        if (!isControlled) {
          setInternalValue(text);
        }
        onChangeText?.(text);
      }}
      className={[inputClassName, errorClassName, className].filter(Boolean).join(" ")}
      placeholderTextColor="#56675c"
      {...props}
    />
  );
}
