import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Blog } from "@/src/types/store";
import { format } from "date-fns";
import { Clock, ImageIcon, ImageOff, MessageSquare } from "lucide-react-native";
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

interface BlogCardProps {
  blog: Blog;
  onPress: (blog: any) => void;
}

const BlogCard = ({ blog, onPress }: BlogCardProps) => {
  const { authUser } = useAuthStore();

  // Format created date
  const formattedDate = format(new Date(blog.createdAt), "MMM d, yyyy");

  // Extract preview content (first 80 characters)
  const previewContent =
    blog.content.length > 80
      ? blog.content.substring(0, 80) + "..."
      : blog.content;

  return (
    <Pressable className="mb-4 w-[48%]" onPress={() => onPress(blog)}>
      <Card
        variant="elevated"
        size="md"
        className="bg-white shadow-sm transition-shadow duration-200 hover:shadow-md"
      >
        <VStack space="sm">
          {/* Author info */}
          <HStack className="items-center justify-between space-x-2">
            <Box className="flex-row items-center space-x-2">
              <Avatar size="md" className="bg-primary-600">
                <AvatarFallbackText>
                  {blog.author.username.charAt(0).toUpperCase()}
                </AvatarFallbackText>
              </Avatar>
              <Text className="text-md text-gray-600">
                {blog.author.username}
              </Text>
            </Box>
            {/* Blog featured image (if available) */}
            {blog.image ? (
              <Box className="w-30 flex h-20 rounded-md">
                <Image
                  source={{ uri: blog.image }}
                  alt={blog.title}
                  resizeMode="cover"
                />
              </Box>
            ) : (
              <Box className="flex h-20 w-20 items-center justify-center rounded-md bg-gray-200">
                <Icon as={ImageOff} size="lg" className="text-gray-400" />
              </Box>
            )}
          </HStack>

          {/* Blog title */}
          <Text className="line-clamp-2 text-base font-bold text-gray-800">
            {blog.title}
          </Text>

          {/* Blog preview */}
          <Text className="line-clamp-1 text-xs text-gray-600">
            {previewContent}
          </Text>

          {/* Stats and metadata */}
          <HStack className="mt-2 justify-between border-t border-gray-100 pt-2">
            <HStack className="items-center space-x-1">
              <Icon as={MessageSquare} size="xs" className="text-gray-400" />
              <Text className="text-xs text-gray-500">
                {blog.comments.length}
              </Text>
            </HStack>

            <HStack className="items-center space-x-1">
              <Icon as={Clock} size="xs" className="text-gray-400" />
              <Text className="text-xs text-gray-500">{formattedDate}</Text>
            </HStack>
          </HStack>
        </VStack>
      </Card>
    </Pressable>
  );
};

export default BlogCard;
