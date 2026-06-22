import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";
import ThemedText from "../ThemedText";

type ErrorMessageProps = {
  error?: string;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
  const anim = useRef(new Animated.Value(0)).current;
  const [displayedError, setDisplayedError] = useState<string | undefined>(error);

  useEffect(() => {
    if (error) {
      setDisplayedError(error);
      Animated.timing(anim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 140,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) setDisplayedError(undefined);
      });
    }
  }, [error]);

  if (!displayedError) return null;

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [
          { translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [-8, 0] }) },
        ],
      }}
    >
      <ThemedText format="label" color="productRed" className="mx-3">
        {displayedError}
      </ThemedText>
    </Animated.View>
  );
}
