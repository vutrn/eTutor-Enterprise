import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/useAuthStore";
import { fonts } from "../../utils/constant";

const Login = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // const isLoggingIn = useAuthStore((state) => state.isLoggingIn);
  const { login, isLoggingIn } = useAuthStore();
  console.log("🚀 ~ Login ~ isLoggingIn:", isLoggingIn);

  const handleLogin = async () => {
    if (!formData.username.trim()) {
      return Toast.show({ type: "error", text1: "ERROR", text2: "Username is required" });
    }
    if (!formData.password) {
      return Toast.show({ type: "error", text1: "ERROR", text2: "Password is required" });
    }

    try {
      const success = await login(formData);
      if (success) {
        navigation.navigate("home_admin");
      }
    } catch (error: any) {
      Toast.show({ type: "error", text1: "ERROR", text2: error.response?.data?.message });
    }
  };
  return (
    <KeyboardAvoidingView style={styles.container}>
      <View>
        <Text style={styles.text}>User namee</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    fontFamily: fonts.bold,
    justifyContent: "center",
    padding: 16,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 30,
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

export default Login;
