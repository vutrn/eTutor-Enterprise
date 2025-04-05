import { format } from "date-fns";
import React from "react";
import { Image, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { IBlogState } from "../../types/store";

interface BlogCardProps {
  blog: IBlogState["blogs"][number];
  onPress: (blog: IBlogState["blogs"][number]) => void;
}

const BlogCard = ({ blog, onPress }: BlogCardProps) => {
  return (
    <View className="flex-1 p-2" style={{ maxWidth: "50%" }}>
      <Card
        className="rounded-lg border border-gray-300 bg-white"
        onPress={() => onPress(blog)}
        style={{ height: 250 }}
      >
        <Image
          source={{ uri: blog.image }}
          className="w-full h-32 rounded-t-lg"
          resizeMode="cover"
        />
        <Card.Content className="p-3">
          <Text
            numberOfLines={1}
            className="text-base font-bold text-gray-800 mb-1"
          >
            {blog.title ? blog.title : "Untitled"}
          </Text>
          <Text
            numberOfLines={1} // Limit the blog's content to 1 line
            className="text-sm text-gray-600 mb-2"
          >
            {blog.content ? blog.content : "No content available"}
          </Text>
          <Text className="text-xs text-gray-500 italic">
            By: {blog.author ? blog.author.username : "Unknown author"}
          </Text>
          <Text className="text-xs text-gray-500 italic">
            Published:{" "}
            {format(new Date(blog.createdAt), "MMMM dd, yyyy") ||
              "Date not available"}
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
};

export default BlogCard;