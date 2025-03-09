import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useDashboardStore } from "../../store/useDashboadStore";
import { useUserStore } from "../../store/useUserStore";
import { Card, IconButton } from "react-native-paper";
import { NavigationProp, useNavigation } from "@react-navigation/native";

const TutorClass = () => {
  const { getDashboard, dashboard } = useDashboardStore();
  const { tutors, getUsers } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
    getUsers();
  }, []);

  const loadDashboard = async () => {
    setRefreshing(true);
    await getDashboard();
    setRefreshing(false);
  };

  const getTutorNameById = (tutorId: any) => {
    const tutor = tutors.find((value) => value._id === tutorId);
    return tutor ? tutor.username : "{Tutor}";
  };

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Card
        style={styles.classCard}
        onPress={() => {
          navigation.navigate("class_feature_tab", {
            className: item.name,
          });
        }}
      >
        <Card.Title
          title={item.name}
          subtitle={`Tutor: ${getTutorNameById(item.tutor)}`}
          right={() => <IconButton icon="arrow-right" />}
        />
        <Card.Content>
          <Text style={styles.studentCount}>Students: {item.students.length}</Text>
          <Text style={styles.dateInfo}>
            Date: {new Date(item.startDate).toLocaleDateString()} -
            {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Classes</Text>
      {dashboard.classes && dashboard.classes.length > 0 ? (
        <FlatList
          data={dashboard.classes}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={loadDashboard}
        />
      ) : (
        <Text style={styles.emptyText}>No classes found</Text>
      )}
    </View>
  );
};

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
