import { Ionicons } from "@expo/vector-icons";
import { type Href, router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import type { TxKey } from "@/localization/i18n";
import { opacity, spacing, useAppTheme } from "@/theme";

export type TabKey = "home" | "consumption" | "alerts" | "account";

type TabItem = {
  key: TabKey;
  labelKey: TxKey;
  icon: keyof typeof Ionicons.glyphMap;
  activeIcon: keyof typeof Ionicons.glyphMap;
  route?: Href;
};

const TABS: readonly TabItem[] = [
  {
    key: "home",
    labelKey: "tabs.home",
    icon: "home-outline",
    activeIcon: "home",
    route: "/",
  },
  {
    key: "consumption",
    labelKey: "tabs.consumption",
    icon: "bar-chart-outline",
    activeIcon: "bar-chart",
    route: "/consumption",
  },
  {
    key: "alerts",
    labelKey: "tabs.alerts",
    icon: "notifications-outline",
    activeIcon: "notifications",
  },
  {
    key: "account",
    labelKey: "tabs.account",
    icon: "person-circle-outline",
    activeIcon: "person-circle",
  },
];

type BottomNavigationProps = {
  active: TabKey;
  onTabPress?: (key: TabKey) => void;
};

export function BottomNavigation({
  active,
  onTabPress,
}: BottomNavigationProps) {
  const { colors } = useAppTheme();
  const { t, i18n } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const isRTL = i18n.dir() === "rtl";

  function handlePress(tab: TabItem) {
    if (onTabPress) {
      onTabPress(tab.key);
      return;
    }
    if (tab.route && tab.key !== active) {
      router.navigate(tab.route);
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          direction: isRTL ? "rtl" : "ltr",
          paddingBottom: Math.max(insets.bottom, spacing.sm),
        },
      ]}
      accessibilityRole="tablist"
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const tintColor = isActive ? colors.brand : colors.secondaryText;

        return (
          <Pressable
            key={tab.key}
            onPress={() => handlePress(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={t(tab.labelKey)}
            style={({ pressed }) => [
              styles.tab,
              pressed && { opacity: opacity.pressed },
            ]}
            hitSlop={spacing.sm}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={24}
              color={tintColor}
            />
            <ThemedText
              variant="caption"
              style={[
                styles.label,
                { color: tintColor, fontWeight: isActive ? "600" : "400" },
              ]}
              numberOfLines={1}
            >
              {t(tab.labelKey)}
            </ThemedText>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(colors: ReturnType<typeof useAppTheme>["colors"]) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-around",
      backgroundColor: colors.surface,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.separator,
      paddingTop: spacing.sm,
      paddingHorizontal: spacing.sm,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        android: { elevation: 12 },
        default: {},
      }),
    },
    tab: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.xs,
      paddingVertical: spacing.xs,
    },
    label: {
      textAlign: "center",
    },
  });
}
