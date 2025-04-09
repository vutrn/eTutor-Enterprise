import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import {
  ArrowRightCircle,
  BookOpen,
  Calendar,
  Search,
  Users,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../store/useAuthStore";
import { useClassStore } from "../../store/useClassStore";

const StudentClass = () => {
  const { classes, getClasses, setSelectedClass } = useClassStore();
  const { authUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    await getClasses();
    setRefreshing(false);
  };

  const handleClassSelect = (item: any) => {
    setSelectedClass(item);
    navigation.navigate("student_navigator");
  };

  const filteredClasses = classes
    .filter((cls: any) =>
      cls.students.some((student: any) => student._id === authUser?._id),
    )
    .filter((cls: any) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Box className="flex-1 p-4">
        <VStack space="lg" className="mb-4">
          <Heading size="xl">My Classes</Heading>

          <Input size="md" variant="outline" className="bg-white shadow-sm">
            <InputField
              placeholder="Search by class name"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <InputSlot className="pl-3">
              <InputIcon>
                <Icon as={Search} size="sm" />
              </InputIcon>
            </InputSlot>
          </Input>
        </VStack>

        <ScrollView
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={fetchData} />
          }
        >
          <Grid
            className="gap-4"
            _extra={{
              className: "grid-cols-12",
            }}
          >
            {filteredClasses.length > 0 ? (
              filteredClasses.map((item: any) => (
                <GridItem
                  key={item._id}
                  _extra={{
                    className: "col-span-12 md:col-span-6 lg:col-span-4",
                  }}
                >
                  <Card
                    variant="elevated"
                    size="md"
                    className="bg-white shadow-md transition-shadow duration-200 hover:shadow-lg"
                  >
                    <VStack space="md">
                      <HStack className="items-center justify-between">
                        <HStack className="items-center space-x-3">
                          <Avatar size="md" className="bg-primary-600">
                            <AvatarFallbackText>
                              {item.name.substring(0, 2).toUpperCase()}
                            </AvatarFallbackText>
                          </Avatar>
                          <VStack>
                            <Text className="text-lg font-bold text-gray-800 line-clamp-1">
                              {item.name}
                            </Text>
                            <Text className="text-sm text-gray-500">
                              Tutor: {item.tutor.username}
                            </Text>
                          </VStack>
                        </HStack>
                      </HStack>

                      <HStack className="flex-wrap gap-2">
                        <Badge className="bg-blue-100">
                          <HStack className="items-center space-x-1 px-2 py-0.5">
                            <Icon
                              as={Users}
                              size="xs"
                              className="text-blue-600"
                            />
                            <Text className="text-xs text-blue-600">
                              {item.students.length} Students
                            </Text>
                          </HStack>
                        </Badge>

                        <Badge className="bg-amber-100">
                          <HStack className="items-center space-x-1 px-2 py-0.5">
                            <Icon
                              as={Calendar}
                              size="xs"
                              className="text-amber-600"
                            />
                            <Text className="text-xs text-amber-600">
                              {format(new Date(item.createdAt), "MMM d, yyyy")}
                            </Text>
                          </HStack>
                        </Badge>
                      </HStack>

                      <Button
                        size="sm"
                        action="primary"
                        className="w-full"
                        onPress={() => handleClassSelect(item)}
                      >
                        <ButtonText>Enter Class</ButtonText>
                        <ButtonIcon as={ArrowRightCircle} className="ml-2" />
                      </Button>
                    </VStack>
                  </Card>
                </GridItem>
              ))
            ) : (
              <GridItem _extra={{ className: "col-span-12" }}>
                <Box className="items-center justify-center rounded-lg bg-white p-8 shadow-sm">
                  <Icon
                    as={BookOpen}
                    size="xl"
                    className="mb-4 text-gray-400"
                  />
                  <Text className="mb-4 text-center text-base text-gray-600">
                    {searchQuery
                      ? "No classes match your search"
                      : "You haven't joined any classes yet"}
                  </Text>
                  <Button onPress={fetchData} className="mt-2">
                    <ButtonText>Refresh</ButtonText>
                  </Button>
                </Box>
              </GridItem>
            )}
          </Grid>
        </ScrollView>

        {refreshing && (
          <Box className="absolute inset-0 items-center justify-center bg-black/5">
            <Spinner size="large" />
          </Box>
        )}
      </Box>
    </SafeAreaView>
  );
};

export default StudentClass;
