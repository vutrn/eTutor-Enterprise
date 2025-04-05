import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon, TrashIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import alert from "../../../components/alert";
import { useUserStore } from "../../../store/useUserStore";
import { IUserState } from "@/src/types/store";

const StudentList = () => {
  const { students, getUsers, deleteUser } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getUsers();
    setIsRefreshing(false);
  }, []);

  const handleDeleteUser = (item: string) => {
    alert("Delete User", "Are you sure you want to delete this user?", [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {},
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteUser(item);
          onRefresh();
        },
      },
    ]);
  };

  const filteredStudents = students.filter(
    (student) =>
      student.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({ item }: { item: IUserState["students"][number] }) => (
    <Box className="mb-3 rounded-md bg-white p-4 shadow">
      <HStack className="items-center justify-between">
        <HStack className="flex-1 items-center space-x-3">
          <Avatar size="md">
            <AvatarFallbackText>{item.username[0]}</AvatarFallbackText>
          </Avatar>
          <VStack className="flex-1 space-y-1">
            <Text className="text-base font-bold">{item.username}</Text>
            <Text className="text-sm text-gray-600">{item.email}</Text>
          </VStack>
        </HStack>
        <Pressable onPress={() => handleDeleteUser(item._id)}>
          <Icon as={TrashIcon} className="text-red-500" size={"xl"} />
        </Pressable>
      </HStack>
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Box className="flex-1 bg-background-50 p-4">
        <Input variant="outline" size="md" className="mb-4">
          <InputSlot className="pl-3">
            <InputIcon>
              <Icon as={Feather} size="sm" color="$gray500" />
            </InputIcon>
          </InputSlot>
          <InputField
            placeholder="Search students..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>

        <Divider className="mb-4" />

        {filteredStudents.length > 0 ? (
          <FlatList
            data={filteredStudents}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Box className="flex-1 items-center justify-center">
            <Text className="text-base text-gray-500">No students found</Text>
          </Box>
        )}
      </Box>
    </SafeAreaView>
  );
};

export default StudentList;
