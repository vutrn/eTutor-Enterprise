import { NavigationProp, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Divider, IconButton, Menu, Text, TextInput } from "react-native-paper";
import { useAuthStore } from "../../store/useAuthStore";
import { useBlogStore } from "../../store/useBlogStore";
import { useUserStore } from "../../store/useUserStore";
import { FONTS } from "../../utils/constant";
import alert from "../alert";

const BlogDetail = () => {
  const { authUser } = useAuthStore();
  const { users, getUsers } = useUserStore();
  const {
    selectedBlog,
    setSelectedBlog,
    commentBlog,
    getAllBlogs,
    deleteBlog,
  } = useBlogStore();
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    getUsers();
  }, []);

  const isAuthor = selectedBlog?.author?._id === authUser?._id;

  const handleSendComment = async (text: string) => {
    if (text.trim()) {
      await commentBlog(text);
      setText("");
    }
  };

  const handleDeleteBlog = async (selectedBlogId: string) => {
    await deleteBlog(selectedBlogId);
    navigation.goBack();
  };

  const getUserNameById = (userId: string) => {
    const selectedUser = users.find((user) => user._id === userId);
    return selectedUser ? selectedUser.username : "Unknown";
  };

  const getRoleById = (userId: string) => {
    const selectedUser = users.find((user) => user._id === userId);
    return selectedUser
      ? selectedUser.role.charAt(0).toUpperCase() + selectedUser.role.slice(1)
      : "Unknown role";
  };

  return (
    <ScrollView style={styles.container}>
      {/* NHỚ WRAP IMAGE TRONG TEXT */}
      <Text>
        {selectedBlog?.image && (
          <Image
            source={{ uri: selectedBlog.image }}
            style={styles.image}
            resizeMode="contain"
          />
        )}
      </Text>

      <View style={styles.titleContainer}>
        {/* TITLE */}
        <Text style={styles.title} variant="titleLarge">
          {selectedBlog?.title}
        </Text>

        {/* Nếu tác giả là người dùng đăng nhập thì hiện menu */}
        {isAuthor && (
          <Menu
            visible={visible}
            onDismiss={() => setVisible(false)}
            anchor={
              <IconButton
                icon="dots-vertical"
                onPress={() => {
                  setVisible(true);
                }}
                size={20}
              />
            }
          >
            <Menu.Item
              title="Update"
              leadingIcon="pencil"
              onPress={() => {
                setVisible(false);
                navigation.navigate("blog_update");
              }}
            />
            <Menu.Item
              titleStyle={{ color: "red" }}
              title="DELETE"
              leadingIcon="delete"
              onPress={() => {
                setVisible(false);
                alert("WARNING", "This action cannot be undone", [
                  {
                    text: "Cancel",
                    style: "cancel",
                    onPress: () => {},
                  },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                      handleDeleteBlog(selectedBlog._id);
                    },
                  },
                ]);
              }}
            />
          </Menu>
        )}
      </View>

      <View>
        {/* AUTHOR name */}
        <Text variant="bodyMedium" style={styles.author}>
          By:{" "}
          {selectedBlog?.author
            ? selectedBlog.author.username
            : "Unknown author"}
        </Text>
        <Text style={styles.date}>
          Published on:{" "}
          {format(new Date(selectedBlog?.createdAt), "hh:mm MMMM dd, yyyy") ||
            "Date not available"}
        </Text>
      </View>
      <Text style={styles.content}>{selectedBlog?.content}</Text>

      <Divider />

      <View style={styles.inputContainer}>
        <TextInput
          value={text}
          mode="outlined"
          onChangeText={(text) => setText(text)}
          style={styles.input}
          label="Add a comment..."
          onKeyPress={(e) => {
            if (e.nativeEvent.key === "Enter") handleSendComment(text);
          }}
        />
        <IconButton
          icon="send"
          size={24}
          onPress={() => {
            handleSendComment(text);
          }}
        />
      </View>

      {/* Comments */}
      {selectedBlog?.comments && selectedBlog?.comments.length > 0 && (
        <View style={styles.commentsContainer}>
          {/* hiển thị số lượng comment */}
          <Text style={styles.commentsHeader}>
            Comments ({selectedBlog?.comments.length}):
          </Text>

          {/* toReverse -> comment mới nhất đẩy lên trên cùng */}
          {selectedBlog?.comments.toReversed().map((comment: any) => (
            <View key={comment._id} style={styles.comment}>
              <View style={styles.commentContent}>
                {/* tên user */}
                <Text style={styles.commentUser}>
                  {getUserNameById(comment.user)
                    ? `${getUserNameById(comment.user)} (${getRoleById(comment.user)})`
                    : "Unknown"}
                  :
                </Text>
                {/* comment */}
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
              {/* ngày giờ comment */}
              <Text style={styles.commentDate}>
                {format(new Date(comment.createdAt), "hh:mm MMMM dd, yyyy")}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
  },
  listContainer: {
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontFamily: FONTS.bold,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 4,
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: FONTS.regular,
  },
  author: {
    fontSize: 14,
    color: "#555",
    marginBottom: 4,
    fontFamily: FONTS.regular,
  },
  date: {
    fontSize: 14,
    color: "#666",
    fontFamily: FONTS.light,
    textAlign: "right",
    fontStyle: "italic",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 16,
  },
  input: {
    flex: 1,
    margin: 10,
  },
  commentsContainer: {
    marginTop: 16,
    paddingTop: 8,
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
    fontSize: 14,
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
    marginLeft: 4,
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

export default BlogDetail;
