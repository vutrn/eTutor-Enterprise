import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Platform, StyleSheet, View } from "react-native";
import { Avatar, Text, TextInput } from "react-native-paper";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMessageStore } from "../../../store/useMessageStore";
import { FONTS } from "../../../utils/constant";

const MessageDetail = () => {
  const { messages, getMessages, sendMessage, selectedUser } = useMessageStore();
  const { authUser } = useAuthStore();
  const [text, setText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages();
    }
  }, [selectedUser]);

  const fetchMessages = async () => {
    setRefreshing(true);
    await getMessages(selectedUser._id);
    setRefreshing(false);

    // Scroll to bottom after fetching messages
    setTimeout(() => {
      if (flatListRef.current && messages.length > 0) {
        flatListRef.current.scrollToEnd({ animated: true });
      }
    }, 200);
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
              return;
            };
          } catch (error) {
            console.error("Error processing image:", error);
            sendMessage({ text });
            setText("");
            setImage(null);
          }
        }
        sendMessage({ text: text.trim() ? text : "", image: processedImage || undefined });
        setText("");
        setImage(null);
      };

      prepareAndSendMessage();
    }
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
    <View style={styles.container}>
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
              disabled={text.trim().length === 0}
            />
          }
          onKeyPress={(e) => {
            e.nativeEvent.key === "Enter" && handleSendMessage();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 12,
    maxWidth: "80%",
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
  inputContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  input: {
    flex: 1,
  },
  avatar: {
    backgroundColor: "#7886C7",
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
