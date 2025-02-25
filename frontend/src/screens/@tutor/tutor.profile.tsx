import { View, Text, Button } from "react-native";
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const TutorProfile = () => {
  const { authUser, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View>
      <Text>Welcome, {authUser?.username ? authUser?.name : "{USERNAME}"}</Text>
      <Text>Your role: {authUser?.role ? authUser?.role : "{ROLE}"}</Text>

      <Text>Your email: {authUser?.email || "{EMAIL}"}</Text>
      <Text>Access token: {authUser?.accessToken || "{ACCESS_TOKEN}"}</Text>
      <Text>Refresh token: {authUser?.refreshToken || "{REFRESH_TOKEN}"}</Text>

      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

export default TutorProfile;
