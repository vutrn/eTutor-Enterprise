import { StyleSheet } from "react-native";

export const fonts = {
  thin: "Inter_100Thin",
  extraLight: "Inter_200ExtraLight",
  light: "Inter_300Light",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extraBold: "Inter_800Black",
  black: "Inter_900Black",
};

export const globalStyles = StyleSheet.create({
  globalFont: {
    fontFamily: fonts.regular,
  },
});
