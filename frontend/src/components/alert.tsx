import { Alert, Platform } from "react-native";

const alertPolyfill = (
  title: string,
  description: string,
  options: Array<{
    text: string;
    onPress: () => void;
    style?: string;
  }>
) => {
  const result = window.confirm([title, description].filter(Boolean).join("\n"));

  if (result) {
    const confirmOption = options.find(({ style }) => style !== "cancel");
    confirmOption && confirmOption.onPress();
  } else {
    const cancelOption = options.find(({ style }) => style === "cancel");
    cancelOption && cancelOption.onPress();
  }
};

const alert = Platform.OS === "web" ? alertPolyfill : Alert.alert;

export default alert;
