import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, IconButton, Text } from "react-native-paper";
import { useBlogStore } from "../../../store/useBlogStore";
import { useUserStore } from "../../../store/useUserStore";
import { FONTS } from "../../../utils/constant";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import { SafeAreaView } from "react-native-safe-area-context";
import { get } from "lodash";

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
    return (
      <Card
        style={styles.card}
        onPress={() => {
          handleSelectBlog(item);
        }}
      >
        <Card.Title
          titleStyle={styles.title}
          title={item.title ? item.title : "Untitled"}
          right={() => <IconButton icon="arrow-right" />}
        />
        <Card.Content>
          <Text numberOfLines={1} style={styles.content}>
            {item.content ? item.content : "No content available"}
          </Text>
          <Text style={styles.author}>
            By: {item.author ? item.author.username : "Unknown author"}
          </Text>
          <Text style={styles.date}>
            Published: {format(new Date(item.createdAt), "MMMM dd, yyyy") || "Date not available"}
          </Text>
        </Card.Content>
      </Card>
    );
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
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: FONTS.bold,
    // borderWidth: 1,
    // borderColor: "#ddd",
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 4,
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    marginBottom: 12,
    fontFamily: FONTS.regular,
    // borderWidth: 1,
    // borderColor: "#ddd",
  },
  author: {
    fontSize: 14,
    color: "#555",
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.light,
    textAlign: "right",
    fontStyle: "italic",
  },
  commentsContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  commentsHeader: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    marginBottom: 8,
  },
  comment: {
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 4,
    marginBottom: 6,
  },
  commentContent: {
    flexDirection: "row",
  },
  commentUser: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  commentRole: {
    fontSize: 12,
    fontFamily: FONTS.light,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: "lightgreen",
    borderColor: "white",
    padding: 2,
  },
  commentText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  commentDate: {
    fontSize: 12,
    fontFamily: FONTS.light,
    color: "#777",
    textAlign: "right",
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
