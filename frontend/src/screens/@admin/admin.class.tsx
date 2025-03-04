import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClassStore } from "../../store/useClassStore";
import CreateModal from "./create.class.modal";
import UpdateModal from "./update.class.modal";

const AdminClass = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const { classes, loading, fetchClasses, deleteClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setRefreshing(true);
    await fetchClasses();
    setRefreshing(false);
  };

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

  const handleEditClass = (classData: any) => {
    setSelectedClass(classData);
    setUpdateModalVisible(true);
  };

  const renderClassItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.className}>{item.name}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.iconButton} onPress={() => handleEditClass(item)}>
            <Feather name="edit" size={25} color="#1890ff" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => handleDeleteClass(item._id, item.name)}
          >
            <Feather name="trash-2" size={25} color="#ff4d4f" />
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

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
        style={styles.icon}
        size={50}
        icon="plus"
        mode="contained"
        onPress={() => setCreateModalVisible(true)}
      />
      <CreateModal modalVisible={createModalVisible} setModalVisible={setCreateModalVisible} />
      {selectedClass && (
        <UpdateModal
          modalVisible={updateModalVisible}
          setModalVisible={setUpdateModalVisible}
          classData={selectedClass}
        />
      )}

      {classes.length > 0 ? (
        <FlatList
          data={classes}
          keyExtractor={(item) => item._id}
          renderItem={renderClassItem}
          refreshing={refreshing}
          onRefresh={loadClasses}
        />
      ) : (
        <Text>No classes available</Text>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    position: "relative", // Ensure relative positioning for child absolute elements
  },
  icon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10, // Add z-index to ensure button is clickable
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
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
    color: "#333",
  },
  actionButtons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: 10,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#333",
  },
  userInfo: {
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  userEmail: {
    fontSize: 14,
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
    color: "#888",
  },
});

export default AdminClass;
