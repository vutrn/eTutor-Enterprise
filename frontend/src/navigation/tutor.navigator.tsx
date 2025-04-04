import { Feather } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import TutorMeetingList from "../screens/@tutor/class_features/meeting.list";
import TuTorClassDetail from "../screens/@tutor/class_features/tutor.class.detail";
import TutorDocument from "../screens/@tutor/class_features/tutor.document";
import { useClassStore } from "../store/useClassStore";
import { TutorMessageStack } from "./features.navigator";

export const ClassFeaturesDrawer = () => {
  const Drawer = createDrawerNavigator<RootStackParamList>();
  const { selectedClass } = useClassStore();

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: "#2D336B",
        drawerInactiveTintColor: "#555",
        headerShown: false,
        drawerType: "permanent",
      }}
    >
      <Drawer.Screen
        name="tutor_class_detail"
        component={TuTorClassDetail}
        options={{
          title: "Class Detail",
          drawerIcon: ({ color, size }) => (
            <Feather name="book" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="tutor_message_stack"
        component={TutorMessageStack}
        options={{
          title: "Messages",
          drawerIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="tutor_meeting"
        component={TutorMeetingList}
        options={{
          title: "Meeting",
          drawerIcon: ({ color, size }) => (
            <Feather name="video" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="tutor_document"
        component={TutorDocument}
        options={{
          title: "Documents",
          drawerIcon: ({ color, size }) => (
            <Feather name="file" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

// Main Tutor Navigator
const TutorNavigator = () => {
  const Stack = createNativeStackNavigator();
  const { selectedClass } = useClassStore();

  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="tutor_feature_drawer"
        component={ClassFeaturesDrawer}
        options={{
          title: selectedClass?.name || "Class Detail",
        }}
      />
    </Stack.Navigator>
  );
};

export default TutorNavigator;
