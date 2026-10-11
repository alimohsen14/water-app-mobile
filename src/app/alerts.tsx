import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemedText } from "@/components/themed-text";
import type { TxKey } from "@/localization/i18n";
import { radius, spacing, useAppTheme } from "@/theme";

type AppColors = ReturnType<typeof useAppTheme>["colors"];

type AlertTone = "danger" | "warning" | "info" | "success";

type AlertItem = {
  key: string;
  tone: AlertTone;
  icon: keyof typeof Ionicons.glyphMap;
  titleKey: TxKey;
  bodyKey: TxKey;
  timeKey: TxKey;
};

const ALERTS: readonly AlertItem[] = [
  {
    key: "unusualConsumption",
    tone: "danger",
    icon: "water",
    titleKey: "alerts.items.unusualConsumption.title",
    bodyKey: "alerts.items.unusualConsumption.body",
    timeKey: "alerts.items.unusualConsumption.time",
  },
  {
    key: "lowBattery",
    tone: "warning",
    icon: "battery-half",
    titleKey: "alerts.items.lowBattery.title",
    bodyKey: "alerts.items.lowBattery.body",
    timeKey: "alerts.items.lowBattery.time",
  },
  {
    key: "valveIssue",
    tone: "info",
    icon: "information",
    titleKey: "alerts.items.valveIssue.title",
    bodyKey: "alerts.items.valveIssue.body",
    timeKey: "alerts.items.valveIssue.time",
  },
  {
    key: "meterReconnected",
    tone: "success",
    icon: "checkmark",
    titleKey: "alerts.items.meterReconnected.title",
    bodyKey: "alerts.items.meterReconnected.body",
    timeKey: "alerts.items.meterReconnected.time",
  },
];

function toneColor(colors: AppColors, tone: AlertTone): string {
  switch (tone) {
    case "danger":
      return colors.dangerAccent;
    case "warning":
      return colors.warning;
    case "info":
      return colors.tint;
    case "success":
      return colors.success;
  }
}

export default function AlertsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, scheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const isRTL = i18n.dir() === "rtl";

  return (
    <View style={[styles.root, { direction: isRTL ? "rtl" : "ltr" }]}>
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
          {t("alerts.title")}
        </ThemedText>

        {ALERTS.map((item) => (
          <AlertCard
            key={item.key}
            colors={colors}
            isRTL={isRTL}
            accent={toneColor(colors, item.tone)}
            icon={item.icon}
            title={t(item.titleKey)}
            body={t(item.bodyKey)}
            time={t(item.timeKey)}
          />
        ))}
      </ScrollView>

      <BottomNavigation active="alerts" />
    </View>
  );
}

function AlertCard({
  colors,
  isRTL,
  accent,
  icon,
  title,
  body,
  time,
}: {
  colors: AppColors;
  isRTL: boolean;
  accent: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
  time: string;
}) {
  const styles = createStyles(colors);
  const align = isRTL ? "right" : "left";
  const writingDirection = isRTL ? "rtl" : "ltr";
  const rowDirection = isRTL ? "row-reverse" : "row";

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: withAlpha(accent, 0.1),
          direction: "ltr",
          flexDirection: rowDirection,
        },
      ]}
    >
      <View style={styles.cardText}>
        <View style={[styles.titleRow, { flexDirection: rowDirection }]}>
          <View style={[styles.dot, { backgroundColor: accent }]} />
          <ThemedText
            variant="headline"
            numberOfLines={2}
            style={[styles.title, { color: accent, textAlign: align }]}
          >
            {title}
          </ThemedText>
        </View>

        <ThemedText
          variant="subhead"
          style={[styles.body, { textAlign: align }]}
        >
          {body}
        </ThemedText>

        <View style={[styles.timeRow, { flexDirection: rowDirection }]}>
          <Ionicons
            name="time-outline"
            size={15}
            color={colors.secondaryText}
          />
          <ThemedText
            variant="caption"
            numberOfLines={1}
            style={[styles.time, { writingDirection, textAlign: align }]}
          >
            {time}
          </ThemedText>
        </View>
      </View>

      <View style={[styles.iconBadge, { backgroundColor: accent }]}>
        <Ionicons name={icon} size={24} color={colors.onBrand} />
      </View>
    </View>
  );
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

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
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
    card: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      padding: spacing.md,
      borderRadius: radius.lg,
    },
    cardText: {
      flex: 1,
      gap: spacing.xs,
    },
    titleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    dot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
    title: {
      flex: 1,
    },
    body: {
      color: colors.text,
    },
    timeRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      marginTop: spacing.xs,
    },
    time: {
      color: colors.secondaryText,
    },
    iconBadge: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
    },
  });
}
