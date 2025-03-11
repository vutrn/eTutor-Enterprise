import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, View } from "react-native";
import { useMessageStore } from "../../../store/useMessageStore";
import { Button, TextInput, Text } from "react-native-paper";
import { useUserStore } from "../../../store/useUserStore";

const MessageDetail = ({ route }: any) => {
  const { messages, selectedUser, getMessages, sendMessage } = useMessageStore();
  const { users, getUsers } = useUserStore();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    getMessages(selectedUser._id);
    getUsers();
    console.log("selected user:", selectedUser);
  }, [selectedUser._id]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage({ text: newMessage });
      setNewMessage("");
    }
  };

  const getSenderNameById = (senderId: string) => {
    const sender = users.find((user) => user._id === senderId);
    return sender ? sender.username : "Unknown";
  };

  const renderItem = ({ item }: any) => (
    <View>
      <Text>{getSenderNameById(item.senderId)}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaView>
      <FlatList data={messages} keyExtractor={(item) => item._id} renderItem={renderItem} />
      <TextInput value={newMessage} onChangeText={setNewMessage} />
      <Button title="Send" onPress={handleSendMessage} mode="contained">
        Send
      </Button>
    </SafeAreaView>
  );
};

export default MessageDetail;
