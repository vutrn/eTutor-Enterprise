import { NavigationProp, useNavigation } from "@react-navigation/native";
import React from "react";
import { Button, Text, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useAdminStore } from "../../store/useAdminStore";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminDashboard = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const { fetchUsers, students, tutors, loading } = useAdminStore();

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const token = AsyncStorage.getItem("accessToken");
  console.log("🚀 ~ token:", token);

  if (loading) return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Loading...</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView>
      <Text>Students:</Text>
      {students.map((student) => (
        <View key={student._id}>
          <Text>{student.username}</Text>
        </View>
      ))}
      <Text>Tutors:</Text>
      {tutors.map((tutor) => (
        <View key={tutor._id}>
          <Text>{tutor.username}</Text>
        </View>
      ))}
    </SafeAreaView>
  );
};

export default AdminDashboard;
