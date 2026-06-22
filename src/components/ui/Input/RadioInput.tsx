import { Pressable, View } from "react-native";
import ThemedText from "../ThemedText";
import { ErrorMessage } from "./ErrorMessage";

export type RadioOption<T extends string> = {
  label: string;
  value: T;
};

type RadioInputProps<T extends string> = {
  label?: string;
  options: RadioOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  error?: string;
  required?: boolean;
};

export function RadioInput<T extends string>({
  label,
  options,
  value,
  onChange,
  error,
  required,
}: RadioInputProps<T>) {
  return (
    <View className="gap-0.5">
      {label && (
        <ThemedText format="label" color="gray800" className="mx-3">
          {label}{required ? " *" : ""}
        </ThemedText>
      )}
      <View className="pl-2 gap-3">
        {options.map((option) => {
          const isSelected = value === option.value;
          return (
            <Pressable
              key={option.value}
              className="flex-row items-center gap-2"
              onPress={() => onChange(option.value)}
            >
              <View className="size-5 items-center justify-center rounded-full border border-gy-gray-400 bg-gy-primary-50">
                {isSelected && (
                  <View className="size-3 rounded-full bg-gy-gray-700" />
                )}
              </View>
              <ThemedText color="gray900" className="text-lg font-baloo-medium leading-none">
                {option.label}
              </ThemedText>
            </Pressable>
          );
        })}
      </View>
      <ErrorMessage error={error} />
    </View>
  );
}
