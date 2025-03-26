import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useUserStore } from "../../../store/useUserStore";
import { SafeAreaView } from "react-native-safe-area-context";
const StudentList = () => {
  const { getUsers, students, deleteUser } = useUserStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleDelete = (userId: string) => {
    deleteUser(userId);
    getUsers();
  };

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.card}>
        <View key={item._id}>
          <Text>Name: {item.username}</Text>
          <Text>Email: {item.email}</Text>
          <Text>Role: {item.role}</Text>
          <Button onPress={() => handleDelete(item._id)} mode="contained">
            Delete
          </Button>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList data={students} keyExtractor={(item) => item._id} renderItem={renderItem} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
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

export default StudentList;
