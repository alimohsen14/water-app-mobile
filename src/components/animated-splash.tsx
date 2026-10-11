import * as SplashScreen from "expo-splash-screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Easing, StyleSheet } from "react-native";

// Keep the native splash up until the animated one is mounted so there is
// never a blank white frame between the two.
SplashScreen.preventAutoHideAsync().catch(() => {});

// Fills the entire screen (top-to-bottom, edge-to-edge) while preserving the
// artwork's aspect ratio. The artwork is wider than most phones, so "cover"
// scales it to the screen height and centers it horizontally; the meter and
// droplet are centered and stay fully visible, only the outermost wave edges
// are trimmed. This removes the white letterbox gap that "contain" produced.
const SPLASH_BACKGROUND = "#FFFFFF";
const FADE_IN_DURATION = 450;
const HOLD_DURATION = 2200;
const FADE_OUT_DURATION = 450;

type AnimatedSplashProps = {
  onFinish: () => void;
};

export function AnimatedSplash({ onFinish }: AnimatedSplashProps) {
  const [artworkOpacity] = useState(() => new Animated.Value(0));
  const [containerOpacity] = useState(() => new Animated.Value(1));
  const [scale] = useState(() => new Animated.Value(1.04));
  const started = useRef(false);

  const start = useCallback(() => {
    if (started.current) return;
    started.current = true;

    // Native splash and this screen share the same white background, so
    // hiding the native one here does not flash.
    SplashScreen.hideAsync().catch(() => {});

    Animated.sequence([
      Animated.parallel([
        Animated.timing(artworkOpacity, {
          toValue: 1,
          duration: FADE_IN_DURATION,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 1,
          duration: FADE_IN_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(HOLD_DURATION),
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: FADE_OUT_DURATION,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) onFinish();
    });
  }, [artworkOpacity, containerOpacity, scale, onFinish]);

  useEffect(() => {
    // Fallback in case onLayout never fires.
    const timeout = setTimeout(start, 500);
    return () => clearTimeout(timeout);
  }, [start]);

  return (
    <Animated.View
      pointerEvents="auto"
      style={[styles.container, { opacity: containerOpacity }]}
      onLayout={start}
    >
      <Animated.Image
        source={require("../../assets/splash-screen.png")}
        style={[
          styles.image,
          { opacity: artworkOpacity, transform: [{ scale }] },
        ]}
        resizeMode="cover"
        accessible={false}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: SPLASH_BACKGROUND,
  },
  image: {
    width: "100%",
    height: "100%",
  },
});
