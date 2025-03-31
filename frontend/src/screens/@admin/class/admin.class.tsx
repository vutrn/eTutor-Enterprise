import React, { useEffect, useState, useMemo } from "react";
import {
  Dimensions,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import alert from "../../../components/alert";
import { useClassStore } from "../../../store/useClassStore";
import CreateModal from "./create.class.modal";
import UpdateModal from "./update.class.modal";
import ClassDetails from "./details.class";

const { width } = Dimensions.get("window");

const AdminClass = () => {
  const { selectedClass, setSelectedClass } = useClassStore();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { classes, loading, getClasses, deleteClass } = useClassStore();
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
      {
        text: "Cancel",
        style: "cancel",
        onPress: () => {},
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteClass(classId);
          loadClasses();
        },
      },
    ]);
  };

  const handleEditClass = (classData: any) => {
    setSelectedClass(classData);
    setUpdateModalVisible(true);
  };

  const handleViewDetails = (classData: string) => {
    setSelectedClass(classData);
    setDetailsVisible(true);
  };

  const filteredClasses = useMemo(
    () =>
      classes.filter((cls: any) =>
        cls.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [classes, searchQuery]
  );

  const renderClassItem = ({ item }: { item: any }) => (
    <View style={styles.row}>
      <Text style={styles.className}>{item.name}</Text>
      <Text style={styles.cell}>{item.tutor?.username || "Unknown"}</Text>
      <Text style={styles.cell}>
        {new Date(item.createdAt).toLocaleDateString()}
      </Text>
      <View style={[styles.cell, styles.actionButtons]}>
        <TouchableOpacity onPress={() => handleViewDetails(item)}>
          <Feather name="info" size={25} color="#1890ff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleEditClass(item)}
          style={styles.actionMargin}
        >
          <Feather name="edit" size={25} color="#1890ff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeleteClass(item._id, item.name)}
          style={styles.actionMargin}
        >
          <Feather name="trash-2" size={25} color="#ff4d4f" />
        </TouchableOpacity>
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
      <CreateModal
        modalVisible={createModalVisible}
        setModalVisible={setCreateModalVisible}
      />
      {selectedClass && (
        <UpdateModal
          modalVisible={updateModalVisible}
          setModalVisible={setUpdateModalVisible}
        />
      )}
      {selectedClass && (
        <ClassDetails
          modalVisible={detailsModalVisible}
          setModalVisible={setDetailsVisible}
        />
      )}

      <Text style={styles.totalClassesText}>
        Total Classes: {classes.length}
      </Text>

      <TextInput
        style={styles.searchBar}
        placeholder="Search by class name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <ScrollView>
        <View style={styles.tableContainer}>
          {filteredClasses.length > 0 ? (
            <>
              <View style={styles.tableHeader}>
                <Text style={styles.headerCell}>Class Name</Text>
                <Text style={styles.headerCell}>Tutor</Text>
                <Text style={styles.headerCell}>Created At</Text>
                <Text style={styles.headerCell}>Actions</Text>
              </View>

              <FlatList
                data={filteredClasses}
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
    backgroundColor: "#f5f5f5",
  },
  icon: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
    backgroundColor: "#1890ff",
    borderRadius: 25,
    elevation: 5,
  },
  totalClassesText: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
    color: "#333",
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
    elevation: 2,
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
    elevation: 3,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: "#1890ff",
    paddingVertical: 10,
    backgroundColor: "#e6f7ff",
  },
  className: {
    flex: 1,
    fontWeight: "bold",
    color: "#333",
    fontSize: 16,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    color: "#333",
    fontSize: 18,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    paddingHorizontal: 5,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
  },
  actionMargin: {
    marginLeft: 10,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default AdminClass;
