import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { Avatar, Card, IconButton, Title } from "react-native-paper";
import { useDashboardStore } from "../../store/useDashboadStore";
import { BarChart, LineChart } from "react-native-gifted-charts";
import { useClassStore } from "../../store/useClassStore";
import { COLORS, FONTS } from "../../utils/constant";

const { width } = Dimensions.get("window");

const TutorDashboard = () => {
  const { dashboard, getDashboard } = useDashboardStore();
  const { classes, getClasses } = useClassStore();
  const ClassIcon = (props: any) => <Avatar.Icon {...props} icon="book" />;
  const StudentIcon = (props: any) => <Avatar.Icon {...props} icon="account-group" />;

  useEffect(() => {
    getDashboard();
    getClasses();
  }, []);

  const barData = classes.map((classItem) => ({
    value: classItem.students.length,
    label: classItem.name,

    topLabelComponent: () => (
      <Title style={{ fontFamily: FONTS.semiBold, marginBottom: 5 }}>
        {classItem.students.length}
      </Title>
    ),
  }));

  const lineData = [
    { value: 0 },
    { value: 20 },
    { value: 18 },
    { value: 40 },
    { value: 36 },
    { value: 60 },
    { value: 54 },
    { value: 85 },
  ];

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

      <Card style={[styles.chartCard, { marginTop: 16 }]}>
        <Card.Content>
          <Title>Student Engagement</Title>
          <View style={styles.barChartContainer}>
            <BarChart
              data={barData}
              barWidth={22}
              spacing={15}
              frontColor="#177AD5"
              xAxisThickness={0}
              yAxisThickness={0}
              // maxValue={Math.max(...barData.map((d) => d.value)) + 1}
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Student Distribution by Subject</Title>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  cardContainer: {
    flexDirection: width > 768 ? "row" : "column",
    justifyContent: "space-between",
  },
  card: {
    flex: 1,
    margin: 8,
  },
  chartContainer: {
    height: 300,
    marginTop: 16,
  },
  chartCard: {
    margin: 8,
    marginTop: 8,
  },
  barChartContainer: {
    height: 250,
    padding: 10,
    alignItems: "center",
  },
});

export default TutorDashboard;
