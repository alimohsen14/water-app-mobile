import { Stack, ThemeProvider } from "expo-router";

import { useLocaleSync } from "@/localization/use-locale-sync";
import { useAppTheme } from "@/theme";

export default function RootLayout() {
  const { colors, navigationTheme } = useAppTheme();
  useLocaleSync();

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
        }}
      />
    </ThemeProvider>
  );
}
