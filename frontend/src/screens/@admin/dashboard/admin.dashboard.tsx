import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserStore } from "../../../store/useUserStore";

const { width } = Dimensions.get("window");

const AdminDashboard = () => {
  const { getUsers, students, tutors, deleteUser } = useUserStore();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Box>
      <Text>Admin Dashboard</Text>
    </Box>
  );
};

export default AdminDashboard;
