import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useRef, useState } from "react";
import { FlatList, Image, Platform, StyleSheet, View } from "react-native";
import { Badge, Text, TextInput } from "react-native-paper";
import MessageItem from "../../../components/MessageItem";
import { useAuthStore } from "../../../store/useAuthStore";
import { useMessageStore } from "../../../store/useMessageStore";
import { FONTS } from "../../../utils/constant";

const MessageDetail = () => {
  const {
    messages,
    getMessages,
    sendMessage,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useMessageStore();
  const { authUser, onlineUsers } = useAuthStore();
  const [text, setText] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    if (selectedUser?._id) {
      fetchMessages();
      subscribeToMessages();
    }

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser]);

  useEffect(() => {
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

  const isUserOnline = selectedUser && onlineUsers.includes(selectedUser._id);

  const renderItem = ({ item }: any) => {
    const isMyMessage = item.senderId === authUser?._id;
    return <MessageItem message={item} isMyMessage={isMyMessage} selectedUser={selectedUser} />;
  };

  return (
    <View style={styles.container}>
      {/* Header with online status */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>{selectedUser?.username}</Text>
        <View style={styles.statusContainer}>
          <Badge
            size={12}
            style={[styles.statusDot, isUserOnline ? styles.onlineDot : styles.offlineDot]}
          />
          <Text style={styles.statusText}>{isUserOnline ? "Online" : "Offline"}</Text>
        </View>
      </View>

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
            e.nativeEvent.key === "Enter" && handleSendMessage();
          }}
        />
      </View>
    </View>
  );
};

export default MessageDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    backgroundColor: "#2D336B",
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: "white",
    fontSize: 18,
    fontFamily: FONTS.medium,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    marginRight: 6,
  },
  onlineDot: {
    backgroundColor: "#4CAF50",
  },
  offlineDot: {
    backgroundColor: "#9E9E9E",
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  messagesList: {
    padding: 16,
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
  imagePreview: {
    width: 60,
    height: 60,
    marginRight: 8,
    borderRadius: 4,
  },
});
