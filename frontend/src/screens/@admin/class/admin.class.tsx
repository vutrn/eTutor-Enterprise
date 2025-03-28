import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Text, Button } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import alert from "../../../components/alert";
import { useClassStore } from "../../../store/useClassStore";
import CreateModal from "./create.class.modal";
import UpdateModal from "./update.class.modal";
import ClassDetails from "./details.class";

import { ScrollView } from "react-native-gesture-handler";

const { width } = Dimensions.get("window");

const AdminClass = () => {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const { classes, loading, getClasses, deleteClass, getClassDetails, selectedClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    loadClasses();
  }, []);

  const loadClasses = async () => {
    setRefreshing(true);
    await getClasses();
    setRefreshing(false);
  };

  const handleDeleteClass = (classId: string, className: string) => {
    alert("Delete Class", `Are you sure you want to delete ${className}?`, [
      { text: "Cancel", style: "cancel", onPress: () => { } },
      {
        text: "Delete", style: "destructive", onPress: async () => {
          await deleteClass(classId);
          loadClasses();
        }
      },
    ]);
  };

  const handleEditClass = (classData: any) => {
    setSelectedClassId(classData._id);
    setUpdateModalVisible(true);
  };

  const handleViewDetails = async (classId: string) => {
    setSelectedClassId(classId);
    await getClassDetails(classId); 
    setDetailsVisible(true);
  };

  const renderClassItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.cell}>
        {item.tutor?.username || "Unknown"}{" "}
        <Text style={styles.userEmail}>({item.tutor?.email || "No email"})</Text>
      </Text>
      <Text style={styles.cell}>{item.students?.length || 0}</Text>

      <View style={styles.cell}>
        {item.students && item.students.length > 0 ? (
          item.students.slice(0, 2).map((student: any) => (
            <Text key={student._id} style={styles.studentItem}>
              {student.username}
            </Text>
          ))
        ) : (
          <Text style={styles.emptyText}>No students</Text>
        )}
      </View>
      <View style={[styles.cell, styles.actionButtons]}>
        <TouchableOpacity onPress={() => handleViewDetails(item._id)}>
          <Feather name="info" size={25} color="#1890ff" />
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => handleEditClass(item)} style={{ marginLeft: 10 }}>
          <Feather name="edit" size={25} color="#1890ff" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleDeleteClass(item._id, item.name)} style={{ marginLeft: 10 }}>
          <Feather name="trash-2" size={25} color="#ff4d4f" />
        </TouchableOpacity>

      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <IconButton style={styles.icon} size={50} icon="plus" mode="contained" onPress={() => setCreateModalVisible(true)} />
      <CreateModal modalVisible={createModalVisible} setModalVisible={setCreateModalVisible} />
      {selectedClass && <UpdateModal modalVisible={updateModalVisible} setModalVisible={setUpdateModalVisible} classData={selectedClass} />}
      {selectedClassId && (
        <ClassDetails
          modalVisible={detailsModalVisible}
          setModalVisible={setDetailsVisible}
          classId={selectedClassId}
        />
      )}

      <Text style={styles.totalClassesText}>Total Classes: {classes.length}</Text>

      <ScrollView>
        <View style={styles.tableContainer}>
          {classes.length > 0 ? (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Class Name</Text>
                <Text style={styles.headerCell}>Tutor</Text>
                <Text style={styles.headerCell}>Number of Students</Text>
                <Text style={styles.headerCell}>Students</Text>
                <Text style={styles.headerCell}>Actions</Text>
              </View>

              <FlatList
                data={classes}
                keyExtractor={(item) => item._id}
                renderItem={renderClassItem}
                refreshing={refreshing}
                onRefresh={loadClasses}
              />
            </>
          ) : (
            <Text>No classes available</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  icon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
  totalClassesText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#333",
    paddingBottom: 10,
    marginBottom: 8,
  },
  className: {
    flex: 1,
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#333",
    fontSize: 20,
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 16,
  },
  userEmail: {
    color: "#666",
    fontSize: 12,
  },
  studentItem: {
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    padding: 5,
    borderRadius: 4,
    marginTop: 2,
  },
  emptyText: {
    fontSize: 12,
    color: "#888",
  },
  actionButtons: {
    flexDirection: "row",
  },
  detailButton: {
    marginTop: 5,
    backgroundColor: "#007bff",
  },
});

export default AdminClass;
