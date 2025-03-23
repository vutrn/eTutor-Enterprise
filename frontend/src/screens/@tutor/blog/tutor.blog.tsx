import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { useBlogStore } from "../../../store/useBlogStore";
import { useUserStore } from "../../../store/useUserStore";
import { FONTS } from "../../../utils/constant";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { get } from "lodash";
import BlogCard from "../../../components/BlogCard";

const TutorBlog = () => {
  const { blogs, getAllBlogs, setSelectedBlog, createBlog } = useBlogStore();
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
    navigation.navigate("tutor_blog_detail");
  };

  const renderItem = ({ item }: any) => {
    return <BlogCard blog={item} onPress={handleSelectBlog} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        style={styles.icon}
        size={50}
        icon="plus"
        mode="contained"
        onPress={() => navigation.navigate("tutor_blog_create")}
      />
      <FlatList
        data={blogs}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchData}
        refreshing={refreshing}
        ListEmptyComponent={<Text style={styles.emptyText}>No blogs available</Text>}
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

export default TutorBlog;
