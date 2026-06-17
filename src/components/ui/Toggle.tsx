import { useEffect } from "react";
import { Pressable, type PressableProps } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";
import { tv } from "tailwind-variants";

const THUMB_SIZE = 20;
const TRACK_WIDTH = 44;
const PADDING = 2;
const TRAVEL = TRACK_WIDTH - THUMB_SIZE - PADDING * 2;

const track = tv({
  base: "w-11 h-6 rounded-full",
  variants: {
    active: {
      true: "bg-gy-primary-400",
      false: "bg-gy-gray-300",
    },
    disabled: {
      true: "opacity-70",
    },
  },
  defaultVariants: {
    active: false,
    disabled: false,
  },
});

type ToggleProps = {
  active: boolean;
  disabled?: boolean;
  onPress?: PressableProps["onPress"];
};

export default function Toggle({ active, disabled = false, onPress }: ToggleProps) {
  const translateX = useSharedValue(active ? TRAVEL : 0);

  useEffect(() => {
    translateX.value = withTiming(active ? TRAVEL : 0, { duration: 200 });
  }, [active]);

  const animatedStyle = useAnimatedStyle(() => ({
    position: "absolute",
    top: PADDING,
    left: PADDING + translateX.value,
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: "#effbf1",
  }));

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={track({ active, disabled })}
      style={{ width: TRACK_WIDTH, height: 24 }}
    >
      <Animated.View style={animatedStyle} />
    </Pressable>
  );
}
