import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useDashboardStore } from "../../store/useDashboadStore";

const TutorDashboard = () => {
  const { dashboard, getDashboard } = useDashboardStore();

  useEffect(() => {
    getDashboard();
  }, [getDashboard]);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text>You have {dashboard?.totalClasses} classes</Text>
        <Text>You are teaching {dashboard?.totalStudents} students</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default TutorDashboard;
