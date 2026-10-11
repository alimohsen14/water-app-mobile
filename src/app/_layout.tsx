import { Stack, ThemeProvider } from "expo-router";
import { useTranslation } from "react-i18next";

import { useLocaleSync } from "@/localization/use-locale-sync";
import { useAppTheme } from "@/theme";

export default function RootLayout() {
  const { colors, navigationTheme } = useAppTheme();
  const { t } = useTranslation();
  useLocaleSync();

  return (
    <ThemeProvider value={navigationTheme}>
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.tint,
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="consumption" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{ title: t("settings.title") }}
        />
      </Stack>
    </ThemeProvider>
  );
}
