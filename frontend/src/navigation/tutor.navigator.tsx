import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense } from "react";
import HomeTuTor from "../screens/@tutor/tutor.dashboard";
import Loading from "../screens/other/loading";

const TutorDashboard = lazy(() => import("../screens/@tutor/tutor.dashboard"));
const TutorProfile = lazy(() => import("../screens/@tutor/tutor.profile"));

const TutorNavigator = () => {
  const Tab = createBottomTabNavigator();
 
  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="tutor_dashboard" component={TutorDashboard} />
      <Tab.Screen name="tutor_profile" component={TutorProfile} />


    </Tab.Navigator>
  );
};

export default TutorNavigator;
