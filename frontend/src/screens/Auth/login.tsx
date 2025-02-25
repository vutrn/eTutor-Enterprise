import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/useAuthStore";
import { fonts } from "../../utils/constant";
import { SafeAreaView } from "react-native-safe-area-context";

const LoginScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView>
        <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>Login</Text>
        <View>
          <Text style={styles.text}>User name</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(value) => setFormData({ ...formData, username: value })}
          />

          <Text style={styles.text}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry={true}
            onChangeText={(value) => setFormData({ ...formData, password: value })}
          />

          {isLoggingIn ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="loader" size={24} color="black" />
              <Button title="Logging in..." disabled={true} />
            </View>
          ) : (
            <Button title="Login" onPress={handleLogin} />
          )}

          <View>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Don't have an account?{" "}
              <Text style={styles.link} onPress={() => navigation.navigate("signup")}>
                Sign up
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: fonts.bold,
    justifyContent: "center",
    padding: 16,
    flex: 1,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 20,
  },
  input: {
    fontFamily: fonts.regular,
    fontSize: 20,
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default LoginScreen;
