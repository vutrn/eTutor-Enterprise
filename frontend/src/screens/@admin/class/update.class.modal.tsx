import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Checkbox, Modal, Portal, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useClassStore } from "../../../store/useClassStore";
import { useUserStore } from "../../../store/useUserStore";

interface IProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  classData: any; // The class to update
}

const UpdateModal = ({ modalVisible, setModalVisible, classData }: IProps) => {
  // Get data from stores
  const { tutors, students, getUsers, loading: loadingUsers } = useUserStore();
  const { updateClass, loading: loadingClassUpdate } = useClassStore();

  const [className, setClassName] = useState("");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (modalVisible && classData) {
      const currentStudentIds = classData.students?.map((student: any) => student._id) || [];
      setClassName(classData.name || "");
      setSelectedTutor(classData.tutor?._id || "");
      setSelectedStudents([...currentStudentIds]);
    }
  }, [modalVisible, classData]);

  // Fetch users when component mounts or when modal becomes visible
  useEffect(() => {
    if (modalVisible) {
      getUsers();
    }
  }, [getUsers, modalVisible]);

  // Toggle student selection with removal tracking
  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((addedStudents) => {
      if (addedStudents.includes(studentId)) {
        return addedStudents.filter((id) => id !== studentId);
      } else {
        return [...addedStudents, studentId];
      }
    });
  };

  // Handle form submission
  const handleUpdateClass = async () => {
    if (!className || !selectedTutor || !selectedStudents) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const originalStudentIds = classData.students?.map((student: any) => student._id) || [];

      console.log("Original students:", originalStudentIds);
      console.log("New selected students:", selectedStudents);

      const success = await updateClass(classData._id, className, selectedTutor, selectedStudents);
      if (success) {
        Toast.show({
          type: "success",
          text1: "Class updated",
          text2: "Students have been updated successfully",
        });
        setModalVisible(false);
      }
    } catch (error) {
      console.error("Error updating class:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to update class",
      });
    }
    setIsSubmitting(false);
  };

  const onChangeText = useCallback((text: string) => {
    setClassName(text);
  }, []);

  if (loadingUsers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <Portal>
      <Modal
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        contentContainerStyle={styles.container}
      >
        <ScrollView>
          <Text style={styles.title}>Update Class</Text>
          {/* CLASS NAME INPUT */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Class Name</Text>
            <TextInput
              label="Class Name"
              style={styles.input}
              value={className}
              onChangeText={onChangeText}
              mode="outlined"
            />
          </View>
          {/* TUTOR SELECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Select Tutor</Text>
            {tutors.length > 0 ? (
              tutors.map((tutor) => (
                <TouchableOpacity
                  key={tutor._id}
                  style={[styles.selectionItem, selectedTutor === tutor._id && styles.selectedItem]}
                  onPress={() => setSelectedTutor(tutor._id)}
                >
                  <Text style={styles.itemText}>{tutor.username}</Text>
                  <Text style={styles.emailText}>{tutor.email}</Text>
                  {selectedTutor === tutor._id && <Text style={styles.selectedText}>✓</Text>}
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No tutors available</Text>
            )}
          </View>

          {/* STUDENT SELECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Select Students ({selectedStudents.length})</Text>
            {students.length > 0 ? (
              students.map((student) => (
                <TouchableOpacity
                  key={student._id}
                  style={[
                    styles.selectionItem,
                    selectedStudents.includes(student._id) && styles.selectedItem,
                  ]}
                  onPress={() => toggleStudentSelection(student._id)}
                >
                  <Checkbox
                    status={selectedStudents.includes(student._id) ? "checked" : "unchecked"}
                    onPress={() => toggleStudentSelection(student._id)}
                  />
                  <View style={styles.studentInfo}>
                    <Text style={styles.itemText}>{student.username}</Text>
                    <Text style={styles.emailText}>{student.email}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No students available</Text>
            )}
          </View>
        </ScrollView>
        {/* SUBMIT BUTTON */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleUpdateClass}
            disabled={isSubmitting}
          >
            {isSubmitting || loadingClassUpdate ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Class</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
    width: "90%",
    maxWidth: 500,
    alignSelf: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: "500",
    color: "#333",
  },
  input: {
    fontSize: 16,
    backgroundColor: "#fff",
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
  selectionItem: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  selectedItem: {
    backgroundColor: "#e6f7ff",
    borderColor: "#1890ff",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "500",
  },
  emailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  studentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  selectedText: {
    color: "#1890ff",
    fontWeight: "bold",
    marginLeft: "auto",
  },
  emptyText: {
    padding: 12,
    textAlign: "center",
    color: "#999",
    backgroundColor: "#fff",
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },
  button: {
    flex: 2,
    backgroundColor: "#1890ff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#555",
    fontSize: 18,
    fontWeight: "bold",
  },
  removedItem: {
    backgroundColor: "#ffeeee",
    borderColor: "#ff9999",
  },
  removeText: {
    color: "red",
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },
});

export default UpdateModal;
