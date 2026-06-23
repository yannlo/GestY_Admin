import { useBottomSheet } from "@/hooks/useBottomSheet";
import { PropsWithChildren } from "react";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

type Props = PropsWithChildren<{
  offset?: { open?: number; closed?: number };
  className?: string;
}>;

export default function BottomSheetStickyView({ children, offset, className }: Props) {
  const { collapsedHeight } = useBottomSheet();

  const animatedStyle = useAnimatedStyle(() => ({
    paddingBottom: withSpring(
      collapsedHeight > 0
        ? collapsedHeight + (offset?.open ?? 0)
        : offset?.closed ?? 0,
      { damping: 18, stiffness: 140, mass: 1 }
    ),
  }));

  return (
    <Animated.View style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  );
}
