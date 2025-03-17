import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { format } from "date-fns";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

interface BlogItemProps {
  
}

const BlogItem = ({ post, onView, onEdit, onDelete }) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onView} activeOpacity={0.7}>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {post.title}
        </Text>
        <Text style={styles.preview} numberOfLines={2}>
          {post.content}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.date}>{format(new Date(post.createdAt), "MMM d, yyyy")}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onEdit();
          }}
        >
          <Feather name="edit" size={18} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <Feather name="trash" size={18} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default BlogItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  preview: {
    fontSize: 14,
    color: "#666",
    marginBottom: 12,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  author: {
    fontSize: 12,
    color: "#333",
  },
  date: {
    fontSize: 12,
    color: "#666",
  },
  actions: {
    justifyContent: "center",
    marginLeft: 8,
  },
  actionButton: {
    padding: 8,
  },
});
