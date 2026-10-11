import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { radius, spacing, useAppTheme } from "@/theme";

type AppColors = ReturnType<typeof useAppTheme>["colors"];

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

export default function MeterDetailsScreen() {
  const { t, i18n } = useTranslation();
  const { colors, scheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const isRTL = i18n.dir() === "rtl";
  const rowDirection = isRTL ? "row-reverse" : "row";
  const align = isRTL ? "right" : "left";

  const detailRows = [
    {
      key: "lastUpdate",
      label: t("meterDetails.lastUpdate.label"),
      value: t("meterDetails.lastUpdate.value"),
      valueColor: colors.secondaryText,
      icon: (
        <Ionicons name="time-outline" size={20} color={colors.secondaryText} />
      ),
    },
    {
      key: "battery",
      label: t("meterDetails.battery.label"),
      value: t("meterDetails.battery.value"),
      valueColor: colors.success,
      icon: (
        <MaterialCommunityIcons
          name="battery-charging-high"
          size={22}
          color={colors.success}
        />
      ),
    },
    {
      key: "valve",
      label: t("meterDetails.valve.label"),
      value: t("meterDetails.valve.open"),
      valueColor: colors.success,
      icon: (
        <MaterialCommunityIcons
          name="pipe-valve"
          size={22}
          color={colors.success}
        />
      ),
    },
  ] as const;

  return (
    <View style={[styles.root, { direction: isRTL ? "rtl" : "ltr" }]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + spacing.lg },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            styles.meterCard,
            { direction: "ltr", flexDirection: rowDirection },
          ]}
        >
          <View style={styles.meterText}>
            <ThemedText
              variant="subhead"
              style={[styles.meterLabel, { textAlign: align }]}
            >
              {t("meterDetails.meterNumberLabel")}
            </ThemedText>
            <ThemedText
              variant="title"
              style={[
                styles.meterValue,
                { color: colors.brand, textAlign: align },
              ]}
            >
              {`\u2066${t("meterDetails.meterNumberValue")}\u2069`}
            </ThemedText>
          </View>
          <View
            style={[
              styles.meterBadge,
              { backgroundColor: withAlpha(colors.brand, 0.12) },
            ]}
          >
            <MaterialCommunityIcons
              name="gauge"
              size={30}
              color={colors.brand}
            />
          </View>
        </View>

        <View style={styles.card}>
          {detailRows.map((row, index) => (
            <View
              key={row.key}
              style={[
                styles.row,
                { direction: "ltr", flexDirection: rowDirection },
                index < detailRows.length - 1 && styles.rowSeparator,
              ]}
            >
              <ThemedText
                variant="body"
                style={[styles.rowLabel, { textAlign: align }]}
              >
                {row.label}
              </ThemedText>
              <View style={styles.valueGroup}>
                {row.icon}
                <ThemedText
                  variant="headline"
                  style={{ color: row.valueColor }}
                >
                  {row.value}
                </ThemedText>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
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
      padding: spacing.md,
      gap: spacing.md,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      overflow: "hidden",
    },
    meterCard: {
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      padding: spacing.md,
    },
    meterText: {
      flex: 1,
      gap: spacing.xs,
    },
    meterLabel: {
      color: colors.secondaryText,
    },
    meterValue: {
      letterSpacing: 1,
    },
    meterBadge: {
      width: 56,
      height: 56,
      borderRadius: 28,
      alignItems: "center",
      justifyContent: "center",
    },
    row: {
      alignItems: "center",
      justifyContent: "space-between",
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
    valueGroup: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
  });
}
