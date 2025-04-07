import React, { useEffect } from "react";
import { SafeAreaView, Text, View, FlatList } from "react-native";
import { useDashboardStore } from "../../../store/useDashboadStore";
import { useUserStore } from "../../../store/useUserStore";
import { useClassStore } from "../../../store/useClassStore";

const TuTorClassDetail = () => {
  const { getDashboard, tutorDashboard } = useDashboardStore();
  const { tutors, getUsers } = useUserStore();
  const { selectedClass } = useClassStore();

  useEffect(() => {
    const loadData = async () => {
      await getDashboard();
      await getUsers();
    };
    loadData();
  }, []);

  const getTutorNameById = (tutorId: any) => {
    const tutor = tutors.find((value) => value._id === tutorId);
    return tutor ? tutor.username : "{Tutor}";
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-4">
        <View className="w-full max-w-md rounded-lg bg-gray-100 p-6 shadow-md">
          <Text className="mb-2 text-lg font-bold">
            Class Name: {selectedClass.name}
          </Text>
          <Text className="mb-2 text-base">
            Tutor: {getTutorNameById(selectedClass.tutor)}
          </Text>
          <Text className="mb-2 text-base">
            Number of Students: {selectedClass.students.length}
          </Text>
          <Text className="mb-4 text-base">
            Created At:{" "}
            {new Date(selectedClass.createdAt).toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Text>

          <Text className="mb-2 text-lg font-bold">Student List:</Text>
          <FlatList
            data={selectedClass.students}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View className="mb-2">
                <Text className="text-base">- {item.username}</Text>
              </View>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TuTorClassDetail;
