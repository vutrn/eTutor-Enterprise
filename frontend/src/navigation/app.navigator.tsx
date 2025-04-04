import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import DrawerNavigator from "./drawer.navigator";
import TutorNavigator from "./tutor.navigator";
import StudentNavigator from "./student.navigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="main"
        component={DrawerNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="tutor_navigator"
        component={TutorNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="student_navigator"
        component={StudentNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
