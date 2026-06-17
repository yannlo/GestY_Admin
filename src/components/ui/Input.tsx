import { useRef, useState } from "react";
import { Animated, Modal, Platform, Pressable, ScrollView, Text, TextInput, View, type TextInputProps } from "react-native";
import Icon from "./Icon";
import DateTimePicker, { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import ThemedText from "./ThemedText";

const inputClassName =
  "h-12 font-baloo text-lg leading-none self-stretch border text-gy-black border-gy-gray-300 rounded-md pl-4 pt-2 pb-2 w-full placeholder:text-gy-gray-500";


type InputProps = {
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  onChangeText?: (text: string) => void;
};

type DateInputProps = {
  label?: string;
  value?: Date;
  onChange?: (date: Date) => void;
  placeholder?: string;
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
          onChange={handleChange}
          locale="fr-FR"
        />
      )}
    </View>
  );
}

type PhoneInputProps = {
  label?: string;
  defaultValue?: string;
  onChange?: (raw: string) => void;
};

export function PhoneInput({ label, defaultValue, onChange }: PhoneInputProps) {
  const format = (raw: string) =>
    raw.replace(/(\d{2})(?=\d)/g, "$1 ").trim();

  const [display, setDisplay] = useState(
    defaultValue ? format(defaultValue.replace(/\D/g, "").slice(0, 10)) : ""
  );

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, "").slice(0, 10);
    setDisplay(format(digits));
    onChange?.(digits);
  };

  return (
    <View className="gap-0.5">
      {label && <ThemedText format="label" color="gray800" className="mx-3">{label}</ThemedText>}
      <TextInput
        value={display}
        onChangeText={handleChange}
        keyboardType="phone-pad"
        maxLength={14}
        placeholder="XX XX XX XX XX"
        placeholderTextColor="#56675c"
        className={inputClassName}
      />
    </View>
  );
}

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
          <Icon name={open ? "expand-less" : "expand-more"} className="text-gy-gray-500 size-6" />
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
