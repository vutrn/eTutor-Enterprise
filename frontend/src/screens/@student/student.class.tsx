import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, TextInput, TouchableOpacity, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useClassStore } from "../../store/useClassStore";
import { useAuthStore } from "../../store/useAuthStore";

const StudentClass = () => {
  const { classes, getClasses, setSelectedClass } = useClassStore();
  const { authUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setRefreshing(true);
    await getClasses();
    setRefreshing(false);
  };

  const handleClassSelect = (item: any) => {
    setSelectedClass(item);
    navigation.navigate("student_feature_stack");
  };

  const filteredClasses = classes
    .filter((cls: any) =>
      cls.students.some((student: any) => student._id === authUser?._id),
    )
    .filter((cls: any) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  return (
    <SafeAreaView className="flex-1 bg-gray-100 p-4">
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <TextInput
          className="mb-5 h-10 rounded-lg border border-gray-300 bg-white px-3"
          placeholder="Search by class name"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        <View className="flex-row border-b border-gray-300 bg-gray-200 py-2">
          <Text className="flex-1 px-2 text-center text-base font-bold">
            Class Name
          </Text>
          <Text className="flex-1 px-2 text-center text-base font-bold">
            Tutor
          </Text>
          <Text className="flex-1 px-2 text-center text-base font-bold">
            Students
          </Text>
          <Text className="flex-1 px-2 text-center text-base font-bold">
            Created Date
          </Text>
          <Text className="flex-1 px-2 text-center text-base font-bold">
            Action
          </Text>
        </View>

        {filteredClasses.length > 0 ? (
          filteredClasses.map((item) => (
            <TouchableOpacity
              key={item._id}
              className="flex-row items-center border-b border-gray-300 py-3"
              onPress={() => handleClassSelect(item)}
            >
              <Text className="flex-1 px-2 text-center text-sm">
                {item.name}
              </Text>
              <Text className="flex-1 px-2 text-center text-sm">
                {item.tutor.username}
              </Text>
              <Text className="flex-1 px-2 text-center text-sm">
                {item.students.length}
              </Text>
              <Text className="flex-1 px-2 text-center text-sm">
                {new Date(item.createdAt).toLocaleDateString()}
              </Text>
              <View className="flex-1 flex-row justify-center">
                <Button
                  mode="contained"
                  onPress={() => handleClassSelect(item)}
                  className="mx-1"
                >
                  Enter
                </Button>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="items-center py-5">
            <Text className="mb-4 text-base text-gray-600">
              No classes available
            </Text>
            <Button mode="contained" onPress={fetchData} className="mt-2">
              Refresh
            </Button>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default StudentClass;