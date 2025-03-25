import { StyleSheet } from "react-native";

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

export const MIME_TYPES = {
  pdf: "application/pdf",
  doc: "application/msword",
  docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ppt: "application/vnd.ms-powerpoint",
  pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  xls: "application/vnd.ms-excel",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  csv: "text/csv",
  txt: "text/plain",
}