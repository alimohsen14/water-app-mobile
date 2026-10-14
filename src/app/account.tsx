import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Switch, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemedText } from "@/components/themed-text";
import type { TxKey } from "@/localization/i18n";
import { useAuthStore } from "@/stores/auth-store";
import { type LocaleMode, useLocaleStore } from "@/stores/locale-store";
import { useNotificationsStore } from "@/stores/notifications-store";
import { type ThemeMode, useThemeStore } from "@/stores/theme-store";
import { opacity, radius, spacing, useAppTheme } from "@/theme";

type AppColors = ReturnType<typeof useAppTheme>["colors"];
type RowDirection = "row" | "row-reverse";
type Align = "left" | "right";

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

export default function AccountScreen() {
  const { t, i18n } = useTranslation();
  const { colors, scheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const isRTL = i18n.dir() === "rtl";
  const rowDirection: RowDirection = isRTL ? "row-reverse" : "row";
  const align: Align = isRTL ? "right" : "left";

  const localeMode = useLocaleStore((state) => state.mode);
  const setLocaleMode = useLocaleStore((state) => state.setMode);
  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);
  const notificationsEnabled = useNotificationsStore((state) => state.enabled);
  const setNotificationsEnabled = useNotificationsStore(
    (state) => state.setEnabled,
  );
  const logout = useAuthStore((state) => state.logout);

  const [openSection, setOpenSection] = useState<
    "language" | "appearance" | null
  >(null);

  const languageValue = t(
    LANGUAGE_OPTIONS.find((option) => option.mode === localeMode)!.labelKey,
  );
  const appearanceValue = t(
    APPEARANCE_OPTIONS.find((option) => option.mode === themeMode)!.labelKey,
  );

  function toggleSection(section: "language" | "appearance") {
    setOpenSection((current) => (current === section ? null : section));
  }

  return (
    <View style={styles.root}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + spacing.md },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="title" style={styles.header}>
          {t("account.title")}
        </ThemedText>

        <View style={[styles.meterCard, { flexDirection: rowDirection }]}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color={colors.tint} />
          </View>
          <View style={styles.meterText}>
            <ThemedText
              variant="subhead"
              style={[styles.meterLabel, { textAlign: align }]}
            >
              {t("account.meterNumberLabel")}
            </ThemedText>
            <ThemedText
              variant="headline"
              numberOfLines={1}
              style={[styles.meterValue, { textAlign: align }]}
            >
              {"\u2066" + t("account.meterNumberValue") + "\u2069"}
            </ThemedText>
          </View>
        </View>

        <View style={styles.card}>
          <View
            style={[
              styles.row,
              styles.rowSeparator,
              { flexDirection: rowDirection },
            ]}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            <ThemedText style={[styles.rowLabel, { textAlign: align }]}>
              {t("account.notifications")}
            </ThemedText>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ true: colors.tint }}
              accessibilityLabel={t("account.notifications")}
            />
          </View>

          <CollapsibleSection
            colors={colors}
            rowDirection={rowDirection}
            align={align}
            icon="language-outline"
            label={t("settings.language.label")}
            value={languageValue}
            expanded={openSection === "language"}
            onToggle={() => toggleSection("language")}
            showSeparator
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <OptionRow
                key={option.mode}
                colors={colors}
                rowDirection={rowDirection}
                align={align}
                label={t(option.labelKey)}
                selected={localeMode === option.mode}
                onPress={() => setLocaleMode(option.mode)}
              />
            ))}
          </CollapsibleSection>

          <CollapsibleSection
            colors={colors}
            rowDirection={rowDirection}
            align={align}
            icon="color-palette-outline"
            label={t("settings.appearance.label")}
            value={appearanceValue}
            expanded={openSection === "appearance"}
            onToggle={() => toggleSection("appearance")}
          >
            {APPEARANCE_OPTIONS.map((option) => (
              <OptionRow
                key={option.mode}
                colors={colors}
                rowDirection={rowDirection}
                align={align}
                label={t(option.labelKey)}
                selected={themeMode === option.mode}
                onPress={() => setThemeMode(option.mode)}
              />
            ))}
          </CollapsibleSection>
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("account.logout")}
          onPress={() => {
            logout();
            router.replace("/login");
          }}
          style={({ pressed }) => [
            styles.card,
            styles.row,
            { flexDirection: rowDirection },
            pressed && { opacity: opacity.pressed },
          ]}
        >
          <Ionicons
            name="log-out-outline"
            size={24}
            color={colors.danger}
            style={isRTL ? styles.iconFlipped : undefined}
          />
          <ThemedText
            style={[
              styles.logoutLabel,
              { color: colors.danger, textAlign: align },
            ]}
          >
            {t("account.logout")}
          </ThemedText>
        </Pressable>
      </ScrollView>

      <BottomNavigation active="account" />
    </View>
  );
}

function CollapsibleSection({
  colors,
  rowDirection,
  align,
  icon,
  label,
  value,
  expanded,
  onToggle,
  showSeparator,
  children,
}: {
  colors: AppColors;
  rowDirection: RowDirection;
  align: Align;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  expanded: boolean;
  onToggle: () => void;
  showSeparator?: boolean;
  children: React.ReactNode;
}) {
  const styles = createStyles(colors);
  return (
    <View style={showSeparator ? styles.rowSeparator : undefined}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={onToggle}
        style={({ pressed }) => [
          styles.row,
          { flexDirection: rowDirection },
          pressed && { opacity: opacity.pressed },
        ]}
      >
        <Ionicons name={icon} size={24} color={colors.text} />
        <ThemedText style={[styles.rowLabel, { textAlign: align }]}>
          {label}
        </ThemedText>
        {!expanded ? (
          <ThemedText variant="subhead" style={styles.rowValue}>
            {value}
          </ThemedText>
        ) : null}
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.secondaryText}
        />
      </Pressable>
      {expanded ? <View style={styles.options}>{children}</View> : null}
    </View>
  );
}

function OptionRow({
  colors,
  rowDirection,
  align,
  label,
  selected,
  onPress,
}: {
  colors: AppColors;
  rowDirection: RowDirection;
  align: Align;
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  const styles = createStyles(colors);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.optionRow,
        { flexDirection: rowDirection },
        selected && styles.optionRowSelected,
        pressed && { opacity: opacity.pressed },
      ]}
    >
      <ThemedText style={[styles.optionLabel, { textAlign: align }]}>
        {label}
      </ThemedText>
      {selected ? (
        <Ionicons name="checkmark" size={20} color={colors.tint} />
      ) : null}
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
      direction: "ltr",
    },
    scroll: {
      flex: 1,
    },
    content: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xl,
      gap: spacing.md,
    },
    header: {
      textAlign: "center",
      marginBottom: spacing.xs,
    },
    meterCard: {
      alignItems: "center",
      gap: spacing.md,
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: withAlpha(colors.tint, 0.12),
      alignItems: "center",
      justifyContent: "center",
    },
    meterText: {
      flex: 1,
      gap: spacing.xs,
    },
    meterLabel: {
      color: colors.secondaryText,
    },
    meterValue: {
      color: colors.text,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: "hidden",
    },
    row: {
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    rowSeparator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.separator,
    },
    rowLabel: {
      flex: 1,
    },
    rowValue: {
      color: colors.secondaryText,
    },
    options: {
      paddingBottom: spacing.sm,
    },
    optionRow: {
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      marginHorizontal: spacing.md,
      marginBottom: spacing.xs,
      borderRadius: radius.sm,
    },
    optionRowSelected: {
      backgroundColor: withAlpha(colors.tint, 0.1),
    },
    optionLabel: {
      flex: 1,
    },
    logoutLabel: {
      flex: 1,
      fontWeight: "600",
    },
    iconFlipped: {
      transform: [{ scaleX: -1 }],
    },
  });
}

function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  if (normalized.length !== 6) {
    return hex;
  }
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
