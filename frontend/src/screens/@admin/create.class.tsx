import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useAdminStore } from "../../store/useAdminStore";
import { Checkbox, Modal } from "react-native-paper";
import { useClassStore } from "../../store/useClassStore";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const CreateClass = () => {
  // State for form inputs
  const [className, setClassName] = useState("");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get data from stores
  const { tutors, students, fetchUsers, loading: loadingUsers } = useAdminStore();
  const { createClass, loading: loadingClassCreation } = useClassStore();

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  // Fetch users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Handle student selection toggle
  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  // Handle form submission
  const handleCreateClass = async () => {
    if (!className || !selectedTutor || selectedStudents.length === 0) {
      // Show validation error
      alert("Please fill in all fields and select at least one student");
      return;
    }

    setIsSubmitting(true);
    const success = await createClass(className, selectedTutor, selectedStudents);
    setIsSubmitting(false);

    if (success) {
      // Reset form
      setClassName("");
      setSelectedTutor("");
      setSelectedStudents([]);
      // Navigate back or to classes list
      navigation.goBack();
    }
  };

  if (loadingUsers) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.title}>Create New Class</Text>

      {/* Class Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Class Name</Text>
        <TextInput
          style={styles.input}
          value={className}
          onChangeText={setClassName}
          placeholder="Enter class name"
        />
      </View>

      {/* Tutor Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select Tutor</Text>
        {tutors.length === 0 ? (
          <Text style={styles.emptyText}>No tutors available</Text>
        ) : (
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
        )}
      </View>

      {/* Student Selection */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Select Students</Text>
        <Text style={styles.subtitle}>Selected: {selectedStudents.length}</Text>
        {students.length === 0 ? (
          <Text style={styles.emptyText}>No students available</Text>
        ) : (
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
        )}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.button, (isSubmitting || loadingClassCreation) && styles.disabledButton]}
        onPress={handleCreateClass}
        disabled={isSubmitting || loadingClassCreation}
      >
        {isSubmitting || loadingClassCreation ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Create Class</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
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
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
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
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
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
  button: {
    backgroundColor: "#1890ff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: "#b9daff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateClass;
