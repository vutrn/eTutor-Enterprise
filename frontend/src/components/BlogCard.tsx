import React from "react";
import { Image, StyleSheet } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { format } from "date-fns";
import { FONTS } from "../utils/constant";
import { IBlogState } from "../types/store";

interface BlogCardProps {
  blog: IBlogState["blogs"][number];
  onPress: (blog: IBlogState["blogs"][number]) => void;
}

const BlogCard = ({ blog, onPress }: BlogCardProps) => {
  return (
    <Card style={styles.card} onPress={() => onPress(blog)}>
      <Card.Title
        titleStyle={styles.title}
        title={blog.title ? blog.title : "Untitled"}
        left={() => (
          <Image
            source={{ uri: blog.image }}
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        )}
        right={() => <IconButton icon="arrow-right" />}
      />
      <Card.Content>
        <Text numberOfLines={1} style={styles.content}>
          {blog.content ? blog.content : "No content available"}
        </Text>
        <Text style={styles.author}>
          By: {blog.author ? blog.author.username : "Unknown author"}
        </Text>
        <Text style={styles.date}>
          Published: {format(new Date(blog.createdAt), "MMMM dd, yyyy") || "Date not available"}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: FONTS.bold,
  },
  content: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: FONTS.regular,
  },
  author: {
    fontSize: 14,
    color: "#555",
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.light,
    textAlign: "right",
    fontStyle: "italic",
  },
});

export default BlogCard;
