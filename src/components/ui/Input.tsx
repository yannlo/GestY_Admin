import { useRef, useState } from "react";
import { Animated, Modal, Platform, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import Icon from "./Icon";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ThemedText from "./ThemedText";
import { Button } from "./Button";

const inputClassName =
  "bg-gy-white h-12 font-baloo text-lg leading-none self-stretch border text-gy-black border-gy-gray-300 rounded-md pl-4 pt-2 pb-2 w-full placeholder:text-gy-gray-500";


// Default
type InputProps = {
  label?: string;
  defaultValue?: string;
  value?: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "phone";
  onChangeText?: (text: string) => void;
};

export default function Input({ label, defaultValue, value, onChangeText, type, placeholder }: InputProps) {


  if(type == "phone"){
    return <PhoneInput label={label} defaultValue={defaultValue} value={value} onChangeText={onChangeText}  />
  }

  return (
    <View className="gap-0.5">
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
      <BaseInput
        defaultValue={defaultValue}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={type === "email" ? "email-address" : "default"}
        secureTextEntry={type === "password"}
        autoCapitalize={type === "text" ? "sentences" : "none"}

      />
    </View>
  );
}


// Base
type BaseInputProps = TextInputProps & {
  defaultValue?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
};

function BaseInput({ defaultValue, value: controlledValue, onChangeText, className, ...props }: BaseInputProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? "");

  const displayValue = isControlled ? controlledValue : internalValue;

  return (
    <TextInput
      value={displayValue}
      onChangeText={(text) => {
        if (!isControlled) {
          setInternalValue(text);
        }
        onChangeText?.(text);
      }}
      className={[inputClassName, className].filter(Boolean).join(" ")}
      placeholderTextColor="#56675c"
      {...props}
    />
  );
}



// Date
type DateInputProps = {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
};

export function DateInput({ label, value, onChange, placeholder = "JJ/MM/AAAA" }: DateInputProps) {
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
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
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
    </View>
  );
}


// Phone
type PhoneInputProps = {
  label?: string;
  defaultValue?: string;
  value?: string;
  onChangeText?: (raw: string) => void;
};

function PhoneInput({ label, defaultValue, value: controlledValue, onChangeText }: PhoneInputProps) {
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
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
      <TextInput
        value={displayValue}
        onChangeText={handleChange}
        keyboardType="phone-pad"
        maxLength={14}
        placeholder="01 02 03 04 05"
        placeholderTextColor="#56675c"
        className={inputClassName}
      />
    </View>
  );
}




// Select
type SelectOption<T extends string = string> = {
  label: string;
  value: T;
};

type SelectInputProps<T extends string = string> = {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T;
  onChange?: (value: T) => void;
};

export function SelectInput<T extends string = string>({ label, placeholder = "Sélectionner…", options, value, onChange }: SelectInputProps<T>) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<T | undefined>(value);
  const triggerRef = useRef<View>(null);
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
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
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
    </View>
  );
}


// Verified

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
          {verified ? (
            <View className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="check-circle" className="text-gy-primary-400 size-7" />
            </View>
          ) : (
            <Button title="Verifier" variant="outline" onPress={onVerify} />
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
        ) : (type != "password" ? <Button title="Verifier" variant="outline" onPress={onVerify} /> : null)}
      </View>
    </View>
  );
}
