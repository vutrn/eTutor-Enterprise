import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Avatar, Text, TextInput } from "react-native-paper";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMessageStore } from "../../../store/useMessageStore";
import { useUserStore } from "../../../store/useUserStore";
import { FONTS } from "../../../utils/constant";

const MessageDetail = () => {
  const { messages, selectedUser, getMessages, sendMessage } = useMessageStore();
  const { users, getUsers } = useUserStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMessages();
    getUsers();
  }, [selectedUser._id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages]);

  const fetchMessages = async () => {
    setRefreshing(true);
    await getMessages(selectedUser._id);
    setRefreshing(false);
  };

  const handleSendMessage = () => {
    if (text.trim() || image) {
      const prepareAndSendMessage = async () => {
        let processedImage = image;

        if (image && Platform.OS !== "web") {
          try {
            const response = await fetch(image);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64data = reader.result;
              sendMessage({
                text: text.trim() ? text : "",
                image: base64data ? base64data.toString() : undefined,
              });
              setText("");
              setImage(null);
            };
            return; // Exit early as we'll send in the onloadend callback
          } catch (error) {
            // console.error("Error processing image:", error);
            // Continue with sending the message without the image
          }
        }

        // Send message without image or if image processing failed
        sendMessage({
          text: text.trim() ? text : "",
          image: processedImage || undefined,
        });
        setText("");
        setImage(null);
      };

      prepareAndSendMessage();
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5, // Reduced quality to make the image smaller
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      // console.error("Error picking image:", error);
    }
  };

  const renderItem = ({ item }: any) => {
    const isMyMessage = item.senderId === authUser?._id;
    return (
      <View
        style={[
          styles.messageContainer,
          isMyMessage ? styles.myMessageContainer : styles.theirMessageContainer,
        ]}
      >
        {!isMyMessage && (
          <Avatar.Text
            size={32}
            label={selectedUser.username.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
        )}
        <View
          style={[
            styles.messageBubble,
            isMyMessage ? styles.myMessageBubble : styles.theirMessageBubble,
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <Text>
            {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
          </Text>
          <Text style={styles.timestamp}>
            {new Date(item.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.messagesList}
        onRefresh={fetchMessages}
        refreshing={refreshing}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No messages yet</Text>
            <Text style={styles.emptySubtext}>Start a conversation!</Text>
          </View>
        }
        onContentSizeChange={() => {
          if (flatListRef.current && messages.length > 0) {
            flatListRef.current.scrollToEnd({ animated: true });
          }
        }}
      />

      <View style={styles.inputContainer}>
        {image && <Image source={{ uri: image }} style={styles.imagePreview} />}
        <TextInput
          mode="outlined"
          value={text}
          onChangeText={setText}
          style={styles.input}
          placeholder="Type a message..."
          left={<TextInput.Icon icon="camera" onPress={pickImage} />}
          right={
            <TextInput.Icon
              icon="send"
              onPress={handleSendMessage}
              disabled={text.trim().length === 0 && image === null}
            />
          }
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messageContainer: {
    flexDirection: "row",
    maxWidth: "80%",
    marginBottom: 12,
  },
  inputContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: "#f5f5f5",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginTop: 8,
  },
  imagePreview: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 4,
  },
  avatar: {
    backgroundColor: "#7886C7",
  },
  myMessageContainer: {
    alignSelf: "flex-end",
  },
  theirMessageContainer: {
    alignSelf: "flex-start",
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 8,
  },
  myMessageBubble: {
    backgroundColor: "#DCF8C6",
    borderBottomRightRadius: 0,
  },
  theirMessageBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 0,
  },
  messageText: {
    fontFamily: FONTS.regular,
    fontSize: 16,
  },
  timestamp: {
    alignSelf: "flex-end",
    fontSize: 11,
    marginTop: 4,
    color: "#888",
    fontFamily: FONTS.light,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: FONTS.medium,
    color: "#757575",
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: "#9E9E9E",
    marginTop: 8,
  },
});

export default MessageDetail;
