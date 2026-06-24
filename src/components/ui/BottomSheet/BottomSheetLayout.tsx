import "@/app/global.css";
import React, { PropsWithChildren, useRef, useCallback, useEffect, useState } from "react";
import { View, PanResponder, Dimensions, ScrollView, LayoutChangeEvent } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming, runOnJS } from "react-native-reanimated";
import ThemedText from "../ThemedText";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.82;
const EXPANDED_OFFSET = 0; // Tout visible
const HIDDEN_OFFSET = SHEET_HEIGHT; // Complètement caché
const DRAG_THRESHOLD = 100;

interface BottomSheetLayoutProps extends PropsWithChildren {
  sheetId: string;
  onBackdropPress: () => void;
  onClosed: (id: string) => void;
  isClosing: boolean;
  isTransitioningOut?: boolean;
  onTransitionedOut?: () => void;
  bgEnabled?: boolean;
  header?: React.ReactNode | string;
  expanded?: boolean;
  onCollapsedHeightChange?: (height: number) => void;
  onCollapse?: () => void;
  onExpand?: () => void;
}

export default function BottomSheetLayout({
  sheetId,
  onBackdropPress,
  onClosed,
  isClosing,
  isTransitioningOut = false,
  onTransitionedOut,
  bgEnabled = true,
  header,
  expanded = false,
  onCollapsedHeightChange,
  onCollapse,
  onExpand,
  children,
}: BottomSheetLayoutProps) {
  const positionY = useSharedValue(HIDDEN_OFFSET);
  const isExpandedRef = useRef(false);
  const isClosingRef = useRef(false);
  const isTransitioningOutRef = useRef(false);
  const [scrollEnabled, setScrollEnabled] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const onCollapseRef = useRef(onCollapse);
  onCollapseRef.current = onCollapse;
  const onExpandRef = useRef(onExpand);
  onExpandRef.current = onExpand;

  // Mesure de la hauteur naturelle du contenu pour calculer l'offset collapsed
  const chromeHeightRef = useRef(0); // poignée + titre
  const contentHeightRef = useRef(0); // contenu scrollable
  const collapsedOffsetRef = useRef(HIDDEN_OFFSET);
  const hasShownRef = useRef(false);
  // On attend que chrome ET contenu soient mesurés avant le slide-up initial
  const chromeMeasuredRef = useRef(false);
  const contentMeasuredRef = useRef(false);

  const animatePosition = useCallback((targetY: number, callback?: () => void) => {
    positionY.value = withSpring(
      targetY,
      { damping: 18, stiffness: 140, mass: 1 },
      (finished) => {
        'worklet';
        if (finished && callback) runOnJS(callback)();
      }
    );
  }, [positionY]);

  // Recalcule l'offset collapsed à partir de la hauteur naturelle mesurée du contenu
  const recomputeCollapsed = useCallback(() => {
    const natural = chromeHeightRef.current + contentHeightRef.current;
    if (natural <= 0) return;
    const MAX_COLLAPSED_HEIGHT = SHEET_HEIGHT * 0.6;
    const clampedNatural = Math.min(natural, MAX_COLLAPSED_HEIGHT);
    const offset = Math.min(Math.max(SHEET_HEIGHT - clampedNatural, EXPANDED_OFFSET), HIDDEN_OFFSET);
    collapsedOffsetRef.current = offset;
    onCollapsedHeightChange?.(SHEET_HEIGHT - offset);
    if (!hasShownRef.current) {
      // Attendre les DEUX mesures (chrome + contenu) avant le slide-up initial,
      // sinon on anime vers une position erronée puis on ré-anime → saccade + taps annulés
      if (!chromeMeasuredRef.current || !contentMeasuredRef.current) return;
      // Slide up unique jusqu'à la hauteur naturelle du contenu
      hasShownRef.current = true;
      animatePosition(offset);
    } else if (
      !isExpandedRef.current &&
      !isClosingRef.current &&
      !isTransitioningOutRef.current
    ) {
      // Le contenu a changé pendant qu'on est en collapsed → ajuster
      animatePosition(offset);
    }
  }, [animatePosition, onCollapsedHeightChange]);

  const onChromeLayout = useCallback((e: LayoutChangeEvent) => {
    chromeHeightRef.current = e.nativeEvent.layout.height;
    chromeMeasuredRef.current = true;
    recomputeCollapsed();
  }, [recomputeCollapsed]);

  const onContentSizeChange = useCallback((_w: number, h: number) => {
    contentHeightRef.current = h;
    contentMeasuredRef.current = true;
    recomputeCollapsed();
  }, [recomputeCollapsed]);

  // Détecte la fermeture programmatique (depuis BSBase) : slide down
  useEffect(() => {
    if (isClosing && !isClosingRef.current) {
      isClosingRef.current = true;
      onCollapsedHeightChange?.(0);
      positionY.value = withTiming(HIDDEN_OFFSET, { duration: 200 }, (finished) => {
        'worklet';
        if (finished) {
          runOnJS(onClosed)(sheetId);
        }
      });
    } else if (!isClosing && isClosingRef.current) {
      isClosingRef.current = false;
    }
  }, [isClosing, positionY, onClosed, sheetId, onCollapsedHeightChange]);

  // Transition sheet→sheet : slide down avant l'arrivée du suivant
  useEffect(() => {
    if (isTransitioningOut && !isTransitioningOutRef.current) {
      isTransitioningOutRef.current = true;
      positionY.value = withTiming(HIDDEN_OFFSET, { duration: 200 }, (finished) => {
        'worklet';
        if (finished && onTransitionedOut) runOnJS(onTransitionedOut)();
      });
    } else if (!isTransitioningOut && isTransitioningOutRef.current) {
      isTransitioningOutRef.current = false;
    }
  }, [isTransitioningOut, positionY, onTransitionedOut]);

  const expand = useCallback(() => {
    isExpandedRef.current = true;
    setScrollEnabled(true);
    animatePosition(EXPANDED_OFFSET);
  }, [animatePosition]);

  const collapse = useCallback(() => {
    isExpandedRef.current = false;
    setScrollEnabled(false);
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
    animatePosition(collapsedOffsetRef.current);
  }, [animatePosition]);

  // Synchronise l'expansion contrôlée depuis le contexte
  // Pendant une fermeture/transition, on ignore les changements d'expansion
  // pour éviter que le sheet ne repasse en collapsed au lieu de sortir par le bas
  useEffect(() => {
    if (isClosingRef.current || isTransitioningOutRef.current) return;
    if (expanded && !isExpandedRef.current) {
      expand();
    } else if (!expanded && isExpandedRef.current) {
      collapse();
    }
  }, [expanded, expand, collapse]);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        const currentY = isExpandedRef.current ? EXPANDED_OFFSET : collapsedOffsetRef.current;
        const newY = currentY + gestureState.dy;
        // Limiter entre tout visible (0) et caché (SHEET_HEIGHT)
        const clampedY = Math.min(Math.max(newY, EXPANDED_OFFSET), HIDDEN_OFFSET);
        positionY.value = clampedY;
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;

        if (isExpandedRef.current) {
          // Déjà expand : vers le bas → fermer complètement
          if (dy > DRAG_THRESHOLD || vy > 0.5) {
            onBackdropPress();
          } else {
            expand();
          }
        } else {
          // Collapsed : vers le haut → expand, vers le bas → closeAll
          if (dy < -DRAG_THRESHOLD || vy < -0.5) {
            expand();
            onExpandRef.current?.();
          } else if (dy > DRAG_THRESHOLD || vy > 0.5) {
            onBackdropPress();
          } else {
            collapse();
          }
        }
      },
    })
  ).current;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: positionY.value }],
  }));

  return (
    <View className="absolute inset-0" style={{ zIndex: 10 }} pointerEvents="box-none">
      <Animated.View
        style={[
          { position: "absolute", bottom: 0, left: 0, right: 0, height: SHEET_HEIGHT },
          animatedStyle,
        ]}
      >
        <View
          className={`flex-1 bg-gy-white ${bgEnabled ? "" : "border border-gy-gray-200"} rounded-t-2xl pb-safe`}
        >
        <View onLayout={onChromeLayout} {...panResponder.panHandlers}>
          <View className="items-center pt-4 pb-2">
            <View className="w-32 h-1 rounded-full bg-gy-gray-300" />
          </View>
          {typeof header === "string" ? (
            <View className="py-3 items-center">
              <ThemedText format="bottomSheetTitle" color="black">
                {header}
              </ThemedText>
            </View>
          ) : header}
        </View>
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 "
          contentContainerClassName="pb-safe-offset-8"
          scrollEnabled={scrollEnabled}
          bounces={false}
          overScrollMode="never"
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={onContentSizeChange}
        >
          {children}
        </ScrollView>
        </View>
      </Animated.View>
    </View>
  );
}
