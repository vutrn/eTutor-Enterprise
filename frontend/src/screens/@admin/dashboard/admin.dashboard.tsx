import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import alert from "../../../components/alert";
import { useAdminStore } from "../../../store/useAdminStore";

const { width } = Dimensions.get("window");

const AdminDashboard = () => {
  const { fetchUsers, students, tutors, deleteUser } = useAdminStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = (userId: string) => {
    alert("Delete User", "Are you sure you want to delete this user?", [
      { text: "Cancel", style: "cancel", onPress: () => {} },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          deleteUser(userId);
          fetchUsers();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("student_list")}>
          <Text>Total students: {students.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("tutor_list")}>
          <Text>Total tutors: {tutors.length}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    flex: 1,
    padding: 20,
  },
  card: {
    // flexDirection: "row",
    padding: 20,
    marginVertical: 10,
    marginHorizontal: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
});
export default AdminDashboard;
