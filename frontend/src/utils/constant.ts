import { StyleSheet } from "react-native";
import Toast, { BaseToast, BaseToastProps, ErrorToast } from "react-native-toast-message";

export const FONTS = {
  light: "Inter_300Light",
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
};

export default StyleSheet.create({
  globalFont: {
    fontFamily: FONTS.regular,
    fontSize: 30,
  },
});

export const COLORS = {
  one: "#FFF2F2", 
  two: "#A9B5DF",
  three: "#7886C7", 
  four: "#2D336B",
};
