import React from "react";
import { Button, Text, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { CommonActions, NavigationProp, useNavigation } from "@react-navigation/native";

const HomeAdmin = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigation.navigate("login");
  };

  return (
    <View>
      <Text>Welcome, {user?.username ? user?.name : '{USERNAME}'}</Text>
      <Text>Your role: {user?.role ? user?.role : "{ROLE}"}</Text>

      <Text>Your email: {user?.email || '{EMAIL}'}</Text>
      <Text>Access token: {user?.accessToken || '{ACCESS_TOKEN}'}</Text>
      <Text>Refresh token: {user?.refreshToken || '{REFRESH_TOKEN}'}</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default HomeAdmin;
