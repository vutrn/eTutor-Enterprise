import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { lazy, Suspense } from "react";
import Loading from "../components/loading";
import { useClassStore } from "../store/useClassStore";
import { useMessageStore } from "../store/useMessageStore";
import MessageDetail from "../screens/@tutor/class_features/message.detail";
import TutorMessage from "../screens/@tutor/class_features/tutor.message";

const BlogCreate = lazy(() => import("../components/blog/BlogCreate"));
const BlogDetail = lazy(() => import("../components/blog/BlogDetail"));
const BlogUpdate = lazy(() => import("../components/blog/BlogUpdate"));
const BlogList = lazy(() => import("../components/blog/BlogList"));

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

export const MessageStack = () => {
  const { selectedClass } = useClassStore();
  const { selectedUser } = useMessageStore();

  return (
    <Stack.Navigator screenOptions={{}}>
      <Stack.Screen
        name="tutor_message"
        component={TutorMessage}
        options={{
          headerShown: false,
          title: selectedUser?.username || "Message Detail",
        }}
      />
      <Stack.Screen
        name="tutor_message_detail"
        component={MessageDetail}
        options={{
          title: selectedUser?.username || "Message Detail",
        }}
      />
    </Stack.Navigator>
  );
};
