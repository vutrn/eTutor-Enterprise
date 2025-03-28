import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Avatar, Text } from "react-native-paper";
import { FONTS } from "../utils/constant";
import { IMeetingState, IMessageState, Message } from "../types/store";

interface MessageItemProps {
  message: Message;
  isMyMessage: boolean;
  selectedUser: IMessageState["selectedUser"];
}

const MessageItem = ({ message, isMyMessage, selectedUser }: MessageItemProps) => {
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
        <Text style={styles.messageText}>{message.text}</Text>
        <Text>
          {message.image && (
            <Image
              source={{ uri: message.image }}
              style={styles.messageImage}
              resizeMode="contain"
            />
          )}
        </Text>
        <Text style={styles.timestamp}>
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: "row",
    maxWidth: "80%",
    marginBottom: 12,
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
  messageImage: {
    width: 200,
    height: 100,

    borderRadius: 8,
    marginTop: 8,
  },
  timestamp: {
    alignSelf: "flex-end",
    fontSize: 11,
    marginTop: 4,
    color: "#888",
    fontFamily: FONTS.light,
  },
  avatar: {
    backgroundColor: "#7886C7",
  },
});

export default MessageItem;
