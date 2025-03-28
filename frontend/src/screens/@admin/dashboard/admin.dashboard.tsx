import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import alert from "../../../components/alert";
import { useUserStore } from "../../../store/useUserStore";

const { width } = Dimensions.get("window");

const AdminDashboard = () => {
  const { getUsers, students, tutors, deleteUser } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("student_list")}
        >
          <Feather name="users" size={24} color="#1890ff" />
          <Text style={styles.cardText}>Total Students: {students.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("tutor_list")}
        >
          <Feather name="user-check" size={24} color="#52c41a" />
          <Text style={styles.cardText}>Total Tutors: {tutors.length}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  cardContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: width * 0.9,
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginLeft: 10,
  },
});

export default AdminDashboard;