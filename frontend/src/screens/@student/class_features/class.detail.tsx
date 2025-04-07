import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { format } from "date-fns";
import { Calendar, GraduationCap, User, Users } from "lucide-react-native";
import React, { useEffect } from "react";
import { FlatList, SafeAreaView } from "react-native";
import { useClassStore } from "../../../store/useClassStore";
import { useDashboardStore } from "../../../store/useDashboadStore";
import { useUserStore } from "../../../store/useUserStore";

const StudentClassDetail = () => {
  const { getDashboard } = useDashboardStore();
  const { getUsers } = useUserStore();
  const { selectedClass } = useClassStore();

  useEffect(() => {
    const loadData = async () => {
      await getDashboard();
      await getUsers();
    };
    loadData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Box className="flex-1 p-4">
        <VStack space="lg" className="mb-6">
          <Heading size="xl" className="text-center">Class Details</Heading>
          
          <Card variant="elevated" className="bg-white p-6 shadow-md">
            <VStack space="md">
              <HStack className="items-center space-x-4">
                <Avatar size="lg" className="bg-primary-600">
                  <AvatarFallbackText>{selectedClass.name.substring(0, 2).toUpperCase()}</AvatarFallbackText>
                </Avatar>
                <VStack>
                  <Text className="text-sm text-gray-600">Class Name</Text>
                  <Heading size="md">{selectedClass.name}</Heading>
                </VStack>
              </HStack>
              
              <Divider />
              
              <HStack className="flex-wrap justify-between">
                <VStack className="mb-2">
                  <HStack className="items-center space-x-2 mb-1">
                    <Icon as={Users} size="sm" className="text-blue-600" />
                    <Text className="text-gray-600 font-medium">Students</Text>
                  </HStack>
                  <Text className="text-lg font-bold pl-7">{selectedClass.students.length}</Text>
                </VStack>
                
                <VStack className="mb-2">
                  <HStack className="items-center space-x-2 mb-1">
                    <Icon as={GraduationCap} size="sm" className="text-green-600" />
                    <Text className="text-gray-600 font-medium">Tutor</Text>
                  </HStack>
                  <Text className="text-lg font-bold pl-7">{selectedClass.tutor.username}</Text>
                </VStack>
                
                <VStack className="mb-2">
                  <HStack className="items-center space-x-2 mb-1">
                    <Icon as={Calendar} size="sm" className="text-amber-600" />
                    <Text className="text-gray-600 font-medium">Created On</Text>
                  </HStack>
                  <Text className="text-lg font-bold pl-7">
                    {format(new Date(selectedClass.createdAt), "MMM d, yyyy")}
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Card>
          
          <Card variant="elevated" className="bg-white p-6 shadow-md">
            <VStack space="sm">
              <HStack className="items-center space-x-2 mb-2">
                <Icon as={Users} size="sm" className="text-primary-600" />
                <Heading size="sm">Student List</Heading>
              </HStack>
              
              {selectedClass.students.length > 0 ? (
                <FlatList
                  data={selectedClass.students}
                  keyExtractor={(item) => item._id}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <HStack className="items-center py-3 border-b border-gray-100">
                      <Avatar size="sm" className="bg-gray-200 mr-3">
                        <AvatarFallbackText>{item.username.charAt(0).toUpperCase()}</AvatarFallbackText>
                      </Avatar>
                      <VStack>
                        <Text className="font-medium">{item.username}</Text>
                        {item.email && (
                          <Text className="text-xs text-gray-500">{item.email}</Text>
                        )}
                      </VStack>
                      <Box className="ml-auto">
                        <Badge className="bg-blue-100">
                          <Text className="text-xs text-blue-600">Student</Text>
                        </Badge>
                      </Box>
                    </HStack>
                  )}
                />
              ) : (
                <Box className="items-center py-8">
                  <Icon as={User} size="lg" className="text-gray-300 mb-2" />
                  <Text className="text-gray-500 text-center">No students enrolled</Text>
                </Box>
              )}
            </VStack>
          </Card>
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default StudentClassDetail;