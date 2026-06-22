import { View } from "react-native";
import Icon from "../Icon";
import ThemedText from "../ThemedText";
import { Button } from "../Button";
import { BaseInput } from "./BaseInput";
import { PhoneInput } from "./PhoneInput";

type InputVerifiedProps = {
  label?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  type?: "text" | "phone" | "email" | "password";
  onChangeText?: (text: string) => void;
  verified: boolean;
  onVerify: () => void;
  verifyLabel?: string;
};

export function InputVerified({
  label,
  defaultValue,
  value,
  placeholder,
  type,
  onChangeText,
  verified = false,
  onVerify,
}: InputVerifiedProps) {
  if (type === "phone") {
    return (
      <View className="gap-0.5">
        {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
        <View className={verified ? "relative" : "flex-row items-end gap-4"}>
          <PhoneInput
            defaultValue={defaultValue}
            value={value}
            onChangeText={(text) => onChangeText?.(text)}
          />
          {value?.trim().length !== 0 && (
            verified ? (
              <View className="absolute right-3 top-1/2 -translate-y-1/2">
                <Icon name="check-circle" className="text-gy-primary-400 size-7" />
              </View>
            ) : (
              <Button title="Verifier" variant="outline" onPress={onVerify} />
            )
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="gap-0.5">
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
      <View className={verified ? "relative" : "flex-row items-end gap-4"}>
        <BaseInput
          defaultValue={defaultValue}
          value={value}
          onChangeText={(text) => onChangeText?.(text)}
          placeholder={placeholder}
          keyboardType={type === "email" ? "email-address" : "default"}
          secureTextEntry={type === "password"}
          autoCapitalize={type === "text" ? "sentences" : "none"}
          className={verified ? "pr-10" : " flex-1"}
        />
        {verified ? (
          <View className="absolute right-3 top-1/2 -translate-y-1/2">
            <Icon name="check-circle" className="text-gy-primary-400 size-7" />
          </View>
        ) : (type !== "password" ? <Button title="Verifier" variant="outline" onPress={onVerify} /> : null)}
      </View>
    </View>
  );
}
