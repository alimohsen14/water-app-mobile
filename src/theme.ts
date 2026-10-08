import { Color, DarkTheme, DefaultTheme, type Theme } from "expo-router";
import { Platform, type TextStyle, useColorScheme } from "react-native";

export const palettes = {
  light: {
    background: "#F2F8FC",
    surface: "#FFFFFF",
    text: "#0B2432",
    secondaryText: "#5A7A8C",
    separator: "#CBE2EF",
    tint: "#0288D1",
    danger: "#FF3B30",
  },
  dark: {
    background: "#06141C",
    surface: "#0F2430",
    text: "#E6F4FE",
    secondaryText: "#8FB3C6",
    separator: "#22404F",
    tint: "#40B6E6",
    danger: "#FF453A",
  },
} as const;

export const colors = {
  background: Platform.select({
    ios: Color.ios.systemGroupedBackground,
    android: Color.android.dynamic.surface,
    default: palettes.light.background,
  })!,
  surface: Platform.select({
    ios: Color.ios.secondarySystemGroupedBackground,
    android: Color.android.dynamic.surfaceContainer,
    default: palettes.light.surface,
  })!,
  text: Platform.select({
    ios: Color.ios.label,
    android: Color.android.dynamic.onSurface,
    default: palettes.light.text,
  })!,
  secondaryText: Platform.select({
    ios: Color.ios.secondaryLabel,
    android: Color.android.dynamic.onSurfaceVariant,
    default: palettes.light.secondaryText,
  })!,
  separator: Platform.select({
    ios: Color.ios.separator,
    android: Color.android.dynamic.outlineVariant,
    default: palettes.light.separator,
  })!,
  tint: Platform.select({
    ios: Color.ios.systemBlue,
    android: Color.android.dynamic.primary,
    default: palettes.light.tint,
  })!,
  danger: Platform.select({
    ios: Color.ios.systemRed,
    android: Color.android.dynamic.error,
    default: palettes.light.danger,
  })!,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
} as const;

export const opacity = {
  pressed: 0.6,
} as const;

export const typography = {
  body: { fontSize: 17, fontWeight: "400" },
  subhead: {
    fontSize: 15,
    fontWeight: "400",
  },
} as const satisfies Record<string, TextStyle>;

export const navigationThemes = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: palettes.light.tint,
      background: palettes.light.background,
      card: palettes.light.surface,
      text: palettes.light.text,
      border: palettes.light.separator,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: palettes.dark.tint,
      background: palettes.dark.background,
      card: palettes.dark.surface,
      text: palettes.dark.text,
      border: palettes.dark.separator,
    },
  },
} as const satisfies Record<"light" | "dark", Theme>;

export function useAppTheme() {
  const colorScheme = useColorScheme();
  const scheme = colorScheme === "dark" ? "dark" : "light";
  const appColors = process.env.EXPO_OS === "web" ? palettes[scheme] : colors;

  return {
    colors: appColors,
    navigationTheme: navigationThemes[scheme],
    scheme,
  };
}
