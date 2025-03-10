import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, Text, View } from "react-native";
import { useMessageStore } from "../../../store/useMessageStore";
import { Button, TextInput } from "react-native-paper";

const TutorMessage = ({ route }: any) => {
  const {
    getUsersToChat,
    getMessages,
    sendMessage,
    setSelectedUser,
    users,
    messages,
    selectedUser,
  } = useMessageStore();
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    getUsersToChat(route.params?._id);
    getMessages(route.params?._id);
  }, []);

  console.log("route params", route);

  const handleSendMessage = () => {
    sendMessage( newMessage);
    setNewMessage("");
  };

  const renderItem = ({ item }: any) => {
    //exclude current user
    
    return (
      <View style={{ padding: 10 }}>
        <Text>{item.username}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView>
      <FlatList
        horizontal
        data={users}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
      <View style={{ flexDirection: "row", padding: 10 }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: "#ccc", padding: 10 }}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message"
        />
        <Button mode="contained" onPress={handleSendMessage}>
          Send
        </Button>
      </View>
    </SafeAreaView>
  );
};

export default TutorMessage;
