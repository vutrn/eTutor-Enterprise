import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClassStore } from "../../store/useClassStore";
import { useUserStore } from "../../store/useUserStore";
import { FONTS } from "../../utils/constant";

const StudentClass = () => {
  const { classes, getClasses, setSelectedClass } = useClassStore();
  const { tutors, getUsers } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchData();
    console.log("tutors", tutors);
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    await getClasses();
    await getUsers();
    setRefreshing(false);
  };

  const handleClassSelect = (item: any) => {
    setSelectedClass(item);
    navigation.navigate("student_feature_stack");
  };

  const renderItem = ({ item }: any) => {
    return (
      <Card style={styles.card} onPress={() => handleClassSelect(item)}>
        <Card.Content>
          <Text style={styles.className}>{item.name}</Text>
          <Text style={styles.tutorName}>Teacher: {item.tutor.username}</Text>
          <Text style={styles.studentCount}>Students: {item.students.length}</Text>
          <Text style={styles.classDate}>
            Created: {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => handleClassSelect(item)}>
            Enter Class
          </Button>
        </Card.Actions>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={classes}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={fetchData}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No classes available</Text>
            <Button mode="contained" onPress={fetchData} style={styles.refreshButton}>
              Refresh
            </Button>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  className: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  tutorName: {
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
  studentCount: {
    fontFamily: FONTS.regular,
    fontSize: 14,
  },
  classDate: {
    fontFamily: FONTS.light,
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  refreshButton: {
    marginTop: 8,
  },
});

export default StudentClass;