import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useDashboardStore } from "../../../store/useDashboadStore";
import { useUserStore } from "../../../store/useUserStore";
import { useClassStore } from "../../../store/useClassStore";

const StudentClassDetail = () => {
  const { getDashboard, dashboard } = useDashboardStore();
  const { tutors, getUsers } = useUserStore();
  const { selectedClass } = useClassStore();

  useEffect(() => {
    const loadData = async () => {
      await getDashboard();
      await getUsers();
    };
    loadData();
    console.log("selectedClass", selectedClass);
  }, []);

  return (
    <SafeAreaView>
      <Text>classname: {selectedClass.name}</Text>
      <Text>tutor: {selectedClass.tutor.username}</Text>
      <Text>students: {selectedClass.students.length}</Text>
      <Text>
        createdAt:
        {new Date(selectedClass.createdAt).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
export default StudentClassDetail;
