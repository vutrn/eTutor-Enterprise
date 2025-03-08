import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/useAuthStore";
import { FONTS } from "../../utils/constant";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput, Text, Button, ActivityIndicator } from "react-native-paper";

const { width } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const { login, isLoggingIn } = useAuthStore();

  const handleLogin = async () => {
    if (!formData.username.trim()) {
      return Toast.show({ type: "error", text1: "ERROR", text2: "Username is required" });
    }
    if (!formData.password) {
      return Toast.show({ type: "error", text1: "ERROR", text2: "Password is required" });
    }

    try {
      const success = await login(formData);
      // if (success) {
      //   navigation.navigate("admin_dashboard");
      // }
    } catch (error: any) {
      Toast.show({ type: "error", text1: "ERROR", text2: error.response?.data?.message });
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <KeyboardAvoidingView>
        <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>Login</Text>
        <View>
          <View style={{ marginBottom: 20 }}>
            <Text variant="titleMedium">User name</Text>
            <TextInput
              onKeyPress={(e) => {e.nativeEvent.key === "Enter" && handleLogin()}}
              mode="outlined"
              label="Username"
              onChangeText={(value) => setFormData({ ...formData, username: value })}
            />
          </View>
          <View>
            <Text variant="titleMedium">Password</Text>
            <TextInput
              onKeyPress={(e) => {e.nativeEvent.key === "Enter" && handleLogin()}}
              mode="outlined"
              secureTextEntry={!showPassword}
              label="Password"
              right={<TextInput.Icon icon="eye" onPress={() => setShowPassword(!showPassword)} />}
              onChangeText={(value) => setFormData({ ...formData, password: value })}
            />
          </View>

          {isLoggingIn ? (
            <Button mode="contained" loading disabled style={styles.button}>
              Logging in...
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleLogin}
              style={styles.button}
              buttonColor="#2D336B"
              textColor="white"
            >
              Login
            </Button>
          )}

          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
            }}
          />

          <View style={styles.linkContainer}>
            <Text variant="titleMedium">Don't have an account?{"  "}</Text>
            <Button
              mode="outlined"
              onPress={() => navigation.navigate("signup")}
              buttonColor="#2D336B"
              textColor="white"
              icon="arrow-right"
              contentStyle={{ flexDirection: "row-reverse" }}
            >
              Sign up
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: FONTS.bold,
    justifyContent: "center",
    padding: 24,
    flex: 1,
    width: width > 768 ? "30%" : "100%",
    alignSelf: "center",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginVertical: 20,
  },
});

export default LoginScreen;
