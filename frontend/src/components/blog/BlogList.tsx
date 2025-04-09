import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { VStack } from "@/components/ui/vstack";
import { useDashboardStore } from "@/src/store/useDashboadStore";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { PlusCircle, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBlogStore } from "../../store/useBlogStore";
import BlogCard from "./BlogCard";

const BlogList = () => {
  const { blogs, getAllBlogs, setSelectedBlog } = useBlogStore();
  const { getDashboard } = useDashboardStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchData();
  }, [navigation]);

  const fetchData = async () => {
    setRefreshing(true);
    await getAllBlogs();
    await getDashboard();
    setRefreshing(false);
  };

  const handleSelectBlog = (item: any) => {
    setSelectedBlog(item);
    navigation.navigate("blog_detail");
  };

  const filteredBlogs = blogs?.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Box className="flex-1 p-3">
        <VStack space="md">
          <HStack className="items-center justify-between p-4">
            <Heading size="xl">Blog Posts</Heading>
            <Button
              size="md"
              action="primary"
              onPress={() => navigation.navigate("blog_create")}
              className="rounded-full"
            >
              <ButtonIcon as={PlusCircle} className="mr-2" />
              <ButtonText>Create Post</ButtonText>
            </Button>
          </HStack>

          <Input
            size="md"
            variant="outline"
            className="my-3 bg-white shadow-sm"
          >
            <InputField
              placeholder="Search blogs..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <InputSlot className="pl-3">
              <InputIcon>
                <Icon as={Search} size="sm" />
              </InputIcon>
            </InputSlot>
          </Input>

          <FlatList
            data={filteredBlogs}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <BlogCard blog={item} onPress={handleSelectBlog} />
            )}
            numColumns={2} // Display 2 cards per row
            contentContainerStyle={{
              paddingBottom: 20,
              paddingHorizontal: 8,
              paddingTop: 8,
            }}
            columnWrapperStyle={{ justifyContent: "space-between" }}
            showsVerticalScrollIndicator={false}
            onRefresh={fetchData}
            refreshing={refreshing}
            ListEmptyComponent={
              <Text className="font-regular mt-5 text-center text-base text-gray-500">
                No blogs available. Create one by clicking the "+" button above.
              </Text>
            }
          />
        </VStack>
      </Box>
    </SafeAreaView>
  );
};

export default BlogList;
