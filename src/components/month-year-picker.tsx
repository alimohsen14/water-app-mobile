import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { opacity, radius, spacing, useAppTheme } from "@/theme";

type AppColors = ReturnType<typeof useAppTheme>["colors"];

type MonthYearPickerProps = {
  visible: boolean;
  month: number;
  year: number;
  monthLabels: readonly string[];
  isRTL: boolean;
  onClose: () => void;
  onConfirm: (month: number, year: number) => void;
};

export function MonthYearPicker({
  visible,
  month,
  year,
  monthLabels,
  isRTL,
  onClose,
  onConfirm,
}: MonthYearPickerProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {visible ? (
        <PickerBody
          key={`${month}-${year}`}
          month={month}
          year={year}
          monthLabels={monthLabels}
          isRTL={isRTL}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      ) : null}
    </Modal>
  );
}

function PickerBody({
  month,
  year,
  monthLabels,
  isRTL,
  onClose,
  onConfirm,
}: Omit<MonthYearPickerProps, "visible">) {
  const { colors } = useAppTheme();
  const { t } = useTranslation();
  const styles = createStyles(colors);

  const [draftMonth, setDraftMonth] = useState(month);
  const [draftYear, setDraftYear] = useState(year);

  const prevIcon = isRTL ? "chevron-forward" : "chevron-back";
  const nextIcon = isRTL ? "chevron-back" : "chevron-forward";

  return (
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable
        style={[styles.sheet, { direction: isRTL ? "rtl" : "ltr" }]}
        onPress={() => {}}
      >
        <ThemedText variant="headline" style={styles.title}>
          {t("consumption.selectMonth")}
        </ThemedText>

        <View style={styles.yearRow}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("consumption.previousYear")}
            hitSlop={spacing.sm}
            onPress={() => setDraftYear((y) => y - 1)}
            style={({ pressed }) => [
              styles.yearButton,
              pressed && { opacity: opacity.pressed },
            ]}
          >
            <Ionicons name={prevIcon} size={22} color={colors.text} />
          </Pressable>
          <ThemedText variant="title" style={styles.yearLabel}>
            {draftYear}
          </ThemedText>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t("consumption.nextYear")}
            hitSlop={spacing.sm}
            onPress={() => setDraftYear((y) => y + 1)}
            style={({ pressed }) => [
              styles.yearButton,
              pressed && { opacity: opacity.pressed },
            ]}
          >
            <Ionicons name={nextIcon} size={22} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.grid}>
          {monthLabels.map((label, index) => {
            const isSelected = index === draftMonth;
            return (
              <Pressable
                key={label}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => setDraftMonth(index)}
                style={({ pressed }) => [
                  styles.monthChip,
                  isSelected && styles.monthChipSelected,
                  pressed && { opacity: opacity.pressed },
                ]}
              >
                <ThemedText
                  variant="subhead"
                  numberOfLines={1}
                  style={[
                    styles.monthChipLabel,
                    isSelected && styles.monthChipLabelSelected,
                  ]}
                >
                  {label}
                </ThemedText>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [
              styles.actionButton,
              pressed && { opacity: opacity.pressed },
            ]}
          >
            <ThemedText variant="headline" style={styles.cancelLabel}>
              {t("consumption.cancel")}
            </ThemedText>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            onPress={() => onConfirm(draftMonth, draftYear)}
            style={({ pressed }) => [
              styles.actionButton,
              styles.confirmButton,
              pressed && { opacity: opacity.pressed },
            ]}
          >
            <ThemedText variant="headline" style={styles.confirmLabel}>
              {t("consumption.done")}
            </ThemedText>
          </Pressable>
        </View>
      </Pressable>
    </Pressable>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.4)",
      alignItems: "center",
      justifyContent: "center",
      padding: spacing.lg,
    },
    sheet: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      gap: spacing.lg,
    },
    title: {
      textAlign: "center",
    },
    yearRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    yearButton: {
      width: 40,
      height: 40,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    yearLabel: {
      flex: 1,
      textAlign: "center",
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    monthChip: {
      width: "31%",
      flexGrow: 1,
      paddingVertical: spacing.sm,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    monthChipSelected: {
      backgroundColor: colors.brand,
    },
    monthChipLabel: {
      color: colors.text,
      fontWeight: "600",
    },
    monthChipLabelSelected: {
      color: colors.onBrand,
    },
    actions: {
      flexDirection: "row",
      gap: spacing.md,
    },
    actionButton: {
      flex: 1,
      paddingVertical: spacing.md,
      borderRadius: radius.md,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.background,
    },
    confirmButton: {
      backgroundColor: colors.brand,
    },
    cancelLabel: {
      color: colors.text,
    },
    confirmLabel: {
      color: colors.onBrand,
    },
  });
}
