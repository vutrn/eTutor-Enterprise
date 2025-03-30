import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View, TextInput } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClassStore } from "../../store/useClassStore";
import { useUserStore } from "../../store/useUserStore";
import { FONTS } from "../../utils/constant";

const StudentClass = () => {
  const { classes, getClasses, setSelectedClass } = useClassStore();
  const { tutors, getUsers } = useUserStore();
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchData();
    console.log("tutors", tutors);
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    await getClasses();
    await getUsers();
    setRefreshing(false);
  };

  const handleClassSelect = (item: any) => {
    setSelectedClass(item);
    navigation.navigate("student_feature_stack");
  };

  const filteredClasses = classes.filter((cls: any) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <TextInput
          style={styles.searchBar}
          placeholder="Search by class name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Class Name</Text>
          <Text style={styles.headerCell}>Tutor</Text>
          <Text style={styles.headerCell}>Students</Text>
          <Text style={styles.headerCell}>Created Date</Text>
          <Text style={styles.headerCell}>Action</Text>
        </View>

        {filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <TouchableOpacity
              key={item._id}
              style={styles.tableRow}
              onPress={() => handleClassSelect(item)}
            >
              <Text style={styles.cell}>{item.name}</Text>
              <Text style={styles.cell}>{item.tutor.username}</Text>
              <Text style={styles.cell}>{item.students.length}</Text>
              <Text style={styles.cell}>
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <Button
                mode="contained"
                onPress={() => handleClassSelect(item)}
                style={styles.enterButton}
              >
                Enter Class
              </Button>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No classes available</Text>
            <Button mode="contained" onPress={fetchData} style={styles.refreshButton}>
              Refresh
            </Button>
          </View>
        )}
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
  scrollContainer: {
    paddingBottom: 20,
  },
  searchBar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    backgroundColor: "#e0e0e0",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  headerCell: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 16,
    textAlign: "center",
  },
  cell: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: "center",
  },
  enterButton: {
    marginHorizontal: 4,
    flex: 1,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    marginBottom: 16,
    color: "#666",
    fontFamily: FONTS.regular,
  },
  refreshButton: {
    marginTop: 8,
  },
});

export default StudentClass;
