import React, { useEffect } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { BarChart as GiftedBarChart } from "react-native-gifted-charts";
import { Avatar, Card, IconButton, Title } from "react-native-paper";
import { useDashboardStore } from "../../store/useDashboadStore";

const { width } = Dimensions.get("window");

const TutorDashboard = () => {
  const { dashboard, getDashboard } = useDashboardStore();
  const ClassIcon = (props: any) => <Avatar.Icon {...props} icon="book" />;
  const StudentIcon = (props: any) => <Avatar.Icon {...props} icon="account-group" />;

  useEffect(() => {
    getDashboard();
  }, []);

  const data = [{ value: 50 }, { value: 80 }, { value: 90 }, { value: 70 }];

  const DATA = Array.from({ length: 31 }, (_, i) => ({
    day: i,
    lowTmp: 20 + 10 * Math.random(),
    highTmp: 40 + 30 * Math.random(),
  }));

  // Chart data for student engagement
  const engagementData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        data: [65, 78, 90, 85],
        color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`,
        strokeWidth: 2
      }
    ],
    legend: ["Student Engagement"]
  };

  // Data for class performance bar chart
  const barData = [
    { value: 85, label: 'Math', frontColor: '#177AD5' },
    { value: 75, label: 'Science', frontColor: '#ED6665' },
    { value: 92, label: 'English', frontColor: '#33C7A6' },
    { value: 68, label: 'History', frontColor: '#8676FF' },
  ];

  // Data for the pie chart - student distribution by subject
  const subjectDistribution = {
    labels: ["Math", "Science", "English", "History"],
    data: [0.35, 0.25, 0.25, 0.15],
    colors: ["#177AD5", "#ED6665", "#33C7A6", "#8676FF"],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12
  };

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
          <LineChart
            data={engagementData}
            width={width - 50}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              style: {
                borderRadius: 16
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#ffa726"
              }
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16
            }}
          />
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Class Performance</Title>
          <View style={styles.barChartContainer}>
            <GiftedBarChart
              data={barData}
              barWidth={40}
              spacing={24}
              roundedTop
              hideRules
              xAxisThickness={0}
              yAxisThickness={0}
              yAxisTextStyle={{ color: '#333' }}
              xAxisLabelTextStyle={{ color: '#333', textAlign: 'center' }}
              labelWidth={40}
              isAnimated
            />
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.chartCard}>
        <Card.Content>
          <Title>Student Distribution by Subject</Title>
          <PieChart
            data={[
              {
                name: "Math",
                population: 35,
                color: "#177AD5",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12
              },
              {
                name: "Science",
                population: 25,
                color: "#ED6665",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12
              },
              {
                name: "English",
                population: 25,
                color: "#33C7A6",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12
              },
              {
                name: "History",
                population: 15,
                color: "#8676FF",
                legendFontColor: "#7F7F7F",
                legendFontSize: 12
              }
            ]}
            width={width - 50}
            height={220}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
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
    alignItems: 'center',
  }
});

export default TutorDashboard;
