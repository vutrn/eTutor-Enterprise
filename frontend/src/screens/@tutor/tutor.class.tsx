import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";
import { useClassStore } from "../../store/useClassStore";
import { useDashboardStore } from "../../store/useDashboadStore";

const TutorClass = () => {
  const { getDashboard, dashboard } = useDashboardStore();
  const { setSelectedClass } = useClassStore();
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
          left={() => (
            <Avatar.Text
              size={40}
              label={item.name.substring(0, 2).toUpperCase()}
            />
          )}
          right={() => <IconButton icon="arrow-right" />}
        />
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Classes</Text>
      {dashboard.classes ? (
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
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#666",
  },
});

export default TutorClass;
