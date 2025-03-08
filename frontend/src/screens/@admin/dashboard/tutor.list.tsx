import React, { useEffect } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Button } from "react-native-paper";
import { useUserStore } from "../../../store/useUserStore";

const TutorList = () => {
  const { getUsers, tutors, deleteUser } = useUserStore();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const handleDelete = (userId: string) => {
    deleteUser(userId);
    getUsers();
  };

  return (
    <View>
      <Text>TutorList</Text>
      <FlatList
        data={tutors}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <View key={item._id}>
              <Text>Name: {item.username}</Text>
              <Text>Email: {item.email}</Text>
              <Text>Role: {item.role}</Text>
              <Button onPress={() => handleDelete(item._id)} mode="contained">
                Delete
              </Button>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
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

export default TutorList;
