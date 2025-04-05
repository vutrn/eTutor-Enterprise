import React, { useEffect } from "react";
import { SafeAreaView, View, FlatList } from "react-native";
import { Text } from "react-native-paper";
import { useDashboardStore } from "../../../store/useDashboadStore";
import { useUserStore } from "../../../store/useUserStore";
import { useClassStore } from "../../../store/useClassStore";

const StudentClassDetail = () => {
  const { getDashboard } = useDashboardStore();
  const { getUsers } = useUserStore();
  const { selectedClass } = useClassStore();

  useEffect(() => {
    const loadData = async () => {
      await getDashboard();
      await getUsers();
    };
    loadData();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <View className="mb-6">
        <Text className="text-3xl font-bold text-gray-800 text-center">
          Class Details
        </Text>
      </View>

      <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto mb-6">
        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-lg">Class Name:</Text>
          <Text className="text-gray-800 font-bold text-xl">
            {selectedClass.name}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-lg">
            Number of Students:
          </Text>
          <Text className="text-gray-800 font-bold text-xl">
            {selectedClass.students.length}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 font-medium text-lg">Tutor:</Text>
          <Text className="text-gray-800 font-bold text-lg">
            {selectedClass.tutor.username}
          </Text>
        </View>

        <View>
          <Text className="text-gray-600 font-medium text-lg">Created On:</Text>
          <Text className="text-gray-800 font-bold text-lg">
            {new Date(selectedClass.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </View>

      <View className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto">
        <Text className="text-gray-600 font-medium text-lg mb-4">
          Student List:
        </Text>
        <FlatList
          data={selectedClass.students}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View className="flex-row justify-between items-center mb-3 bg-gray-100 p-3 rounded-lg">
              <Text className="text-gray-800 font-medium">{item.username}</Text>
            </View>
          )}
          ListEmptyComponent={
            <Text className="text-gray-500 text-center">
              No students available
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default StudentClassDetail;