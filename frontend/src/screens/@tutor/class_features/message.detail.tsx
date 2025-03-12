import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useMessageStore } from "../../../store/useMessageStore";
import { useUserStore } from "../../../store/useUserStore";

const MessageDetail = () => {
  const { messages, selectedUser, getMessages, sendMessage } = useMessageStore();
  const { users, getUsers } = useUserStore();
  const [newMessage, setNewMessage] = useState("");
  const [image, setImage] = useState<string | null>(null);

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

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const renderItem = ({ item }: any) => (
    <View>
      <Text>{getSenderNameById(item.senderId)}</Text>
      <Text>{item.text}</Text>
      {item.image && <Image source={{ uri: item.image }} style={{ width: 100, height: 100 }} />}
    </View>
  );

  return (
    <SafeAreaView>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.senderId}
        renderItem={renderItem}
        contentContainerStyle={{ flexGrow: 1 }}
      />

      {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
      <TextInput value={newMessage} onChangeText={setNewMessage} />
      <Button onPress={handleSendMessage} mode="contained">
        Send
      </Button>
      <Button onPress={pickImage}>Pick an image from camera roll</Button>
    </SafeAreaView>
  );
};

export default MessageDetail;
