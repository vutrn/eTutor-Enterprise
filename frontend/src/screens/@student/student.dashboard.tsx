import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useBlogStore } from "@/src/store/useBlogStore";
import { useDashboardStore } from "@/src/store/useDashboadStore";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { View, Dimensions, ScrollView } from "react-native";
import { PieChart, ContributionGraph, BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const StudentDashboard = () => {
  const { getDashboard, studentDashboard } = useDashboardStore();
  const { blogs, getAllBlogs } = useBlogStore();
  const { authUser } = useAuthStore();
  const [chartParentWidth, setChartParentWidth] = useState(0);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getDashboard();
        await getAllBlogs();
      };

      fetchData();

      return () => {};
    }, []),
  );

  // Calculate the data for charts
  const totalClasses = studentDashboard.classes?.length || 0;
  const userBlogs =
    blogs?.filter((blog) => blog.author._id == authUser?._id).length || 0;
  const userComments = blogs?.reduce(
    (total, blog) =>
      total +
      blog.comments.filter((comment) => comment.user === authUser?._id).length,
    0,
  );

  return (
    <ScrollView className="size-full flex-1 bg-white">
      <Box>
        {/* Activity Summary Section */}
        <Box className="mb-6 rounded-lg p-4">
          <Text className="mb-3 text-lg font-semibold">Activity Summary</Text>

          {/* Stats in cards */}
          <View className="mb-4 flex-row justify-between">
            <Box className="mr-2 flex-1 rounded-lg bg-blue-100 p-3">
              <Text className="font-semibold text-blue-800">Classes</Text>
              <Text className="text-2xl font-bold">{totalClasses}</Text>
            </Box>

            <Box className="mr-2 flex-1 rounded-lg bg-green-100 p-3">
              <Text className="font-semibold text-green-800">Blogs posted</Text>
              <Text className="text-2xl font-bold">{userBlogs}</Text>
            </Box>

            <Box className="flex-1 rounded-lg bg-orange-100 p-3">
              <Text className="font-semibold text-orange-800">
                Comments on Blogs
              </Text>
              <Text className="text-2xl font-bold">{userComments}</Text>
            </Box>
          </View>

          <HStack className="">
            {/* Bar Chart */}
            <View
              className="mb-6 w-[90%] flex-1"
              onLayout={({ nativeEvent }) =>
                setChartParentWidth(nativeEvent.layout.width)
              }
            >
              <Text className="mb-2 text-lg font-semibold">
                Activity Distribution
              </Text>
              <BarChart
                style={
                  {
                    // borderRadius: 16,
                    // borderWidth: 1,
                  }
                }
                data={{
                  labels: ["Classes", "Blogs", "Comments"],
                  datasets: [
                    {
                      data: [totalClasses, userBlogs, userComments],
                      colors: [
                        (opacity = 1) => `rgba(71, 126, 232, ${opacity})`,
                        (opacity = 1) => `rgba(71, 206, 102, ${opacity})`,
                        (opacity = 1) => `rgba(245, 111, 66, ${opacity})`,
                      ],
                    },
                  ],
                }}
                chartConfig={{
                  backgroundGradientFrom: "white",
                  // backgroundGradientFromOpacity: 0,
                  backgroundGradientTo: "white",
                  // backgroundGradientToOpacity: 0.5,
                  color: (opacity = 1) => `rgb(45, 51, 107, ${opacity})`,
                }}
                width={chartParentWidth - 10}
                height={220}
                fromZero
                showBarTops
                showValuesOnTopOfBars
                yAxisLabel=""
                yAxisSuffix=""
                verticalLabelRotation={0}
              />
            </View>

            {/* Pie Chart */}
            <Box className="mb-6 flex-1">
              <Text className="mb-2 text-lg font-semibold">
                Engagement Breakdown
              </Text>
              <PieChart
                data={[
                  {
                    name: "Classes",
                    population: totalClasses,
                    color: "#477EE8",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                  {
                    name: "Blogs",
                    population: userBlogs,
                    color: "#47CE66",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                  {
                    name: "Comments",
                    population: userComments,
                    color: "#F56F42",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                ]}
                width={screenWidth / 2.5}
                height={220}
                chartConfig={{
                  backgroundGradientFrom: "white",
                  // backgroundGradientFromOpacity: 0,
                  backgroundGradientTo: "white",
                  // backgroundGradientToOpacity: 0.5,
                  color: (opacity = 1) => `rgb(45, 51, 107, ${opacity})`,
                  barPercentage: 0.5,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"15"}
                center={[20, 0]}
                absolute
              />
            </Box>
          </HStack>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default StudentDashboard;
