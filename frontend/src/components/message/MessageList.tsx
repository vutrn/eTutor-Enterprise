import {
  Avatar,
  AvatarBadge,
  AvatarFallbackText,
} from "@/components/ui/avatar";
import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/src/store/useAuthStore";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Circle, MessageCircle, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClassStore } from "../../store/useClassStore";
import { useMessageStore } from "../../store/useMessageStore";

interface MessageListProps {
  userRole: "tutor" | "student";
}

const MessageList = ({ userRole }: MessageListProps) => {
  const { getUsersToChat, setSelectedUser, users } = useMessageStore();
  const { selectedClass } = useClassStore();
  const { authUser, onlineUsers } = useAuthStore();
  const navigation: NavigationProp<any> = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedClass?._id) {
      fetchUsers();
    }
  }, [selectedClass?._id]);

  const fetchUsers = async () => {
    setRefreshing(true);
    await getUsersToChat(selectedClass._id);
    setRefreshing(false);
  };

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    navigation.navigate(
      userRole === "tutor" ? "tutor_message_detail" : "student_message_detail",
    );
  };

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getRandomColor = (username: string) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-amber-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const hash = username
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((onlineUser: string) => onlineUser === userId);
  };

  const renderItem = ({ item }: any) => {
    const avatarColor = getRandomColor(item.username);
    const userType = userRole === "tutor" ? "Tutor" : "Student";
    const isOnline = isUserOnline(item._id);

    return (
      <Pressable onPress={() => handleSelectUser(item)} className="mx-4 my-1">
        <Box className="rounded-lg border border-gray-200 bg-white p-3">
          <HStack className="items-center space-x-3">
            <Box className="relative">
              <Avatar size="md" className={avatarColor}>
                <AvatarFallbackText>
                  {item.username.substring(0, 2).toUpperCase()}
                </AvatarFallbackText>
                {isOnline ? <AvatarBadge className="size-2" /> : null}
              </Avatar>
            </Box>
            <VStack className="flex-1">
              <Text className="font-semibold">{item.username}</Text>
              <Text className="text-xs text-gray-500">{item.role}</Text>
            </VStack>
            <Icon as={MessageCircle} size="lg" className="text-primary-600" />
          </HStack>
        </Box>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Box className="flex-1 p-4">
        <VStack space="md" className="mb-4">
          <Heading size="xl">Messages</Heading>
          <Text className="text-gray-600">
            {userRole === "tutor"
              ? "Start a conversation with students in your class"
              : "Contact your tutors for help or questions"}
          </Text>

          <Input size="md" className="bg-white">
            <InputSlot className="pl-2">
              <InputIcon>
                <Icon as={Circle} size="sm" />
              </InputIcon>
            </InputSlot>
            <InputField
              placeholder={`Search ${userRole === "tutor" ? "students" : "tutors"}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>
        </VStack>

        <Divider className="mb-4" />

        {users.length === 0 && !refreshing ? (
          <Box className="flex-1 items-center justify-center">
            <Icon as={Users} size="xl" className="mb-2 text-gray-400" />
            <Text className="text-center text-gray-500">
              {userRole === "tutor"
                ? "No students available to chat with in this class"
                : "No tutors available to chat with in this class"}
            </Text>
          </Box>
        ) : (
          <FlatList
            data={filteredUsers}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            contentContainerStyle={{ paddingBottom: 20 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={fetchUsers} />
            }
            ListEmptyComponent={
              searchQuery ? (
                <Box className="items-center justify-center py-10">
                  <Text className="text-center text-gray-500">
                    No {userRole === "tutor" ? "students" : "tutors"} match your
                    search
                  </Text>
                </Box>
              ) : null
            }
          />
        )}

        {refreshing && (
          <Box className="absolute inset-0 items-center justify-center bg-black/5">
            <Spinner size="large" />
          </Box>
        )}
      </Box>
    </SafeAreaView>
  );
};

export default MessageList;
