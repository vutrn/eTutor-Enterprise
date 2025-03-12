import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, StyleSheet, View } from "react-native";
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
      sendMessage({ text: newMessage, image: image });
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
      aspect: [4, 3],
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
      <View style={{ flex: 1 }}>
        <FlatList data={messages} keyExtractor={(item) => item._id} renderItem={renderItem} />
        <View
          style={{
            borderBottomColor: "black",
            borderBottomWidth: StyleSheet.hairlineWidth,
          }}
        />
        {image && <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />}
        <View style={styles.inputContainer}>
          <TextInput value={newMessage} onChangeText={setNewMessage} style={{ flex: 1 }} />

          <Button onPress={handleSendMessage} mode="contained">
            Send
          </Button>
          <Button onPress={pickImage}>Pick an image from camera roll</Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
});
export default MessageDetail;
