import { View, Text, FlatList, TouchableOpacity, StyleSheet} from "react-native";
import React, { useEffect } from "react";
import { useAdminStore } from "../../../store/useAdminStore";
import { Button } from "react-native-paper";

const TutorList = () => {
  const { fetchUsers, tutors, deleteUser } = useAdminStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleDelete = (userId: string) => {
    deleteUser(userId);
    fetchUsers();
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
