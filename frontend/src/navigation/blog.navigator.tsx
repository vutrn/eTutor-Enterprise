import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { lazy, Suspense } from "react";
import Loading from "../components/loading";

const BlogCreate = lazy(() => import("../components/blog/BlogCreate"));
const BlogDetail = lazy(() => import("../components/blog/BlogDetail"));
const BlogUpdate = lazy(() => import("../components/blog/BlogUpdate"));
const BlogList = lazy(() => import("../components/blog/BlogList"));

export const BlogStack = () => {
  const Stack = createNativeStackNavigator<RootStackParamList>();

  return (
    <Stack.Navigator
      screenOptions={{ presentation: "card", animation: "slide_from_right" }}
      screenLayout={({ children }) => <Suspense fallback={<Loading />}>{children}</Suspense>}
    >
      <Stack.Screen name="blog_list" component={BlogList} options={{ title: "Blog" }} />
      <Stack.Screen name="blog_create" component={BlogCreate} options={{ title: "Create Blog" }} />
      <Stack.Screen name="blog_detail" component={BlogDetail} options={{ title: "Details" }} />
      <Stack.Screen name="blog_update" component={BlogUpdate} options={{ title: "Edit Blog" }} />
    </Stack.Navigator>
  );
};
