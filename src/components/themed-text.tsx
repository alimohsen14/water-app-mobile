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
    body: colors.text,
    subhead: colors.secondaryText,
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
