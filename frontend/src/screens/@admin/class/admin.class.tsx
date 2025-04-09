import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import alert from "../../../components/alert";
import { useClassStore } from "../../../store/useClassStore";
import CreateModal from "./create.class.modal";
import ClassDetails from "./details.class";
import UpdateModal from "./update.class.modal";
import {
  BookOpen,
  Edit2,
  InfoIcon,
  Plus,
  Search,
  Trash2,
} from "lucide-react-native";

const AdminClass = () => {
  const { selectedClass, setSelectedClass } = useClassStore();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { classes, loading, getClasses, deleteClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setRefreshing(true);
    await getClasses();
    setRefreshing(false);
  };

  const handleDeleteClass = (classId: string, className: string) => {
    alert("Delete Class", `Are you sure you want to delete ${className}?`, [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {},
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteClass(classId);
          loadClasses();
        },
      },
    ]);
  };

  const handleEditClass = (classData: any) => {
    setSelectedClass(classData);
    setUpdateModalVisible(true);
  };

  const handleViewDetails = (classData: string) => {
    setSelectedClass(classData);
    setDetailsVisible(true);
  };

  const filteredClasses = useMemo(
    () =>
      classes.filter((cls: any) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [classes, searchQuery],
  );

  const renderClassItem = ({ item }: { item: any }) => (
    <Box className="mb-3 rounded-md bg-white p-4 shadow">
      <HStack className="items-center justify-between">
        <VStack className="flex-1 space-y-1">
          <Text className="text-lg font-semibold">{item.name}</Text>
          <HStack className="space-x-2">
            <Badge variant="outline" className="px-2">
              <Text className="text-xs">
                Tutor: {item.tutor?.username || "Unknown"}
              </Text>
            </Badge>
            <Badge variant="outline" className="px-2">
              <Text className="text-xs">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </Badge>
          </HStack>
        </VStack>

        <HStack className="space-x-2">
          <Pressable onPress={() => handleViewDetails(item)} hitSlop={8}>
            <Icon as={InfoIcon} size="lg" className="text-blue-500" />
          </Pressable>
          <Pressable onPress={() => handleEditClass(item)} hitSlop={8}>
            <Icon as={Edit2} size="lg" className="text-blue-500" />
          </Pressable>
          <Pressable onPress={() => handleDeleteClass(item._id, item.name)}>
            <Icon as={Trash2} size="lg" className="text-red-500" />
          </Pressable>
        </HStack>
      </HStack>
    </Box>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f5f5f5" }}>
      <Box className="flex-1 bg-background-50 p-4">
        <CreateModal
          modalVisible={createModalVisible}
          setModalVisible={setCreateModalVisible}
        />
        {selectedClass && (
          <UpdateModal
            modalVisible={updateModalVisible}
            setModalVisible={setUpdateModalVisible}
          />
        )}
        {selectedClass && (
          <ClassDetails
            modalVisible={detailsModalVisible}
            setModalVisible={setDetailsVisible}
          />
        )}

        <VStack className="space-y-4">
          <HStack className="items-center justify-between">
            <VStack>
              <Heading size="2xl">Classes</Heading>
              <Text className="text-gray-600">
                Total Classes: {classes.length}
              </Text>
            </VStack>

            <Button
              size="sm"
              onPress={() => setCreateModalVisible(true)}
              action="primary"
            >
              <ButtonText>Create Class</ButtonText>
              <ButtonIcon as={Plus} />
            </Button>
          </HStack>

          <Input variant="outline" size="md" className="mb-4">
            <InputSlot className="pl-3">
              <InputIcon>
                <Icon as={Search} size="sm" className="text-gray-500" />
              </InputIcon>
            </InputSlot>
            <InputField
              placeholder="Search by class name"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </Input>

          <Divider />

          {filteredClasses.length > 0 ? (
            <FlatList
              data={filteredClasses}
              keyExtractor={(item) => item._id}
              renderItem={renderClassItem}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={loadClasses}
                />
              }
            />
          ) : (
            <Box className="flex-1 items-center justify-center py-8">
              <Icon as={BookOpen} size="xl" className="mb-2 text-gray-400" />
              <Text className="text-base text-gray-500">
                No classes available
              </Text>
            </Box>
          )}
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default AdminClass;
