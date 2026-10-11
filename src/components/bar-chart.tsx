import { useCallback, useMemo, useRef } from "react";
import {
  type LayoutChangeEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { ThemedText } from "@/components/themed-text";
import { opacity, radius, spacing, useAppTheme } from "@/theme";

type AppColors = ReturnType<typeof useAppTheme>["colors"];

export type BarDatum = {
  key: string;
  label: string;
  value: number;
};

type BarChartProps = {
  data: readonly BarDatum[];
  unit: string;
  isRTL: boolean;
  /** Index of the bar to emphasize with a tooltip. Defaults to the max value. */
  highlightIndex?: number;
  onBarPress?: (datum: BarDatum, index: number) => void;
};

const CHART_HEIGHT = 180;
const GRID_LINES = 4;
const Y_AXIS_WIDTH = 28;
const SLOT_WIDTH = 46;

export function BarChart({
  data,
  unit,
  isRTL,
  highlightIndex,
  onBarPress,
}: BarChartProps) {
  const { colors } = useAppTheme();
  const styles = createStyles(colors);
  const scrollRef = useRef<ScrollView>(null);
  const viewportWidth = useRef(0);

  const { scaleMax, ticks, peakIndex } = useMemo(() => {
    const max = data.reduce((acc, d) => Math.max(acc, d.value), 0);
    const niceMax = niceCeil(max);
    const step = niceMax / GRID_LINES;
    const tickValues = Array.from({ length: GRID_LINES + 1 }, (_, i) =>
      Math.round(step * i),
    ).reverse();
    const peak = data.reduce(
      (best, d, i) => (d.value > data[best].value ? i : best),
      0,
    );
    return { scaleMax: niceMax, ticks: tickValues, peakIndex: peak };
  }, [data]);

  const emphasized = highlightIndex ?? peakIndex;
  const emphasizedKey = data[emphasized]?.key;

  // Bars are laid out start-to-end; RTL direction reverses visual order.
  const orderedData = isRTL ? [...data].reverse() : data;
  const contentWidth = orderedData.length * SLOT_WIDTH;

  const onViewportLayout = useCallback((event: LayoutChangeEvent) => {
    viewportWidth.current = event.nativeEvent.layout.width;
  }, []);

  // In RTL the timeline starts at the right edge, so reveal it on mount.
  const onContentSizeChange = useCallback(
    (width: number) => {
      if (isRTL && width > viewportWidth.current) {
        scrollRef.current?.scrollTo({ x: width, animated: false });
      }
    },
    [isRTL],
  );

  return (
    <View style={styles.wrapper}>
      <View style={styles.plotRow}>
        <View style={styles.yAxis}>
          {ticks.map((tick) => (
            <ThemedText key={tick} variant="caption" style={styles.yTick}>
              {tick}
            </ThemedText>
          ))}
        </View>

        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          onLayout={onViewportLayout}
          onContentSizeChange={onContentSizeChange}
          contentContainerStyle={[
            styles.scrollContent,
            { justifyContent: isRTL ? "flex-end" : "flex-start" },
          ]}
        >
          <View style={{ width: contentWidth }}>
            <View style={styles.plot}>
              <View style={styles.grid} pointerEvents="none">
                {ticks.map((tick) => (
                  <View key={tick} style={styles.gridLine} />
                ))}
              </View>

              <View style={styles.bars}>
                {orderedData.map((datum) => {
                  const isPeak = datum.key === emphasizedKey;
                  const barHeight = Math.max(
                    (datum.value / scaleMax) * CHART_HEIGHT,
                    2,
                  );
                  const originalIndex = data.findIndex(
                    (d) => d.key === datum.key,
                  );
                  return (
                    <Pressable
                      key={datum.key}
                      style={({ pressed }) => [
                        styles.barSlot,
                        pressed && onBarPress
                          ? { opacity: opacity.pressed }
                          : null,
                      ]}
                      disabled={!onBarPress}
                      accessibilityRole={onBarPress ? "button" : undefined}
                      accessibilityLabel={`${datum.label}: ${formatValue(datum.value)} ${unit}`}
                      onPress={() => onBarPress?.(datum, originalIndex)}
                    >
                      {isPeak ? (
                        <View style={styles.tooltipWrap} pointerEvents="none">
                          <View style={styles.tooltip}>
                            <ThemedText
                              variant="caption"
                              numberOfLines={1}
                              style={styles.tooltipText}
                            >
                              {`${formatValue(datum.value)} ${unit}`}
                            </ThemedText>
                          </View>
                        </View>
                      ) : null}
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: isPeak
                              ? colors.brand
                              : withAlpha(colors.tint, 0.55),
                          },
                        ]}
                      />
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.xLabels}>
              {orderedData.map((datum) => (
                <View key={datum.key} style={styles.barSlot}>
                  <ThemedText
                    variant="caption"
                    numberOfLines={1}
                    style={styles.xLabel}
                  >
                    {datum.label}
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function niceCeil(value: number): number {
  if (value <= 0) {
    return GRID_LINES;
  }
  const step = Math.max(Math.ceil(value / GRID_LINES), 1);
  const rounded = Math.ceil(step / 5) * 5 || step;
  return rounded * GRID_LINES;
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
    wrapper: {
      gap: spacing.xs,
    },
    plotRow: {
      flexDirection: "row",
    },
    yAxis: {
      width: Y_AXIS_WIDTH,
      height: CHART_HEIGHT,
      justifyContent: "space-between",
      alignItems: "flex-end",
      paddingEnd: spacing.xs,
    },
    yTick: {
      fontSize: 11,
      lineHeight: 12,
    },
    scrollContent: {
      flexGrow: 1,
      flexDirection: "row",
    },
    plot: {
      height: CHART_HEIGHT,
    },
    grid: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "space-between",
    },
    gridLine: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.separator,
    },
    bars: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: "row",
      alignItems: "flex-end",
    },
    barSlot: {
      width: SLOT_WIDTH,
      alignItems: "center",
      justifyContent: "flex-end",
    },
    bar: {
      width: 22,
      borderTopLeftRadius: radius.sm,
      borderTopRightRadius: radius.sm,
    },
    tooltipWrap: {
      position: "absolute",
      top: -32,
      left: -40,
      right: -40,
      alignItems: "center",
      zIndex: 1,
    },
    tooltip: {
      backgroundColor: colors.text,
      borderRadius: radius.sm,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
    },
    tooltipText: {
      color: colors.background,
      fontWeight: "700",
      fontSize: 12,
      lineHeight: 16,
      textAlign: "center",
    },
    xLabels: {
      flexDirection: "row",
      paddingTop: spacing.xs,
    },
    xLabel: {
      fontSize: 11,
      textAlign: "center",
    },
  });
}
