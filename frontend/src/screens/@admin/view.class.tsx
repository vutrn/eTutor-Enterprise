import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { useClassStore } from "../../store/useClassStore";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import alert from "../../components/alert";
import Toast from "react-native-toast-message";

/**
 * ViewClass component for displaying all the classes in the system
 * Allows administrators to view class details, edit classes, and delete classes
 */
const ViewClass = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { classes, loading, getClasses, deleteClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setRefreshing(true);
    try {
      await getClasses();
    } catch (error) {
      console.error("Failed to load classes:", error);
      Alert.alert("Error", "Failed to load classes. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    loadClasses();
  }, []);

  const handleDeleteClass = (classId: string, className: string) => {
    alert("Delete Class", `Are you sure you want to delete ${className}?`, [
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {},
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteClass(classId);
            // Reload the class list after deletion
            await loadClasses();
          } catch (error) {
            console.error("Failed to delete class:", error);
            Toast.show({
              type: "error",
              text1: "Error",
              text2: "Failed to delete class. Please try again.",
            });
          }
        },
      },
    ]);
  };

  // Render each class item
  const renderClassItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.className}>{item.name}</Text>
        <View style={styles.actionButtons}>
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
          <Text style={styles.userName}>
            {item.tutor?.username || "Unknown"}
          </Text>
          <Text style={styles.userEmail}>
            {item.tutor?.email || "No email"}
          </Text>
        </View>
      </View>

      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>
          Students ({item.students?.length || 0}):
        </Text>
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
      {/* Header with title and refresh button */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Classes</Text>
        <TouchableOpacity onPress={onRefresh} style={styles.refreshButton}>
          <Feather name="refresh-cw" size={20} color="#1890ff" />
        </TouchableOpacity>
      </View>

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
          // Add RefreshControl for pull-to-refresh functionality
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#1890ff"]}
              tintColor="#1890ff"
            />
          }
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
  // New style for header container with refresh button
  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 10,
    position: "relative",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  // New style for refresh button
  refreshButton: {
    position: "absolute",
    right: 0,
    padding: 8,
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
    borderRadius: 8,
  },
  createButtonText: {
    color: "white",
    padding: 10,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
