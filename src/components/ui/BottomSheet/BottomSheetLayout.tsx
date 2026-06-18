import "@/app/global.css";
import { PropsWithChildren, useRef, useCallback, useEffect, useState } from "react";
import { Pressable, View, Animated, PanResponder, Dimensions } from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;
const COLLAPSED_OFFSET = SHEET_HEIGHT * 0.4; // Moitié visible au début
const EXPANDED_OFFSET = 0; // Tout visible
const HIDDEN_OFFSET = SHEET_HEIGHT; // Complètement caché
const DRAG_THRESHOLD = 100;

interface BottomSheetLayoutProps extends PropsWithChildren {
  onClose: () => void;
  expanded?: boolean;
  bgEnabled?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

export default function BottomSheetLayout({
  onClose,
  expanded = false,
  bgEnabled = true,
  onExpandedChange,
  children,
}: BottomSheetLayoutProps) {
  const positionY = useRef(new Animated.Value(HIDDEN_OFFSET)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const isExpandedRef = useRef(expanded);
  const [isClosing, setIsClosing] = useState(false);

  const animatePosition = useCallback((targetY: number, callback?: () => void) => {
    Animated.spring(positionY, {
      toValue: targetY,
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start(() => callback?.());
  }, [positionY]);

  const openAnimations = useCallback(() => {
    // 1. D'abord le fond apparait (fade in)
    Animated.timing(backdropOpacity, {
      toValue: bgEnabled ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // 2. Ensuite le sheet apparait du bas (slide up depuis caché)
      Animated.spring(positionY, {
        toValue: COLLAPSED_OFFSET,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }).start();
    });
  }, [backdropOpacity, positionY, bgEnabled]);

  const closeAnimations = useCallback((callback?: () => void) => {
    // 1. D'abord le content descend (slide down)
    Animated.timing(positionY, {
      toValue: HIDDEN_OFFSET,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      // 2. Ensuite le background fade out
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => {
        callback?.();
      });
    });
  }, [backdropOpacity, positionY]);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    closeAnimations(() => {
      onClose();
    });
  }, [closeAnimations, onClose]);

  const expand = useCallback(() => {
    isExpandedRef.current = true;
    onExpandedChange?.(true);
    animatePosition(EXPANDED_OFFSET);
  }, [animatePosition, onExpandedChange]);

  const collapse = useCallback(() => {
    isExpandedRef.current = false;
    onExpandedChange?.(false);
    animatePosition(COLLAPSED_OFFSET);
  }, [animatePosition, onExpandedChange]);

  useEffect(() => {
    openAnimations();
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const currentY = isExpandedRef.current ? EXPANDED_OFFSET : COLLAPSED_OFFSET;
        const newY = currentY + gestureState.dy;
        // Limiter entre tout visible (0) et caché (SHEET_HEIGHT)
        const clampedY = Math.min(Math.max(newY, EXPANDED_OFFSET), HIDDEN_OFFSET);
        positionY.setValue(clampedY);
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;

        if (isExpandedRef.current) {
          // Déjà expand : vers le bas → collapse
          if (dy > DRAG_THRESHOLD || vy > 0.5) {
            collapse();
          } else {
            expand();
          }
        } else {
          // Collapsed : vers le haut → expand, vers le bas → close
          if (dy < -DRAG_THRESHOLD || vy < -0.5) {
            expand();
          } else if (dy > DRAG_THRESHOLD || vy > 0.5) {
            handleClose();
          } else {
            collapse();
          }
        }
      },
    })
  ).current;

  return (
    <View className="absolute inset-0" style={{ zIndex: 10 }}>
      <Animated.View
        className="absolute inset-0"
        style={{
          backgroundColor: bgEnabled ? "rgba(4, 16, 6, 0.5)" : "transparent",
          opacity: backdropOpacity,
        }}
      >
        <Pressable
          className="absolute inset-0"
          onPress={() => bgEnabled && !isClosing && handleClose()}
        />
      </Animated.View>
      <Animated.View
        className={`absolute bottom-0 left-0 right-0 bg-gy-white ${bgEnabled ? "" : "border border-gy-gray-200"} rounded-t-2xl pb-safe`}
        style={{ 
          height: SHEET_HEIGHT,
          transform: [{ translateY: positionY }],
        }}
        {...panResponder.panHandlers}
      >
        <View className="items-center pt-3 pb-1">
          <View className="w-16 h-1 rounded-full bg-gy-gray-300" />
        </View>
        <View className="flex-1 overflow-hidden">
          {children}
        </View>
      </Animated.View>
    </View>
  );
}
