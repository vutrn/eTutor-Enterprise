import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../store/useAuthStore";
import { useAdminStore } from "../../store/useAdminStore";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions } from "@react-navigation/native";

const AdminDashboard = () => {
  const { logout } = useAuthStore();
  const { fetchUsers, students, tutors, loading, isTokenExpired } = useAdminStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  
  console.log("🚀 ~ AdminDashboard ~ isTokenExpired:", isTokenExpired)
  if (isTokenExpired) {
    logout();
  }
  // console.log("🚀 ~ token:", AsyncStorage.getItem("access-token"));

  // if (isTokenExpired) {
  //   return (
  //     <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //       <Text>Your session has expired. Please log in again.</Text>
  //       <Button title="Log In" onPress={logout} />
  //     </SafeAreaView>
  //   );
  // }


  return (
    <SafeAreaView>
      {/* <View>
        <Text>Total students: {students.length}</Text>
        <Text>Total tutors: {tutors.length}</Text>
      </View> */}
      <View>
        <FlatList
          data={[...students, ...tutors]}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card}>
              <View key={item._id}>
                <Text>Name: {item.username}</Text>
                <Text>Email: {item.email}</Text>
                <Text>Role: {item.role}</Text>
              </View>
            </TouchableOpacity>
          )}
          onRefresh={fetchUsers}
          refreshing={isRefreshing}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
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
});
export default AdminDashboard;
