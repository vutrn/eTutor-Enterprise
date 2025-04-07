import { NavigationProp, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";
import { useBlogStore } from "../../store/useBlogStore";
import { useUserStore } from "../../store/useUserStore";
import alert from "../alert";

import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";

import {
  Calendar,
  Edit,
  MessageSquare,
  MoreVertical,
  Send,
  Trash2,
} from "lucide-react-native";

const BlogDetail = () => {
  const { authUser } = useAuthStore();
  const { users, getUsers } = useUserStore();
  const { selectedBlog, commentBlog, deleteBlog } = useBlogStore();
  const [commentText, setText] = useState("");
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    getUsers();
  }, []);

  const isAuthor = selectedBlog?.author?._id === authUser?._id;

  const handleSendComment = async (text: string) => {
    if (text.trim()) {
      await commentBlog(text);
      setText("");
    }
  };

  const handleDeleteBlog = async () => {
    alert("WARNING", "This action cannot be undone", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {},
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteBlog(selectedBlog._id);
          navigation.goBack();
        },
      },
    ]);
  };

  const getUserNameById = (userId: string) => {
    const selectedUser = users.find((user) => user._id === userId);
    return selectedUser ? selectedUser.username : "Unknown";
  };

  const getRoleById = (userId: string) => {
    const selectedUser = users.find((user) => user._id === userId);
    return selectedUser
      ? selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)
      : "Unknown role";
  };

  const formattedDate = selectedBlog?.createdAt
    ? format(new Date(selectedBlog.createdAt), "h:mm a · MMMM d, yyyy")
    : "Date not available";

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Box className="p-4">
          <Card variant="elevated" className="mb-4 bg-white shadow-sm">
            <VStack space="md">
              {/* Blog header with author info and action menu */}
              <HStack className="items-center justify-between">
                <HStack className="items-center space-x-3">
                  <Avatar size="md" className="bg-primary-600">
                    <AvatarFallbackText>
                      {selectedBlog?.author?.username
                        ?.charAt(0)
                        .toUpperCase() || "?"}
                    </AvatarFallbackText>
                  </Avatar>
                  <VStack>
                    <Text className="font-bold">
                      {selectedBlog?.author
                        ? selectedBlog.author.username
                        : "Unknown author"}
                    </Text>
                    <HStack className="items-center space-x-1">
                      <Icon as={Calendar} size="md" className="text-gray-500" />
                      <Text className="text-xs text-gray-500">
                        {formattedDate}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                {isAuthor && (
                  <Box>
                    <Menu
                      trigger={({ ...triggerProps }) => (
                        <Pressable {...triggerProps}>
                          <Icon as={MoreVertical} size="md" />
                        </Pressable>
                      )}
                    >
                      <MenuItem
                        onPress={() => navigation.navigate("blog_update")}
                      >
                        <Icon
                          as={Edit}
                          size="sm"
                          className="mr-2 text-blue-500"
                        />
                        <MenuItemLabel>Edit</MenuItemLabel>
                      </MenuItem>
                      <MenuItem onPress={handleDeleteBlog}>
                        <Icon
                          as={Trash2}
                          size="sm"
                          className="mr-2 text-red-500"
                        />
                        <MenuItemLabel className="text-red-500">
                          Delete
                        </MenuItemLabel>
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </HStack>

              {/* Blog featured image */}
              {selectedBlog?.image && (
                <Box className="overflow-hidden rounded-lg">
                  <Image
                    source={{ uri: selectedBlog.image }}
                    className="h-48 w-full"
                    resizeMode="cover"
                  />
                </Box>
              )}

              {/* Blog title */}
              <Heading size="lg" className="text-gray-800">
                {selectedBlog?.title}
              </Heading>

              {/* Blog content */}
              <Text className="leading-relaxed text-gray-700">
                {selectedBlog?.content}
              </Text>
            </VStack>
          </Card>

          {/* Comments section */}
          <Card variant="elevated" className="bg-white p-4 shadow-sm">
            <VStack space="md">
              <HStack className="items-center space-x-2">
                <Icon
                  as={MessageSquare}
                  size="sm"
                  className="text-primary-600"
                />
                <Heading size="sm">
                  Comments ({selectedBlog?.comments?.length || 0})
                </Heading>
              </HStack>

              <HStack className="space-x-2">
                <Input size="md" className="flex-1 bg-gray-50">
                  <InputField
                    value={commentText}
                    onChangeText={setText}
                    placeholder="Add a comment..."
                    onKeyPress={(e) => {
                      if (e.nativeEvent.key === "Enter") {
                        handleSendComment(commentText);
                      }
                    }}
                  />
                </Input>
                <Button
                  size="md"
                  action="primary"
                  isDisabled={commentText.trim().length === 0}
                  onPress={() => handleSendComment(commentText)}
                >
                  <ButtonIcon as={Send} />
                </Button>
              </HStack>

              {/* Comments list */}
              {selectedBlog?.comments && selectedBlog.comments.length > 0 ? (
                <VStack space="md" className="mt-2">
                  {[...selectedBlog.comments].reverse().map((comment: any) => (
                    <Box
                      key={comment._id}
                      className="rounded-lg bg-gray-50 p-3"
                    >
                      <HStack className="mb-1 items-center space-x-2">
                        <Avatar size="xs" className="bg-gray-400">
                          <AvatarFallbackText>
                            {getUserNameById(comment.user)
                              ?.charAt(0)
                              .toUpperCase() || "?"}
                          </AvatarFallbackText>
                        </Avatar>
                        <Text className="text-sm font-bold">
                          {getUserNameById(comment.user)}
                        </Text>
                        <Badge className="ml-1">
                          <Text className="text-xs">
                            {getRoleById(comment.user)}
                          </Text>
                        </Badge>
                        <Text className="ml-auto text-xs text-gray-500">
                          {format(new Date(comment.createdAt), "MMM d, h:mm a")}
                        </Text>
                      </HStack>
                      <Text className="pl-8 text-gray-700">{comment.text}</Text>
                    </Box>
                  ))}
                </VStack>
              ) : (
                <Box className="my-6 items-center">
                  <Icon
                    as={MessageSquare}
                    size="xl"
                    className="mb-2 text-gray-300"
                  />
                  <Text className="text-gray-500">
                    No comments yet. Be the first!
                  </Text>
                </Box>
              )}
            </VStack>
          </Card>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogDetail;
