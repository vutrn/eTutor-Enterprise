import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, TextInput } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";
import { useClassStore } from "../../store/useClassStore";
import { useDashboardStore } from "../../store/useDashboadStore";

const TutorClass = () => {
  const { getDashboard, dashboard } = useDashboardStore();
  const { setSelectedClass } = useClassStore();
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    setRefreshing(true);
    await getDashboard();
    setRefreshing(false);
  };

  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  // Filter classes based on the search query
  const filteredClasses = dashboard.classes?.filter((cls: any) =>
    cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: any }) => {
    return (
      <Card
        style={styles.classCard}
        onPress={() => {
          setSelectedClass(item);
          navigation.navigate("tutor_feature_stack", {
            params: item,
          });
        }}
      >
        <Card.Title
          title={item.name}
          titleStyle={styles.classTitle}
          subtitle={`Students: ${item.students.length}`}
          subtitleStyle={styles.classSubtitle}
          left={() => (
            <Avatar.Text
              size={48}
              label={item.name.substring(0, 2).toUpperCase()}
              style={styles.avatar}
            />
          )}
          right={() => <IconButton icon="arrow-right" size={24} />}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Classes</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by class name"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {filteredClasses && filteredClasses.length > 0 ? (
        <FlatList
          data={filteredClasses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContainer}
          renderItem={renderItem}
          refreshing={refreshing}
          onRefresh={loadDashboard}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No classes found</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
    textAlign: "center",
  },
  searchBar: {
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 20,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 20,
  },
  classCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  classTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    fontFamily: "monospace",
  },
  classSubtitle: {
    fontSize: 14,
    color: "#666",
  },
  avatar: {
    backgroundColor: "#007bff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
});

export default TutorClass;