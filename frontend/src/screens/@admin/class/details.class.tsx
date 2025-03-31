import React, { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Button, Modal, Portal, Text } from "react-native-paper";
import { useClassStore } from "../../../store/useClassStore";
import UpdateModal from "./update.class.modal";

interface IClassDetailsProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const ClassDetails = ({
  modalVisible,
  setModalVisible,
}: IClassDetailsProps) => {
  const { setSelectedClass, getClasses, selectedClass, loading } =
    useClassStore();
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  console.log("selectedClass", selectedClass);

  const handleEditClass = (classData: any) => {
    setSelectedClass(classData);
    setUpdateModalVisible(true);  
  };

  useEffect(() => {
    if (!updateModalVisible && refreshing) {
      getClasses(); 
      setRefreshing(false);
    }
  }, [updateModalVisible, refreshing, getClasses]);

  return (
    <Portal>
      <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            {loading ? (
              <ActivityIndicator size="large" color="#1890ff" />
            ) : (
              <>
                <TouchableOpacity
                  onPress={() => handleEditClass(selectedClass)}
                  style={styles.editButton}
                >
                  <Feather name="edit" size={25} color="#1890ff" />
                </TouchableOpacity>
                {selectedClass && (
                  <UpdateModal
                  modalVisible={updateModalVisible}
                  setModalVisible={(visible) => {
                    setUpdateModalVisible(visible);
                    if (!visible) {
                      setRefreshing(true);
                    }
                  }}
                />
                )}

                <Text style={styles.title}>Class Details</Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.label}>Class Name:</Text>{" "}
                  {selectedClass?.name || "Unknown"}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.label}>Tutor:</Text>{" "}
                  {selectedClass?.tutor?.username || "Unknown"}
                </Text>
                <Text style={styles.detailsText}>
                  <Text style={styles.label}>Number of Students:</Text>{" "}
                  {selectedClass?.students?.length || 0}
                </Text>

                <Text style={styles.subTitle}>Students:</Text>
                {selectedClass?.students?.length > 0 ? (
                  <FlatList
                    data={selectedClass.students}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                      <Text style={styles.studentItem}>
                        {item.username} ({item.email || "No email"})
                      </Text>
                    )}
                  />
                ) : (
                  <Text style={styles.emptyText}>No students available</Text>
                )}

                <View style={styles.buttonContainer}>
                  <Button
                    mode="contained"
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                    labelStyle={styles.buttonText}
                  >
                    Close
                  </Button>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 500,
    alignSelf: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  editButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  detailsText: {
    fontSize: 18,
    marginBottom: 8,
    color: "#555",
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  studentItem: {
    fontSize: 16,
    marginBottom: 5,
    padding: 8,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  emptyText: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#1890ff",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ClassDetails;
