import React, { useEffect } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Card, Text, Divider } from "react-native-paper";
import { useBlogStore } from "../../store/useBlogStore";
import { FONTS } from "../../utils/constant";

const TutorBlog = () => {
  const { blogs, getAllBlogs } = useBlogStore();

  useEffect(() => {
    getAllBlogs();
    console.log("blogs:", blogs);
  }, []);

  // Format date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const renderItem = ({ item }: any) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.title}>{item.title}</Text>
          <Divider style={styles.divider} />
          <Text style={styles.content}>{item.content}</Text>
          <Text style={styles.date}>Published: {formatDate(item.createdAt)}</Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={blogs}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
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
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: FONTS.bold,
  },
  divider: {
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    fontFamily: FONTS.regular,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.light,
    textAlign: 'right',
    fontStyle: 'italic',
  }
});

export default TutorBlog;