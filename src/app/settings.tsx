import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { TxKey } from "@/localization/i18n";
import { type LocaleMode, useLocaleStore } from "@/stores/locale-store";
import { type ThemeMode, useThemeStore } from "@/stores/theme-store";
import { radius, spacing, useAppTheme } from "@/theme";

const LANGUAGE_OPTIONS: { mode: LocaleMode; labelKey: TxKey }[] = [
  { mode: "system", labelKey: "settings.language.system" },
  { mode: "en", labelKey: "settings.language.english" },
  { mode: "ar", labelKey: "settings.language.arabic" },
];

const APPEARANCE_OPTIONS: { mode: ThemeMode; labelKey: TxKey }[] = [
  { mode: "system", labelKey: "settings.appearance.system" },
  { mode: "light", labelKey: "settings.appearance.light" },
  { mode: "dark", labelKey: "settings.appearance.dark" },
];

type Colors = ReturnType<typeof useAppTheme>["colors"];

export default function SettingsScreen() {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const localeMode = useLocaleStore((state) => state.mode);
  const setLocaleMode = useLocaleStore((state) => state.setMode);
  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <ThemedText variant="subhead" style={styles.sectionTitle}>
          {t("settings.language.label")}
        </ThemedText>
        <View style={styles.card}>
          {LANGUAGE_OPTIONS.map((option, index) => (
            <OptionRow
              key={option.mode}
              colors={colors}
              label={t(option.labelKey)}
              selected={localeMode === option.mode}
              showSeparator={index < LANGUAGE_OPTIONS.length - 1}
              onPress={() => setLocaleMode(option.mode)}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <ThemedText variant="subhead" style={styles.sectionTitle}>
          {t("settings.appearance.label")}
        </ThemedText>
        <View style={styles.card}>
          {APPEARANCE_OPTIONS.map((option, index) => (
            <OptionRow
              key={option.mode}
              colors={colors}
              label={t(option.labelKey)}
              selected={themeMode === option.mode}
              showSeparator={index < APPEARANCE_OPTIONS.length - 1}
              onPress={() => setThemeMode(option.mode)}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

function OptionRow({
  colors,
  label,
  selected,
  showSeparator,
  onPress,
}: {
  colors: Colors;
  label: string;
  selected: boolean;
  showSeparator: boolean;
  onPress: () => void;
}) {
  const styles = createStyles(colors);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        showSeparator && styles.rowSeparator,
        pressed && styles.rowPressed,
      ]}
    >
      <ThemedText>{label}</ThemedText>
      {selected ? <View style={styles.selectedDot} /> : null}
    </Pressable>
  );
}

function createStyles(colors: Colors) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: spacing.md,
    },
    section: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      marginBottom: spacing.sm,
      marginHorizontal: spacing.sm,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    rowSeparator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.separator,
    },
    rowPressed: {
      opacity: 0.6,
    },
    selectedDot: {
      width: spacing.sm,
      height: spacing.sm,
      borderRadius: spacing.sm / 2,
      backgroundColor: colors.tint,
    },
  });
}
