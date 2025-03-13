import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { useMessageStore } from "../../../store/useMessageStore";
import { useUserStore } from "../../../store/useUserStore";
import { FONTS } from "../../../utils/constant";

const MessageDetail = () => {
  const { messages, selectedUser, getMessages, sendMessage } =
    useMessageStore();
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
    <View
      style={[
        styles.messageContainer,
        item.senderId === selectedUser._id
          ? styles.receivedMessage
          : styles.sentMessage,
      ]}
    >
      {/* <Text>{getSenderNameById(item.senderId)}</Text> */}
      <Text>{item.text}</Text>
      {item.image && (
        <Image
          source={{ uri: item.image }}
          style={{ width: 100, height: 100 }}
        />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "android" ? "padding" : undefined}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "android" ? 90 : 0}
    >
      <FlatList
        data={messages}
        keyExtractor={(item) => item.senderId}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
      />

      <View style={styles.inputContainer}>
        {image && (
          <Image source={{ uri: image }} style={{ width: 100, height: 100 }} />
        )}
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
        />
        <IconButton icon="send" onPress={handleSendMessage} size={30} />
        <IconButton icon="camera" onPress={pickImage} size={30} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messageContainer: {
    maxWidth: "80%",
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  messagesList: {
    padding: 16,
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#6366F1",
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
  },
  input: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    marginRight: 8,
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
});

export default MessageDetail;
