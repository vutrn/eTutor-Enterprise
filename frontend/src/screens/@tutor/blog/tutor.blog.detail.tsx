import { Image, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { Divider, Text } from "react-native-paper";
import { FONTS } from "../../../utils/constant";
import { useUserStore } from "../../../store/useUserStore";
import { useBlogStore } from "../../../store/useBlogStore";
import { formatDate } from "date-fns";

const TutorBlogDetail = () => {
  const { users, getUsers } = useUserStore();
  const { selectedBlog } = useBlogStore();

  useEffect(() => {
    getUsers();
  }, []);

  const getUserNameById = (userId: string) => {
    const selectedUser = users.find((user) => user._id === userId);
    return selectedUser ? selectedUser.username : "Unknown";
  };

  const getRoleById = (userId: string) => {
    const selectedUser = users.find((user) => user._id === userId);
    return selectedUser ? selectedUser.role : "Unknown role";
  };
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };
  return (
    <View>
      {selectedBlog.image && <Image source={{ uri: selectedBlog.image }} style={styles.image} resizeMode="cover" />}
      <Text style={styles.title}>{selectedBlog.title}</Text>
      <Text style={styles.author}>By: {selectedBlog.author ? selectedBlog.author.username : "Unknown author"}</Text>
      <Text style={styles.content}>{selectedBlog.content}</Text>
      <Text style={styles.date}>
        Published: {selectedBlog.createdAt ? formatDate(selectedBlog.createdAt) : "Date not available"}
      </Text>

      <Divider />
      
      {selectedBlog.comments && selectedBlog.comments.length > 0 && (
        <View style={styles.commentsContainer}>
          <Text style={styles.commentsHeader}>Comments ({selectedBlog.comments.length}):</Text>
          {selectedBlog.comments.map((comment: any) => (
            <View key={comment._id} style={styles.comment}>
              <View style={styles.commentContent}>
                <Text style={styles.commentUser}>
                  {getUserNameById(comment.user)
                    ? `${getUserNameById(comment.user)} (${getRoleById(comment.user)})`
                    : ""}
                  :
                </Text>
                <Text style={styles.commentText}>{comment.text}</Text>
              </View>
              <Text style={styles.commentDate}>{comment.createdAt ? formatDate(comment.createdAt) : ""}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default TutorBlogDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 15,
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
    marginBottom: 8,
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
