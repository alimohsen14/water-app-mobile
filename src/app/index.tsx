import { StatusBar } from "expo-status-bar";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text>{t("home.tagline")}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
