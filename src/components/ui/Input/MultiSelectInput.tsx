import { useMemo, useRef, useState } from "react";
import { View, Pressable, TextInput, ScrollView, Text, Modal, Animated } from "react-native";
import ThemedText from "../ThemedText";
import Icon from "../Icon";
import Tag from "../Tag";
import { type SelectOption } from "./SelectInput";
import { ErrorMessage } from "./ErrorMessage";

type MultiSelectInputProps<T extends string = string> = {
  label?: string;
  placeholder?: string;
  options: SelectOption<T>[];
  value?: T[];
  onChange?: (value: T[]) => void;
  creatable?: boolean;
  error?: string;
  required?: boolean;
  onBlur?: () => void;
};

const containerClassName =
  "bg-gy-white h-12 font-baloo text-lg leading-none self-stretch border text-gy-black border-gy-gray-300 rounded-md pl-4  w-full";

export function MultiSelectInput<T extends string = string>({
  label,
  placeholder = "Ajouter…",
  options,
  value: controlledValue,
  onChange,
  creatable = false,
  error,
  required,
  onBlur,
}: MultiSelectInputProps<T>) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<T[]>([]);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const triggerRef = useRef<View>(null);
  const anim = useRef(new Animated.Value(0)).current;

  const selectedValues = isControlled ? controlledValue : internalValue;
  const selectedSet = useMemo(() => new Set(selectedValues), [selectedValues]);

  const toggle = (val: T) => {
    const next = selectedSet.has(val)
      ? selectedValues.filter((v) => v !== val)
      : [...selectedValues, val];
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  };

  const addNew = (raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) {
      setQuery("");
      return;
    }
    const existing = options.find(
      (o) => o.label.toLowerCase() === trimmed.toLowerCase() || o.value === trimmed
    );
    if (existing) {
      if (!selectedSet.has(existing.value as T)) {
        toggle(existing.value as T);
      }
    } else if (creatable) {
      toggle(trimmed as T);
    }
    setQuery("");
  };

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return options.filter((o) => !selectedSet.has(o.value) && o.label.toLowerCase().includes(q));
  }, [options, query, selectedSet]);

  const showCreate =
    creatable &&
    query.trim() &&
    !options.some((o) => o.label.toLowerCase() === query.trim().toLowerCase());

  const openDropdown = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y, width, height });
      setOpen(true);
      anim.setValue(0);
      Animated.timing(anim, { toValue: 1, duration: 120, useNativeDriver: true }).start();
    });
  };

  const closeDropdown = () => {
    Animated.timing(anim, { toValue: 0, duration: 80, useNativeDriver: true }).start(() => {
      setOpen(false);
      setDropdownLayout(null);
      onBlur?.();
    });
  };

  const dropdownStyle = {
    opacity: anim,
    transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-4, 0] }) }],
  };

  return (
    <View className="gap-0.5">
      {label && (
        <ThemedText format="label" color="gray800" className="mx-3">
          {label}{required ? " *" : ""}
        </ThemedText>
      )}
      <View
        ref={triggerRef}
        className={[containerClassName, "flex-row  pr-2", error ? "border-gy-product-red" : ""].filter(Boolean).join(" ")}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ alignItems: "center", gap: 8 }}
        >
          {selectedValues.map((val) => {
            const option = options.find((o) => o.value === val);
            return (
              <Tag label={option?.label ?? val} key={val} onPress={() => toggle(val)} />
            );
          })}
          <TextInput
            value={query}
            onChangeText={setQuery}
            onFocus={openDropdown}
            onSubmitEditing={() => {
              addNew(query);
              closeDropdown();
            }}
            placeholder={selectedValues.length === 0 ? placeholder : ""}
            placeholderTextColor="#56675c"
            className=" pb-0 pt-0 flex items-center font-baloo text-lg text-gy-black min-w-32 Z pl-2 placeholder:leading-none placeholder:items-center"
          />
        </ScrollView>
      </View>

      {open && dropdownLayout && (
        <Modal visible transparent animationType="none" onRequestClose={closeDropdown}>
          <Pressable style={{ flex: 1 }} onPress={closeDropdown} />
          <Animated.View
            className="bg-gy-white rounded-md border border-gy-gray-200 overflow-hidden"
            style={[
              dropdownStyle,
              {
                position: "absolute",
                top: dropdownLayout.y + dropdownLayout.height + 40,
                left: dropdownLayout.x,
                width: dropdownLayout.width,
                maxHeight: 208,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 6,
              },
            ]}
          >
            <ScrollView bounces={false} keyboardShouldPersistTaps="handled">
              {filtered.length === 0 && !showCreate && (
                <View className="px-4 py-3">
                  <ThemedText format="label" color="gray500">Aucune option</ThemedText>
                </View>
              )}
              {filtered.map((option, index) => (
                <Pressable
                  key={option.value}
                  className={`px-4 py-3 flex-row justify-between items-center ${index !== 0 ? "border-t border-gy-gray-100" : ""}`}
                  style={({ pressed }) => ({ backgroundColor: pressed ? "#dde9df" : "transparent" })}
                  onPress={() => {
                    toggle(option.value);
                    setQuery("");
                  }}
                >
                  <Text className="font-baloo text-lg text-gy-black">{option.label}</Text>
                  <Icon name="add" className="text-gy-primary-500 size-5" />
                </Pressable>
              ))}
              {showCreate && (
                <Pressable
                  className={`px-4 py-3 flex-row items-center ${filtered.length !== 0 ? "border-t border-gy-gray-100" : ""}`}
                  style={({ pressed }) => ({ backgroundColor: pressed ? "#dde9df" : "transparent" })}
                  onPress={() => {
                    addNew(query);
                    closeDropdown();
                  }}
                >
                  <Text className="font-baloo text-lg text-gy-primary-500">Ajouter "{query.trim()}"</Text>
                </Pressable>
              )}
            </ScrollView>
          </Animated.View>
        </Modal>
      )}

      <ErrorMessage error={error} />
    </View>
  );
}

export default MultiSelectInput;
