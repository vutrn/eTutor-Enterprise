import React from "react";
import { Button, Text, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";

const StudentProfile = () => {
  const { authUser, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View>
      <Text>Welcome, {authUser?.username ? authUser?.username : "{USERNAME}"}</Text>
      <Text>Your role: {authUser?.role ? authUser?.role : "{ROLE}"}</Text>

      <Text>Your email: {authUser?.email || "{EMAIL}"}</Text>
      <Text>Access token: {authUser?.accessToken || "{ACCESS_TOKEN}"}</Text>
      <Text>Refresh token: {authUser?.refreshToken || "{REFRESH_TOKEN}"}</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default StudentProfile;
