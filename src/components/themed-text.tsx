import { Text, type TextProps } from "react-native";

import { typography, useAppTheme } from "@/theme";

type ThemedTextProps = TextProps & {
  variant?: keyof typeof typography;
};

export function ThemedText({
  variant = "body",
  style,
  children,
  ...props
}: ThemedTextProps) {
  const { colors } = useAppTheme();
  const variantColors = {
    largeTitle: colors.text,
    title: colors.text,
    headline: colors.text,
    body: colors.text,
    subhead: colors.secondaryText,
    caption: colors.secondaryText,
  } as const;

  return (
    <Text
      style={[{ color: variantColors[variant] }, typography[variant], style]}
      {...props}
    >
      {children}
    </Text>
  );
}
