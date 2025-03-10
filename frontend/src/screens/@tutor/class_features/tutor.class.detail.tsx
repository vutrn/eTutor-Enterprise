import { NavigationProp, RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect } from "react";
import { SafeAreaView, StyleSheet, Text } from "react-native";
import { useDashboardStore } from "../../../store/useDashboadStore";
import { useUserStore } from "../../../store/useUserStore";


const TuTorClassDetail = () => {
  const route: RouteProp<RootStackParamList, "tutor_class_detail"> = useRoute();
  const { getDashboard, dashboard } = useDashboardStore();
  const { tutors, getUsers } = useUserStore();

  useEffect(() => {
    getDashboard();
    getUsers();
  }, []);

  const getTutorNameById = (tutorId: any) => {
    const tutor = tutors.find((value) => value._id === tutorId);
    return tutor ? tutor.username : "{Tutor}";
  };

  // console.log("detail route", route);

  return (
    <SafeAreaView>
      <Text>classname: {route.params?.name}</Text>
      <Text>tutor: {getTutorNameById(route.params?.tutor)}</Text>
      <Text>students: {route.params?.students.length}</Text>
      <Text>
        createdAt:
        {new Date(route.params?.createdAt).toLocaleDateString("vi-VN", {
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
