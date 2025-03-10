import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useDashboardStore } from "../../../store/useDashboadStore";
import { useUserStore } from "../../../store/useUserStore";

const TuTorClassDetail = ({ route }: any) => {
  const { name, tutor, students, createdAt } = route.params;
  const { getDashboard, dashboard } = useDashboardStore();
  const { tutors, getUsers } = useUserStore();

  useEffect(() => {
    getDashboard();
    getUsers();
  }, []);
  console.log("Route Params:", route);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const getTutorNameById = (tutorId: any) => {
    const tutor = tutors.find((value) => value._id === tutorId);
    return tutor ? tutor.username : "{Tutor}";
  };
  return (
    <SafeAreaView>
      <Text>classname: {name}</Text>
      <Text>tutor: {getTutorNameById(tutor)}</Text>
      <Text>students: {students.length}</Text>
      <Text>
        createdAt:
        {new Date(createdAt).toLocaleDateString("vi-VN", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
        })}
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});
export default TuTorClassDetail;
