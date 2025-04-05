import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBlogStore } from "../../store/useBlogStore";
import BlogCard from "../BlogCard";

const BlogList = () => {
  const { blogs, getAllBlogs, setSelectedBlog } = useBlogStore();
  const [refreshing, setRefreshing] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    await getAllBlogs();
    setRefreshing(false);
  };

  const handleSelectBlog = (item: any) => {
    setSelectedBlog(item);
    navigation.navigate("blog_detail");
  };

  const renderItem = ({ item }: any) => {
    return <BlogCard blog={item} onPress={handleSelectBlog} />;
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="mt-4 flex-row items-center justify-between px-4">
        <Text className="text-2xl font-bold text-gray-800">Blog</Text>
        <Button
          mode="contained"
          buttonColor="#1d00fc"
          onPress={() => navigation.navigate("blog_create")}
        >
          Post Blog
        </Button>
      </View>

      <FlatList
        data={blogs}
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
    </SafeAreaView>
  );
};

export default BlogList;
