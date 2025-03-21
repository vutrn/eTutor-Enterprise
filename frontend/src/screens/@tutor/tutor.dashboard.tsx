import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, IconButton } from "react-native-paper";
import { useDashboardStore } from "../../store/useDashboadStore";

const { width } = Dimensions.get("window");

const TutorDashboard = () => {
  const { dashboard, getDashboard } = useDashboardStore();
  const ClassIcon = (props: any) => <Avatar.Icon {...props} icon="book" />;
  const StudentIcon = (props: any) => <Avatar.Icon {...props} icon="account-group" />;

  useEffect(() => {
    getDashboard();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.cardContainer}>
        <Card style={styles.card}>
          <Card.Title
            title="Total Classes"
            subtitle={`${dashboard?.totalClasses} classes`}
            left={ClassIcon}
            right={() => <IconButton icon="arrow-right" />}
          />
        </Card>
        <Card style={styles.card}>
          <Card.Title
            title="You are teaching"
            subtitle={`${dashboard?.totalStudents} students`}
            left={StudentIcon}
            right={() => <IconButton icon="arrow-right" />}
          />
        </Card>
      </View>
      {/* View student list and message */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // flexWrap: "wrap",
  },
  cardContainer: {
    flexDirection: width > 768 ? "row" : "column",
    justifyContent: "space-between",
    // borderWidth: 1,
    // borderColor: "red",
  },
  card: {
    flex: 1,
    margin: 8,
    // borderWidth: 1,
    // borderColor: "blue",
  },
});

export default TutorDashboard;
