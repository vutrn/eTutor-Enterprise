import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { Avatar, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClassStore } from "../../../store/useClassStore";
import { useMessageStore } from "../../../store/useMessageStore";
import { FONTS } from "../../../utils/constant";

const StudentMessage = () => {
  const { getUsersToChat, setSelectedUser, users } = useMessageStore();
  const { selectedClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, [selectedClass._id]);

  const fetchUsers = async () => {
    setRefreshing(true);
    await getUsersToChat(selectedClass._id);
    setRefreshing(false);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    navigation.navigate("student_message_detail");
  };

  const renderItem = ({ item }: any) => {
    // Get first two letters of username for avatar
    const initials = item.username.substring(0, 2).toUpperCase();
    
    return (
      <Button
        mode="outlined"
        style={styles.userButton}
        contentStyle={styles.buttonContent}
        onPress={() => handleSelectUser(item)}
      >
        <Avatar.Text
          size={40}
          color={"#fff"}
          label={initials}
          style={styles.avatar}
        />
        <Text style={styles.username}>{item.username}</Text>
        {item.role && (
          <Text style={styles.role}>
            ({item.role.charAt(0).toUpperCase() + item.role.slice(1)})
          </Text>
        )}
      </Button>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Messages</Text>
      <Text style={styles.subheader}>Select a user to chat with</Text>
      
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={fetchUsers}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No users available to chat with in this class
          </Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: "#666",
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  userButton: {
    marginVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  buttonContent: {
    justifyContent: "flex-start",
    padding: 10,
  },
  avatar: {
    backgroundColor: "#7886C7",
  },
  username: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  role: {
    marginLeft: 6,
    fontSize: 14,
    fontFamily: FONTS.light,
    color: "#555",
  },
  emptyText: {
    textAlign: "center",
    fontFamily: FONTS.regular,
    fontSize: 16,
    marginTop: 40,
    color: "#666",
  },
});

export default StudentMessage;