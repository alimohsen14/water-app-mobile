import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BottomNavigation } from "@/components/bottom-navigation";
import { ThemedText } from "@/components/themed-text";
import { opacity, radius, spacing, useAppTheme } from "@/theme";

type AppColors = ReturnType<typeof useAppTheme>["colors"];

function IconBadge({
  name,
  color,
  background,
  size = 22,
}: {
  name: keyof typeof Ionicons.glyphMap;
  color: string;
  background: string;
  size?: number;
}) {
  return (
    <View style={[badgeStyles.badge, { backgroundColor: background }]}>
      <Ionicons name={name} size={size} color={color} />
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function HomeScreen() {
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
        <View
          style={[
            styles.header,
            {
              direction: "ltr",
              flexDirection: isRTL ? "row-reverse" : "row",
            },
          ]}
        >
          <View style={styles.headerText}>
            <ThemedText
              variant="title"
              style={{ textAlign: isRTL ? "right" : "left" }}
            >
              {t("home.greeting")}
            </ThemedText>
            <ThemedText
              variant="subhead"
              style={[
                styles.meterNumber,
                { textAlign: isRTL ? "right" : "left" },
              ]}
            >
              {t("home.meterNumber", { number: "\u206600740038002200\u2069" })}
            </ThemedText>
          </View>
          <View
            style={[
              styles.headerActions,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("tabs.alerts")}
              hitSlop={spacing.sm}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && { opacity: opacity.pressed },
              ]}
            >
              <Ionicons
                name="notifications-outline"
                size={26}
                color={colors.text}
              />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("home.settings")}
              hitSlop={spacing.sm}
              onPress={() => router.push("/settings")}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && { opacity: opacity.pressed },
              ]}
            >
              <Ionicons name="settings-outline" size={26} color={colors.text} />
            </Pressable>
          </View>
        </View>

        <View style={styles.readingCard}>
          <View style={styles.readingTextBlock}>
            <View style={styles.readingLabelRow}>
              <Ionicons name="water" size={16} color={colors.onBrand} />
              <ThemedText variant="subhead" style={styles.readingLabel}>
                {t("home.currentReading")}
              </ThemedText>
            </View>
            <ThemedText variant="largeTitle" style={styles.readingValue}>
              1,245.678
            </ThemedText>
            <View style={styles.readingMetaRow}>
              <Ionicons
                name="time-outline"
                size={14}
                color={colors.onBrand}
                style={styles.readingMetaIcon}
              />
              <ThemedText variant="caption" style={styles.readingMeta}>
                {t("home.lastUpdated", { time: t("home.lastUpdatedValue") })}
              </ThemedText>
            </View>
          </View>
          <View style={styles.readingIcon}>
            <Ionicons name="water" size={36} color={colors.onBrand} />
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.card, styles.statCard]}>
            <View style={styles.statHeader}>
              <ThemedText variant="subhead" style={styles.statLabel}>
                {t("home.yesterdayConsumption")}
              </ThemedText>
              <IconBadge
                name="calendar-outline"
                color={colors.dangerAccent}
                background={withAlpha(colors.dangerAccent, 0.12)}
                size={20}
              />
            </View>
            <ValueWithUnit
              value="0.420"
              unit={t("home.cubicMeter")}
              colors={colors}
            />
          </View>

          <View style={[styles.card, styles.statCard]}>
            <View style={styles.statHeader}>
              <ThemedText variant="subhead" style={styles.statLabel}>
                {t("home.todayConsumption")}
              </ThemedText>
              <IconBadge
                name="calendar-outline"
                color={colors.success}
                background={withAlpha(colors.success, 0.12)}
                size={20}
              />
            </View>
            <ValueWithUnit
              value="0.650"
              unit={t("home.cubicMeter")}
              colors={colors}
            />
          </View>
        </View>

        <View style={[styles.card, styles.wideCard]}>
          <View style={styles.wideText}>
            <ThemedText variant="subhead" style={styles.statLabel}>
              {t("home.averageDailyConsumption")}
            </ThemedText>
            <ValueWithUnit
              value="0.512"
              unit={t("home.cubicMeter")}
              colors={colors}
            />
          </View>
          <IconBadge
            name="stats-chart"
            color={colors.brand}
            background={withAlpha(colors.brand, 0.12)}
          />
        </View>
      </ScrollView>

      <BottomNavigation active="home" />
    </View>
  );
}

function ValueWithUnit({
  value,
  unit,
  colors,
}: {
  value: string;
  unit: string;
  colors: AppColors;
}) {
  return (
    <View style={valueStyles.row}>
      <ThemedText variant="headline" style={valueStyles.value}>
        {value}
      </ThemedText>
      <ThemedText variant="caption" style={{ color: colors.secondaryText }}>
        {unit}
      </ThemedText>
    </View>
  );
}

const valueStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: spacing.xs,
  },
  value: {
    fontSize: 20,
    fontWeight: "700",
  },
});

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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    headerText: {
      flex: 1,
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    meterNumber: {
      color: colors.secondaryText,
    },
    headerActions: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    iconButton: {
      width: 40,
      height: 40,
      alignItems: "center",
      justifyContent: "center",
    },
    readingCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: colors.brand,
      borderRadius: radius.xl,
      padding: spacing.xl,
      gap: spacing.md,
    },
    readingTextBlock: {
      flex: 1,
      gap: spacing.sm,
    },
    readingLabelRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    readingLabel: {
      color: colors.onBrand,
      fontSize: 17,
    },
    readingValue: {
      color: colors.onBrand,
      fontSize: 44,
      lineHeight: 52,
      fontWeight: "800",
    },
    readingMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    readingMetaIcon: {
      opacity: 0.9,
    },
    readingMeta: {
      color: colors.onBrand,
      opacity: 0.9,
    },
    readingIcon: {
      width: 72,
      height: 72,
      borderRadius: radius.lg,
      backgroundColor: "rgba(255, 255, 255, 0.18)",
      alignItems: "center",
      justifyContent: "center",
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    statCard: {
      flex: 1,
      gap: spacing.sm,
    },
    statHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    statLabel: {
      flexShrink: 1,
    },
    wideCard: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    wideText: {
      flex: 1,
      gap: spacing.xs,
    },
  });
}
