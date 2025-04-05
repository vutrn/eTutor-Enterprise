import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, Icon, SearchIcon, TrashIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import alert from "../../../components/alert";
import { useUserStore } from "../../../store/useUserStore";
import { UserCheck } from "lucide-react-native";
import { IUserState } from "@/src/types/store";

const TutorList = () => {
  const { tutors, getUsers, deleteUser } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    getUsers();
    console.log("tutors", tutors);
  }, [getUsers]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await getUsers();
    setIsRefreshing(false);
  }, [getUsers]);

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

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderItem = ({ item }: { item: IUserState["tutors"][number] }) => (
    <Box className="mb-3 rounded-md bg-white p-4 shadow">
      <VStack className="space-y-3">
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
          <Pressable
            onPress={() => handleDeleteUser(item._id)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Icon as={TrashIcon} size="xl" className="text-red-500" />
          </Pressable>
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Box className="flex-1 bg-background-50 p-4">
        <Input variant="outline" size="md" className="mb-4">
          <InputSlot className="pl-3">
            <InputIcon>
              <Icon as={SearchIcon} />
            </InputIcon>
          </InputSlot>
          <InputField
            placeholder="Search tutors or subjects..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </Input>

        <Divider className="mb-4" />

        {filteredTutors.length > 0 ? (
          <FlatList
            data={filteredTutors}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Box className="flex-1 items-center justify-center">
            <Icon as={UserCheck} size="xl" className="mb-2" />
            <Text className="text-base text-gray-500">No tutors found</Text>
          </Box>
        )}
      </Box>
    </SafeAreaView>
  );
};

export default TutorList;
