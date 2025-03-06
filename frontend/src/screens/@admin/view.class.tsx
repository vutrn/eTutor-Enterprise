import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useClassStore } from "../../store/useClassStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";

/**
 * ViewClass component for displaying all the classes in the system
 * Allows administrators to view class details, edit classes, and delete classes
 */
const ViewClass = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { classes, loading, getClasses, deleteClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);

  // Fetch classes when component mounts
  useEffect(() => {
    loadClasses();
  }, []);

  // Handle refreshing the list
  const loadClasses = async () => {
    setRefreshing(true);
    await getClasses();
    setRefreshing(false);
  };

  // Handle deleting a class
  const handleDeleteClass = (classId: string, className: string) => {
    Alert.alert("Delete Class", `Are you sure you want to delete ${className}?`, [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        onPress: async () => {
          await deleteClass(classId);
        },
        style: "destructive",
      },
    ]);
  };

  // Render each class item
  const renderClassItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.className}>{item.name}</Text>
        <View style={styles.actionButtons}>
          {/* <TouchableOpacity
            style={styles.iconButton}
            onPress={() => navigation.navigate("create_class", { classData: item })}
          >
            <Feather name="edit" size={20} color="#1890ff" />
          </TouchableOpacity> */}

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteClass(item._id, item.name)}
          >
            <Feather name="trash-2" size={20} color="#ff4d4f" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Tutor:</Text>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{item.tutor?.username || "Unknown"}</Text>
          <Text style={styles.userEmail}>{item.tutor?.email || "No email"}</Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Students ({item.students?.length || 0}):</Text>
        {item.students && item.students.length > 0 ? (
          <FlatList
            data={item.students}
            keyExtractor={(student) => student._id}
            scrollEnabled={false}
            renderItem={({ item: student }) => (
              <View style={styles.studentItem}>
                <Text style={styles.userName}>{student.username}</Text>
                <Text style={styles.userEmail}>{student.email}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.emptyText}>No students enrolled yet</Text>
        )}
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1890ff" />
        <Text style={styles.loadingText}>Loading classes...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Classes</Text>

      {classes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="book" size={60} color="#ccc" />
          <Text style={styles.emptyMainText}>No Classes Found</Text>
          <Text style={styles.emptySubText}>Create a class to get started</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate("create_class")}
          >
            <Text style={styles.createButtonText}>Create New Class</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={classes}
          renderItem={renderClassItem}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          refreshing={refreshing}
          onRefresh={loadClasses}
        />
      )}
    </SafeAreaView>
  );
};

export default ViewClass;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 10,
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#888",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 8,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  userInfo: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  userName: {
    fontSize: 15,
    fontWeight: "500",
  },
  userEmail: {
    fontSize: 13,
    color: "#666",
  },
  studentItem: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    fontStyle: "italic",
    padding: 8,
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyMainText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    color: "#333",
  },
  emptySubText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 30,
  },
  createButton: {
    backgroundColor: "#1890ff",
  },
  createButtonText: {
    color: "white",
    padding: 10,
    borderRadius: 8,
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
  },
});
