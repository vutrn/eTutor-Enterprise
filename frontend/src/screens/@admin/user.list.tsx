import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";
import { AddIcon, Icon, SearchIcon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Text } from "@/components/ui/text";
import { useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { RefreshCcw, Trash2, UserX } from "lucide-react-native";
import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import alert from "../../components/alert";
import CreateUserModal from "../../components/user/CreateUserModal";
import { useUserStore } from "../../store/useUserStore";

const UserList = () => {
  const { getUsers, deleteUser, users } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    getUsers();
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

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Box className="flex-1 bg-background-50 p-4">
        <HStack className="mb-4 items-center justify-between">
          <Button onPress={() => setIsCreateUserModalOpen(true)}>
            <ButtonText>Add User</ButtonText>
            <ButtonIcon as={AddIcon} size="sm" />
          </Button>
        </HStack>

        <HStack className="mb-4 items-center space-x-2">
          <Input variant="outline" size="md" className="flex-1">
            <InputField
              placeholder="Search users..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <InputSlot className="pl-3">
              <InputIcon>
                <Icon as={SearchIcon} />
              </InputIcon>
            </InputSlot>
          </Input>
          <Pressable
            className="items-center rounded-md bg-gray-200 p-2.5"
            onPress={onRefresh}
          >
            <Icon as={RefreshCcw} size="sm" />
          </Pressable>
        </HStack>

        <Box className="mb-4 overflow-hidden rounded-md border border-gray-200 bg-white">
          <ScrollView horizontal className="w-full">
            <Table className="min-w-full">
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="py-3 text-center">
                    <Text className="font-bold">#</Text>
                  </TableHead>

                  <TableHead className="py-3">
                    <Text className="font-bold">Username</Text>
                  </TableHead>

                  <TableHead className="py-3">
                    <Text className="font-bold">Email</Text>
                  </TableHead>

                  <TableHead className="py-3">
                    <Text className="font-bold">Role</Text>
                  </TableHead>

                  <TableHead className="py-3">
                    <Text className="font-bold">Created At</Text>
                  </TableHead>

                  <TableHead className="py-3 text-center">
                    <Text className="font-bold">Actions</Text>
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <TableRow
                      key={user._id}
                      className="border-t border-gray-100"
                    >
                      <TableData className="py-3 text-center">
                        <Text>{index + 1}</Text>
                      </TableData>

                      <TableData className="py-3">
                        <HStack className="items-center space-x-2">
                          <Avatar size="sm" className="bg-primary-100">
                            <AvatarFallbackText>
                              {user.username[0]}
                            </AvatarFallbackText>
                          </Avatar>
                          <Text className="font-medium">{user.username}</Text>
                        </HStack>
                      </TableData>

                      <TableData className="py-3">
                        <Text>{user.email}</Text>
                      </TableData>

                      <TableData className="py-3">
                        <Box
                          className={`w-fit rounded-full px-3 py-1 ${
                            user.role === "admin"
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "tutor"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                          }`}
                        >
                          <Text className="text-xs font-medium">
                            {user.role.charAt(0).toUpperCase() +
                              user.role.slice(1)}
                          </Text>
                        </Box>
                      </TableData>

                      <TableData className="py-3">
                        <Text className="text-gray-600">
                          {format(new Date(user.createdAt), "dd/MM/yyyy")}
                        </Text>
                      </TableData>

                      <TableData className="py-3">
                        <HStack className="items-center justify-center space-x-2">
                          <Pressable
                            className="rounded-full bg-gray-100 p-2"
                            onPress={() => handleDeleteUser(user._id)}
                          >
                            <Icon
                              as={Trash2}
                              size="sm"
                              className="text-red-500"
                            />
                          </Pressable>
                        </HStack>
                      </TableData>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableData className="py-8 text-center">
                      <Box className="mx-auto w-fit">
                        <Icon
                          as={UserX}
                          size="xl"
                          className="mx-auto mb-2 text-gray-400"
                        />
                        <Text className="text-gray-500">
                          {searchQuery
                            ? "No users match your search"
                            : "No users found"}
                        </Text>
                        <Pressable
                          className="mx-auto mt-2 rounded-md bg-primary-100 px-4 py-2"
                          onPress={onRefresh}
                        >
                          <HStack className="items-center justify-center space-x-2">
                            <Icon
                              as={RefreshCcw}
                              size="sm"
                              className="text-primary-600"
                            />
                            <Text className="text-primary-600">Refresh</Text>
                          </HStack>
                        </Pressable>
                      </Box>
                    </TableData>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollView>
        </Box>

        {isRefreshing && (
          <Box className="absolute inset-0 flex items-center justify-center bg-black/10">
            <Box className="rounded-lg bg-white p-4 shadow-md">
              <Spinner color="#4F46E5" />
              <Text className="mt-2">Loading users...</Text>
            </Box>
          </Box>
        )}

        {/* Create User Modal */}
        <CreateUserModal
          isOpen={isCreateUserModalOpen}
          onClose={() => {
            setIsCreateUserModalOpen(false);
            onRefresh();
          }}
        />
      </Box>
    </SafeAreaView>
  );
};

export default UserList;
