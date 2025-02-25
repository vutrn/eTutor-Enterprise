import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React, { lazy, Suspense } from "react";
import CreateClass from "../screens/@admin/create.class";
import Loading from "../screens/other/loading";

const StudentDashboard = lazy(() => import("../screens/@student/student.dashboard"));
const StudentBlog = lazy(() => import("../screens/@student/student.blog"));
const StudentProfile = lazy(() => import("../screens/@student/student.profile"));

const StudentNavigator = () => {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Tab.Screen name="student_dashboard" component={StudentDashboard} />
      <Tab.Screen name="student_blog" component={StudentBlog} />
      {/* <Tab.Screen name="student_dashboard" component={StudentDashboard} />
      <Tab.Screen name="student_dashboard" component={StudentDashboard} />
      <Tab.Screen name="student_dashboard" component={StudentDashboard} /> */}

      <Tab.Screen name="student_profile" component={StudentProfile} />
    </Tab.Navigator>
  );
};

export default StudentNavigator;
