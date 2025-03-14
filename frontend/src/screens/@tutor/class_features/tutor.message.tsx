import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useMessageStore } from "../../../store/useMessageStore";
import { Avatar, Button, TextInput } from "react-native-paper";
import { useClassStore } from "../../../store/useClassStore";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";

const TutorMessage = () => {
  const { getUsersToChat, setSelectedUser, selectedUser, users } =
    useMessageStore();
  const { selectedClass } = useClassStore();

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    getUsersToChat(selectedClass._id);
  }, [selectedClass._id]);

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    navigation.navigate("tutor_message_detail");
  };

  const renderItem = ({ item }: any) => {
    return (
      <Button
        mode="outlined"
        style={styles.userButton}
        contentStyle={styles.buttonContent}
        onPress={() => handleSelectUser(item)}
      >
        {/* random color */}
        <Avatar.Text
          size={40}
          color={"#fff"}
          label={item.username.substring(0, 2).toUpperCase()}
          style={styles.avatar}
        />
        <Text> {item.username}</Text>
        <Text> {item._id} </Text>
      </Button>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    // backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
  },
});
export default TutorMessage;
