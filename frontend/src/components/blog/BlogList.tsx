import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBlogStore } from "../../store/useBlogStore";
import { FONTS } from "../../utils/constant";
import BlogCard from "../BlogCard";
import { useDashboardStore } from "@/src/store/useDashboadStore";

const BlogList = () => {
  const { blogs, getAllBlogs, setSelectedBlog } = useBlogStore();
  const { getDashboard } = useDashboardStore();
  const [refreshing, setRefreshing] = useState(false);
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

  // renderItem dùng cho FlatList tạo từng item trong mảng blogs
  const renderItem = ({ item }: any) => {
    return <BlogCard blog={item} onPress={handleSelectBlog} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* icon tạo blog góc dưới */}
      {/* thay bằng button thông thường */}
      <IconButton
        style={styles.icon}
        size={50}
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate("blog_create")}
      />
      <FlatList
        data={blogs}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchData}
        refreshing={refreshing}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No blogs available</Text>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  icon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyText: {
    textAlign: "center",
    fontFamily: FONTS.regular,
    fontSize: 16,
    marginTop: 20,
    color: "#666",
  },
});

export default BlogList;
