import React, { useEffect } from "react";
import { Modal, StyleSheet, View, ActivityIndicator, FlatList } from "react-native";
import { Button, Text } from "react-native-paper";
import { useClassStore } from "../../../store/useClassStore";

const ClassDetails = ({
  modalVisible,
  setModalVisible,
  classId,
}: {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  classId: string;
}) => {
  const { getClassDetails, selectedClass, loading } = useClassStore();

  useEffect(() => {
    if (modalVisible && classId) {
      getClassDetails(classId);
    }
  }, [modalVisible, classId, getClassDetails]);

  return (
    <Modal visible={modalVisible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : (
            <>
              <Text style={styles.title}>Class Details</Text>
              <Text style={styles.detailsText}>
                Class Name: {selectedClass?.name || "Unknown"}
              </Text>
              <Text style={styles.detailsText}>
                Tutor: {selectedClass?.tutor?.username || "Unknown"}
              </Text>
              <Text style={styles.detailsText}>
                Number of Students: {selectedClass?.students?.length || 0}
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
                <Text style={styles.detailsText}>No students available</Text>
              )}

              <Button mode="contained" onPress={() => setModalVisible(false)}>
                Close
              </Button>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent black background
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
    justifyContent: "center",
    elevation: 5, // Adds shadow for Android
    shadowColor: "#000", // Adds shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 18,
    marginBottom: 8,
  },
  studentItem: {
    fontSize: 16,
    marginBottom: 5,
    padding: 5,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
});

export default ClassDetails;