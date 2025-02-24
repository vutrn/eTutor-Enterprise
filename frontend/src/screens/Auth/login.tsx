import React from "react";
import { Button, Text, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { TextInput } from "react-native-gesture-handler";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const Login = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const { login } = useAuthStore();

  const handleLogin = async () => {
    const formData = {
      /*...populate with necessary data*/
    };
    await login(formData);
  };
  return (
    <View>
      <Text>Login</Text>
      <TextInput placeholder="Username" />
      <TextInput placeholder="Password" secureTextEntry={true} />
      <Button title="Login" onPress={handleLogin} />

      <Text>Don't have an account?</Text>
      <Button title="Sign up" onPress={() => navigation.navigate("signup")} />
    </View>
  );
};

export default Login;
