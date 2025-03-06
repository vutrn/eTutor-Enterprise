import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDashboardStore } from "../../store/useDashboadStore";
import { useUserStore } from "../../store/useUserStore";

const TutorClass = () => {
  const { getDashboard, dashboard } = useDashboardStore();
  // Import useAdminStore to access tutors data
  const { tutors, getUsers } = useUserStore();
  // State to track if data is loading

  useEffect(() => {
    getDashboard();
    getUsers();
  }, []);

  const getTutorNameById = (tutorId: any) => {
    const tutor = tutors.find((value) => value._id === tutorId);
    return tutor ? tutor.username : "{Tutor}";
  };

  console.log("Dashboard: ", dashboard);

  const renderItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.classCard}>
        <Text style={styles.className}>{item.name}</Text>
        <Text style={styles.tutorName}>
          Tutor: {item?.tutor ? getTutorNameById(item.tutor) : "Not assigned"}
        </Text>
        <Text style={styles.studentCount}>{item.students.length} students</Text>
        <Text style={styles.dateInfo}>
          Created: {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Classes</Text>
      {dashboard.classes && dashboard.classes.length > 0 ? (
        <FlatList
          data={dashboard.classes}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text style={styles.emptyText}>No classes found</Text>
      )}
    </View>
  );
};

// Add styles to improve the UI appearance
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  tutorName: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  studentCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  dateInfo: {
    fontSize: 12,
    color: "#888",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});

export default TutorClass;
