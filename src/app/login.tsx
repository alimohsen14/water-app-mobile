import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { useAuthStore } from "@/stores/auth-store";
import { opacity, radius, spacing, useAppTheme } from "@/theme";

type AppColors = ReturnType<typeof useAppTheme>["colors"];

export default function LoginScreen() {
  const { t, i18n } = useTranslation();
  const { colors, scheme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const styles = createStyles(colors);
  const isRTL = i18n.dir() === "rtl";
  const align = isRTL ? "right" : "left";

  const login = useAuthStore((state) => state.login);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  function handleLogin() {
    if (login(username, password)) {
      setError(false);
      router.replace("/");
    } else {
      setError(true);
    }
  }

  return (
    <View style={[styles.root, { direction: isRTL ? "rtl" : "ltr" }]}>
      <StatusBar style={scheme === "dark" ? "light" : "dark"} />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            { paddingTop: insets.top + spacing.xl },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.logoBadge}>
            <Ionicons name="water" size={48} color={colors.onBrand} />
          </View>

          <ThemedText variant="largeTitle" style={styles.title}>
            {t("login.title")}
          </ThemedText>
          <ThemedText variant="subhead" style={styles.subtitle}>
            {t("login.subtitle")}
          </ThemedText>

          <View style={styles.form}>
            <ThemedText
              variant="subhead"
              style={[styles.label, { textAlign: align }]}
            >
              {t("login.usernameLabel")}
            </ThemedText>
            <View
              style={[
                styles.inputWrapper,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.secondaryText}
              />
              <TextInput
                style={[styles.input, { textAlign: align }]}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (error) setError(false);
                }}
                placeholder={t("login.usernamePlaceholder")}
                placeholderTextColor={colors.secondaryText}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="username"
                returnKeyType="next"
              />
            </View>

            <ThemedText
              variant="subhead"
              style={[styles.label, { textAlign: align }]}
            >
              {t("login.passwordLabel")}
            </ThemedText>
            <View
              style={[
                styles.inputWrapper,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.secondaryText}
              />
              <TextInput
                style={[styles.input, { textAlign: align }]}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (error) setError(false);
                }}
                placeholder={t("login.passwordPlaceholder")}
                placeholderTextColor={colors.secondaryText}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                textContentType="password"
                returnKeyType="done"
                onSubmitEditing={handleLogin}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t(
                  showPassword ? "login.hidePassword" : "login.showPassword",
                )}
                onPress={() => setShowPassword((value) => !value)}
                hitSlop={spacing.sm}
                style={({ pressed }) => pressed && { opacity: opacity.pressed }}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.secondaryText}
                />
              </Pressable>
            </View>

            {error && (
              <ThemedText
                variant="subhead"
                style={[styles.error, { textAlign: align }]}
              >
                {t("login.error")}
              </ThemedText>
            )}

            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t("login.loginButton")}
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.button,
                pressed && { opacity: opacity.pressed },
              ]}
            >
              <ThemedText variant="headline" style={styles.buttonLabel}>
                {t("login.loginButton")}
              </ThemedText>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: colors.background,
    },
    flex: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      paddingHorizontal: spacing.lg,
      paddingBottom: spacing.xl,
      alignItems: "center",
    },
    logoBadge: {
      width: 88,
      height: 88,
      borderRadius: radius.xl,
      backgroundColor: colors.brand,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.lg,
    },
    title: {
      textAlign: "center",
    },
    subtitle: {
      textAlign: "center",
      marginTop: spacing.xs,
      marginBottom: spacing.xl,
    },
    form: {
      width: "100%",
    },
    label: {
      marginBottom: spacing.xs,
      marginTop: spacing.md,
    },
    inputWrapper: {
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: colors.surface,
      borderRadius: radius.md,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: colors.separator,
      paddingHorizontal: spacing.md,
      height: 52,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 17,
      height: "100%",
    },
    error: {
      color: colors.danger,
      marginTop: spacing.sm,
    },
    button: {
      backgroundColor: colors.brand,
      borderRadius: radius.md,
      height: 52,
      alignItems: "center",
      justifyContent: "center",
      marginTop: spacing.xl,
    },
    buttonLabel: {
      color: colors.onBrand,
    },
  });
}
