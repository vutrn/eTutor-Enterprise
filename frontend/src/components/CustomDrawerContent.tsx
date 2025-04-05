import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { useAuthStore } from "../store/useAuthStore";

const CustomDrawerContent = (props: any) => {
  const { authUser, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <Box className="flex-1 bg-background-50">
      <DrawerContentScrollView {...props}>
        <Box className="px-4 py-6">
          <HStack className="mb-6 items-center">
            <Avatar className="mr-3 bg-primary-600">
              <Text className="font-semibold text-white">
                {authUser?.username.charAt(0).toUpperCase()}
              </Text>
            </Avatar>
            <VStack>
              <Text className="text-lg font-semibold">
                {authUser?.username}
              </Text>
              <Text className="text-sm text-gray-500">{authUser?.role}</Text>
            </VStack>
          </HStack>
          <Divider />
        </Box>

        <DrawerItemList
          {...props}
          activeTintColor="#2D336B"
          activeBackgroundColor="#E8EAFF"
          itemStyle={styles.itemStyle}
          labelStyle={styles.labelStyle}
        />

        <Box className="mt-6 px-4">
          <Divider />

          <DrawerItem
            label="Logout"
            onPress={handleLogout}
            icon={({ color, size }) => (
              <Feather name="log-out" color={color} size={size} />
            )}
            labelStyle={styles.labelStyle}
            style={styles.itemStyle}
          />
        </Box>
      </DrawerContentScrollView>

      {isWeb && (
        <Box className="border-t border-gray-200 p-4">
          <Text className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} eTutor Enterprise
          </Text>
        </Box>
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  itemStyle: {
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  labelStyle: {
    fontWeight: "500",
  },
  debugButton: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  optionText: {
    fontSize: 16,
    color: "#555",
    marginLeft: 10,
  },
});

export default CustomDrawerContent;
