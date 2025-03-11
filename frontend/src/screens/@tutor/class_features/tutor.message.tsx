import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { useMessageStore } from "../../../store/useMessageStore";
import { Button, TextInput } from "react-native-paper";
import { useClassStore } from "../../../store/useClassStore";

const TutorMessage = () => {
  const {
    getUsersToChat,
    getMessages,
    sendMessage,
    setSelectedUser,
    users,
    messages,
    selectedUser,
  } = useMessageStore();
  const { selectedClass } = useClassStore();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    getUsersToChat(selectedClass._id);
    getMessages(selectedUser._id);

    console.log("message:", messages);
  }, [selectedUser._id, getMessages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage("");
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <Button mode="contained" style={{ margin: 10 }} onPress={() => setSelectedUser(item)}>
        <Text>NAME: {item.username}</Text>
      </Button>
    );
  };

  return (
    <SafeAreaView>
      <FlatList data={users} keyExtractor={(item) => item._id} renderItem={renderItem} />
    </SafeAreaView>
  );
};

export default TutorMessage;
