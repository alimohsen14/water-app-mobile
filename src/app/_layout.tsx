import { Stack, ThemeProvider } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { AnimatedSplash } from "@/components/animated-splash";
import { useLocaleSync } from "@/localization/use-locale-sync";
import { useAppTheme } from "@/theme";

export default function RootLayout() {
  const { colors, navigationTheme } = useAppTheme();
  const { t } = useTranslation();
  useLocaleSync();
  const [splashDone, setSplashDone] = useState(false);

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
        <Stack.Screen name="alerts" options={{ headerShown: false }} />
        <Stack.Screen name="account" options={{ headerShown: false }} />
        <Stack.Screen
          name="meter-details"
          options={{ title: t("meterDetails.title") }}
        />
      </Stack>
      {!splashDone && <AnimatedSplash onFinish={() => setSplashDone(true)} />}
    </ThemeProvider>
  );
}
