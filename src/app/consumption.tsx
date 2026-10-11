import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { BarChart, type BarDatum } from "@/components/bar-chart";
import { BottomNavigation } from "@/components/bottom-navigation";
import { MonthYearPicker } from "@/components/month-year-picker";
import { ThemedText } from "@/components/themed-text";
import type { TxKey } from "@/localization/i18n";
import { opacity, radius, spacing, useAppTheme } from "@/theme";
import { formatFullDate, formatMonthYear } from "@/utils/format-date";

type AppColors = ReturnType<typeof useAppTheme>["colors"];

type RangeKey = "daily" | "monthly";

type MockDatum = {
  key: string;
  labelKey: TxKey;
  value: number;
};

const MONTHLY_DATA: readonly MockDatum[] = [
  { key: "jan", labelKey: "consumption.months.jan", value: 14 },
  { key: "feb", labelKey: "consumption.months.feb", value: 8.2 },
  { key: "mar", labelKey: "consumption.months.mar", value: 18 },
  { key: "apr", labelKey: "consumption.months.apr", value: 14 },
  { key: "may", labelKey: "consumption.months.may", value: 24.5 },
  { key: "jun", labelKey: "consumption.months.jun", value: 17 },
  { key: "jul", labelKey: "consumption.months.jul", value: 17 },
  { key: "aug", labelKey: "consumption.months.aug", value: 21 },
  { key: "sep", labelKey: "consumption.months.sep", value: 19.5 },
  { key: "oct", labelKey: "consumption.months.oct", value: 15 },
  { key: "nov", labelKey: "consumption.months.nov", value: 12.5 },
  { key: "dec", labelKey: "consumption.months.dec", value: 16 },
];

const MONTH_KEYS: readonly TxKey[] = [
  "consumption.months.jan",
  "consumption.months.feb",
  "consumption.months.mar",
  "consumption.months.apr",
  "consumption.months.may",
  "consumption.months.jun",
  "consumption.months.jul",
  "consumption.months.aug",
  "consumption.months.sep",
  "consumption.months.oct",
  "consumption.months.nov",
  "consumption.months.dec",
];

const DAILY_RECORD_YEAR = 2024;
const DAILY_RECORD_COUNT = 12;

type DailyRecord = {
  day: number;
  value: number;
};

/** Deterministic mock daily readings for a month, ordered newest → oldest. */
function buildDailyRecords(monthIndex: number, year: number): DailyRecord[] {
  return Array.from({ length: DAILY_RECORD_COUNT }, (_, i) => {
    const day = DAILY_RECORD_COUNT + 9 - i;
    const seed = (monthIndex + 1) * 7 + day * 13 + year;
    const value = 0.3 + (seed % 60) / 100;
    return { day, value: Math.round(value * 1000) / 1000 };
  });
}

const RANGES: { key: RangeKey; labelKey: TxKey }[] = [
  { key: "monthly", labelKey: "consumption.tabs.monthly" },
  { key: "daily", labelKey: "consumption.tabs.daily" },
];

export default function ConsumptionScreen() {
  const { t, i18n } = useTranslation();
  const { colors, scheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const isRTL = i18n.dir() === "rtl";

  const [range, setRange] = useState<RangeKey>("monthly");

  const peakMonthIndex = useMemo(() => {
    let best = 0;
    MONTHLY_DATA.forEach((d, i) => {
      if (d.value > MONTHLY_DATA[best].value) {
        best = i;
      }
    });
    return best;
  }, []);

  const [selected, setSelected] = useState({
    month: peakMonthIndex,
    year: DAILY_RECORD_YEAR,
  });
  const [pickerVisible, setPickerVisible] = useState(false);

  const monthLabels = useMemo(() => MONTH_KEYS.map((key) => t(key)), [t]);

  const chartData: BarDatum[] = useMemo(
    () =>
      MONTHLY_DATA.map((d) => ({
        key: d.key,
        label: t(d.labelKey),
        value: d.value,
      })),
    [t],
  );

  const monthlyStats = useMemo(() => {
    const highest = MONTHLY_DATA.reduce((best, d) =>
      d.value > best.value ? d : best,
    );
    const lowest = MONTHLY_DATA.reduce((best, d) =>
      d.value < best.value ? d : best,
    );
    const average =
      MONTHLY_DATA.reduce((sum, d) => sum + d.value, 0) / MONTHLY_DATA.length;
    return { highest, lowest, average };
  }, []);

  const dailyRecords = useMemo(
    () => buildDailyRecords(selected.month, selected.year),
    [selected.month, selected.year],
  );

  const dailyAverage = useMemo(
    () =>
      dailyRecords.reduce((sum, r) => sum + r.value, 0) / dailyRecords.length,
    [dailyRecords],
  );

  const unit = t("consumption.cubicMeter");
  const selectedMonthLabel = formatMonthYear(
    i18n.language,
    selected.year,
    selected.month,
  );

  function shiftMonth(delta: number) {
    setSelected((prev) => {
      const total = prev.year * 12 + prev.month + delta;
      return { month: ((total % 12) + 12) % 12, year: Math.floor(total / 12) };
    });
  }

  function openDailyForMonth(monthIndex: number) {
    setSelected((prev) => ({ ...prev, month: monthIndex }));
    setRange("daily");
  }

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
        <View style={styles.tabs} accessibilityRole="tablist">
          {RANGES.map((item) => {
            const isActive = item.key === range;
            return (
              <Pressable
                key={item.key}
                accessibilityRole="tab"
                accessibilityState={{ selected: isActive }}
                onPress={() => setRange(item.key)}
                style={({ pressed }) => [
                  styles.tab,
                  isActive && styles.tabActive,
                  pressed && { opacity: opacity.pressed },
                ]}
              >
                <ThemedText
                  variant="subhead"
                  style={[styles.tabLabel, isActive && styles.tabLabelActive]}
                >
                  {t(item.labelKey)}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        {range === "monthly" ? (
          <>
            <View style={[styles.card, styles.chartCard]}>
              <ThemedText variant="caption" style={styles.unitLabel}>
                {unit}
              </ThemedText>
              <BarChart
                data={chartData}
                unit={unit}
                isRTL={isRTL}
                onBarPress={(datum, index) => openDailyForMonth(index)}
              />
            </View>

            <View style={styles.statsRow}>
              <StatCard
                colors={colors}
                label={t("consumption.lowest")}
                value={monthlyStats.lowest.value}
                unit={unit}
                caption={t(monthlyStats.lowest.labelKey)}
                icon="trending-up"
                iconColor={colors.success}
              />
              <StatCard
                colors={colors}
                label={t("consumption.highest")}
                value={monthlyStats.highest.value}
                unit={unit}
                caption={t(monthlyStats.highest.labelKey)}
                icon="water"
                iconColor={colors.dangerAccent}
              />
            </View>

            <View style={[styles.card, styles.wideCard]}>
              <View style={styles.wideIcon}>
                <Ionicons name="stats-chart" size={26} color={colors.brand} />
              </View>
              <View style={styles.wideText}>
                <ThemedText variant="subhead" style={styles.statLabel}>
                  {t("consumption.averageMonthly")}
                </ThemedText>
                <ValueWithUnit
                  value={formatValue(monthlyStats.average)}
                  unit={unit}
                  colors={colors}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <View style={[styles.card, styles.monthSelector]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("consumption.openMonthPicker")}
                hitSlop={spacing.sm}
                onPress={() => setPickerVisible(true)}
                style={({ pressed }) => [
                  styles.monthSelectorIcon,
                  pressed && { opacity: opacity.pressed },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={22}
                  color={colors.brand}
                />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("consumption.previousMonth")}
                hitSlop={spacing.sm}
                onPress={() => shiftMonth(-1)}
                style={({ pressed }) => [
                  styles.monthArrow,
                  pressed && { opacity: opacity.pressed },
                ]}
              >
                <Ionicons
                  name={isRTL ? "chevron-forward" : "chevron-back"}
                  size={20}
                  color={colors.secondaryText}
                />
              </Pressable>
              <ThemedText
                variant="headline"
                numberOfLines={1}
                // Single Text node with an explicit base direction so the
                // engine runs the bidi algorithm once over the whole string,
                // preventing mixed digit/month garbling.
                style={[
                  styles.monthSelectorLabel,
                  { writingDirection: isRTL ? "rtl" : "ltr" },
                ]}
              >
                {selectedMonthLabel}
              </ThemedText>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t("consumption.nextMonth")}
                hitSlop={spacing.sm}
                onPress={() => shiftMonth(1)}
                style={({ pressed }) => [
                  styles.monthArrow,
                  pressed && { opacity: opacity.pressed },
                ]}
              >
                <Ionicons
                  name={isRTL ? "chevron-back" : "chevron-forward"}
                  size={20}
                  color={colors.secondaryText}
                />
              </Pressable>
            </View>

            <View style={[styles.card, styles.recordsCard]}>
              {dailyRecords.map((record, index) => {
                const previous = dailyRecords[index + 1];
                const isUp = !previous || record.value >= previous.value;
                return (
                  <DailyRow
                    key={record.day}
                    colors={colors}
                    isRTL={isRTL}
                    showSeparator={index < dailyRecords.length - 1}
                    date={formatFullDate(
                      i18n.language,
                      selected.year,
                      selected.month,
                      record.day,
                    )}
                    value={record.value.toFixed(3)}
                    unit={unit}
                    isUp={isUp}
                  />
                );
              })}
            </View>

            <View style={[styles.card, styles.wideCard]}>
              <View style={styles.wideIcon}>
                <Ionicons name="stats-chart" size={26} color={colors.brand} />
              </View>
              <View style={styles.wideText}>
                <ThemedText variant="subhead" style={styles.statLabel}>
                  {t("consumption.averageDaily")}
                </ThemedText>
                <ValueWithUnit
                  value={dailyAverage.toFixed(3)}
                  unit={unit}
                  colors={colors}
                />
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <BottomNavigation active="consumption" />

      <MonthYearPicker
        visible={pickerVisible}
        month={selected.month}
        year={selected.year}
        monthLabels={monthLabels}
        isRTL={isRTL}
        onClose={() => setPickerVisible(false)}
        onConfirm={(month, year) => {
          setSelected({ month, year });
          setPickerVisible(false);
        }}
      />
    </View>
  );
}

function DailyRow({
  colors,
  isRTL,
  showSeparator,
  date,
  value,
  unit,
  isUp,
}: {
  colors: AppColors;
  isRTL: boolean;
  showSeparator: boolean;
  date: string;
  value: string;
  unit: string;
  isUp: boolean;
}) {
  const styles = createStyles(colors);
  const trendColor = isUp ? colors.success : colors.dangerAccent;
  return (
    <View style={[styles.recordRow, showSeparator && styles.recordSeparator]}>
      <ThemedText
        variant="subhead"
        numberOfLines={1}
        // Single Text node with an explicit base direction so the day, full
        // month name and year are bidi-ordered as one run (no garbling).
        style={[styles.recordDate, { writingDirection: isRTL ? "rtl" : "ltr" }]}
      >
        {date}
      </ThemedText>
      <View style={styles.recordRight}>
        <ValueWithUnit value={value} unit={unit} colors={colors} />
        <View
          style={[
            styles.trendBadge,
            { backgroundColor: withAlpha(trendColor, 0.12) },
          ]}
        >
          <Ionicons
            name={isUp ? "trending-up" : "trending-down"}
            size={18}
            color={trendColor}
          />
        </View>
      </View>
    </View>
  );
}

function StatCard({
  colors,
  label,
  value,
  unit,
  caption,
  icon,
  iconColor,
}: {
  colors: AppColors;
  label: string;
  value: number;
  unit: string;
  caption: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
}) {
  const styles = createStyles(colors);
  return (
    <View style={[styles.card, styles.statCard]}>
      <View style={styles.statHeader}>
        <View
          style={[
            styles.statBadge,
            { backgroundColor: withAlpha(iconColor, 0.12) },
          ]}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <ThemedText variant="subhead" style={styles.statLabel}>
          {label}
        </ThemedText>
      </View>
      <ValueWithUnit value={formatValue(value)} unit={unit} colors={colors} />
      <ThemedText variant="caption">{caption}</ThemedText>
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
    fontSize: 22,
    fontWeight: "700",
  },
});

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
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
    monthSelector: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    monthSelectorIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      backgroundColor: withAlpha(colors.brand, 0.12),
      alignItems: "center",
      justifyContent: "center",
    },
    monthSelectorLabel: {
      flex: 1,
      textAlign: "center",
    },
    monthArrow: {
      width: 32,
      height: 32,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    recordsCard: {
      padding: 0,
      overflow: "hidden",
    },
    recordRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    recordSeparator: {
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: colors.separator,
    },
    recordDate: {
      flex: 1,
      color: colors.secondaryText,
    },
    recordRight: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    trendBadge: {
      width: 36,
      height: 36,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    tabs: {
      flexDirection: "row",
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.xs,
      gap: spacing.xs,
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: spacing.sm,
      borderRadius: radius.lg,
    },
    tabActive: {
      backgroundColor: colors.brand,
    },
    tabLabel: {
      color: colors.secondaryText,
      fontWeight: "600",
    },
    tabLabelActive: {
      color: colors.onBrand,
    },
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.md,
    },
    chartCard: {
      gap: spacing.sm,
    },
    unitLabel: {
      color: colors.secondaryText,
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.md,
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
    statBadge: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
    },
    statLabel: {
      flexShrink: 1,
    },
    wideCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    wideIcon: {
      width: 48,
      height: 48,
      borderRadius: radius.md,
      backgroundColor: withAlpha(colors.brand, 0.12),
      alignItems: "center",
      justifyContent: "center",
    },
    wideText: {
      flex: 1,
      gap: spacing.xs,
    },
  });
}
