import React from "react";
import { TextInputProps, View } from "react-native";
import ThemedText from "../ThemedText";
import Icon from "../Icon";
import { BaseInput, inputClassName } from "./BaseInput";
import { ErrorMessage } from "./ErrorMessage";

type SearchInputProps = {
  label?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  onFocus?: TextInputProps["onFocus"];
  onBlur?: TextInputProps["onBlur"];
  onTouch?: () => void;
  error?: string;
  required?: boolean;
};

export function SearchInput({
    label,
    value,
    defaultValue,
    placeholder,
    onChangeText,
    onFocus,
    onBlur,
    onTouch,
    error,
    required
   }: SearchInputProps) {
    const errorClassName = error ? "border-gy-state-red" : "";
    return (
      <View className="gap-0.5">
        {label && (
          <ThemedText format="label" color="gray800" className="mx-3">
            {label}{required ? " *" : ""}
          </ThemedText>
        )}
        <View className={[inputClassName, "flex-row items-center pl-2.5! gap-2 pr-3", errorClassName].filter(Boolean).join(" ")}>
          <Icon name="search" className="text-gy-gray-600 size-6" />
          <BaseInput defaultValue={defaultValue} value={value} onChangeText={onChangeText} onFocus={onFocus} onBlur={onBlur} onPressIn={onTouch} placeholder={placeholder} className="flex-1 border-0 bg-transparent pt-0! pb-0! pl-0! h-full" />
        </View>
        <ErrorMessage error={error} />
      </View>
    );
}
