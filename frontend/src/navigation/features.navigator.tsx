import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { lazy, Suspense } from "react";
import Loading from "../components/loading";
import MessageDetail from "../components/message/MessageDetail";
import MessageList from "../components/message/MessageList";
import { useMessageStore } from "../store/useMessageStore";

const BlogCreate = lazy(() => import("../components/blog/BlogCreate"));
const BlogDetail = lazy(() => import("../components/blog/BlogDetail"));
const BlogUpdate = lazy(() => import("../components/blog/BlogUpdate"));
const BlogList = lazy(() => import("../components/blog/BlogList"));

// Define proper components instead of using inline functions
const TutorMessageListScreen = () => <MessageList userRole="tutor" />;
const StudentMessageListScreen = () => <MessageList userRole="student" />;

const TutorMessageDetailScreen = () => <MessageDetail userRole="tutor" />;
const StudentMessageDetailScreen = () => <MessageDetail userRole="student" />;

const Stack = createNativeStackNavigator<RootStackParamList>();

export const BlogStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
      screenLayout={({ children }) => (
        <Suspense fallback={<Loading />}>{children}</Suspense>
      )}
    >
      <Stack.Screen
        name="blog_list"
        component={BlogList}
        options={{ title: "Blog", headerShown: false }}
      />
      <Stack.Screen
        name="blog_create"
        component={BlogCreate}
        options={{ title: "Create Blog" }}
      />
      <Stack.Screen
        name="blog_detail"
        component={BlogDetail}
        options={{ title: "Details" }}
      />
      <Stack.Screen
        name="blog_update"
        component={BlogUpdate}
        options={{ title: "Edit Blog" }}
      />
    </Stack.Navigator>
  );
};

// Tutor message stack using the reusable components
export const TutorMessageStack = () => {
  const { selectedUser } = useMessageStore();

  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="tutor_message"
        component={TutorMessageListScreen}
        options={{
          headerShown: false,
          title: "Messages",
        }}
      />
      <Stack.Screen
        name="tutor_message_detail"
        component={TutorMessageDetailScreen}
        options={{
          title: selectedUser?.username || "Message Detail",
        }}
      />
    </Stack.Navigator>
  );
};

// Student message stack using the reusable components
export const StudentMessageStack = () => {
  const { selectedUser } = useMessageStore();

  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="student_message"
        component={StudentMessageListScreen}
        options={{
          headerShown: false,
          title: "Messages",
        }}
      />
      <Stack.Screen
        name="student_message_detail"
        component={StudentMessageDetailScreen}
        options={{
          title: selectedUser?.username || "Message Detail",
        }}
      />
    </Stack.Navigator>
  );
};
