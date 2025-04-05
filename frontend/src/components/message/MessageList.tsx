import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text } from "react-native";
import { Avatar, Button } from "react-native-paper";
import { useClassStore } from "../../store/useClassStore";
import { useMessageStore } from "../../store/useMessageStore";

interface MessageListProps {
  userRole: 'tutor' | 'student';
}

const MessageList = ({ userRole }: MessageListProps) => {
  const { getUsersToChat, setSelectedUser, users } = useMessageStore();
  const { selectedClass } = useClassStore();
  const navigation: NavigationProp<any> = useNavigation();

  useEffect(() => {
    if (selectedClass?._id) {
      getUsersToChat(selectedClass._id);
    }
  }, [selectedClass?._id]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    // Navigate to the appropriate screen based on user role
    navigation.navigate(userRole === 'tutor' ? "tutor_message_detail" : "student_message_detail");
  };

  const renderItem = ({ item }: any) => {
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
          label={item.username.substring(0, 2).toUpperCase()}
          style={styles.avatar}
        />
        <Text> {item.username}</Text>
      </Button>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList 
        data={users} 
        keyExtractor={(item) => item._id} 
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingVertical: 8,
  },
  userButton: {
    marginVertical: 5,
    marginHorizontal: 10,
  },
  buttonContent: {
    justifyContent: "flex-start",
    padding: 10,
  },
  avatar: {
    backgroundColor: "#7886C7",
  },
});

export default MessageList;