import React, { useEffect } from "react";
import { SafeAreaView, Text, View, FlatList } from "react-native";
import { useDashboardStore } from "../../../store/useDashboadStore";
import { useUserStore } from "../../../store/useUserStore";
import { useClassStore } from "../../../store/useClassStore";

const TuTorClassDetail = () => {
  const { getDashboard, dashboard } = useDashboardStore();
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
      <View className="flex-1 justify-center items-center p-4">
        <View className="bg-gray-100 rounded-lg shadow-md p-6 w-full max-w-md">
          <Text className="text-lg font-bold mb-2">Class Name: {selectedClass.name}</Text>
          <Text className="text-base mb-2">Tutor: {getTutorNameById(selectedClass.tutor)}</Text>
          <Text className="text-base mb-2">Number of Students: {selectedClass.students.length}</Text>
          <Text className="text-base mb-4">
            Created At:{" "}
            {new Date(selectedClass.createdAt).toLocaleDateString("vi-VN", {
              day: "numeric",
              month: "numeric",
              year: "numeric",
            })}
          </Text>

          <Text className="text-lg font-bold mb-2">Student List:</Text>
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