import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useBlogStore } from "@/src/store/useBlogStore";
import { useDashboardStore } from "@/src/store/useDashboadStore";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { BarChart, LineChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const StudentDashboard = () => {
  const {
    getDashboard,
    studentDashboard,
    getAllClassesAttendance,
    classAttendance,
  } = useDashboardStore();
  const { blogs, getAllBlogs } = useBlogStore();
  const { authUser } = useAuthStore();
  const [chartParentWidth, setChartParentWidth] = useState(0);
  const [attendanceData, setAttendanceData] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        await getDashboard();
        await getAllBlogs();
        if (studentDashboard.classes?.length > 0) {
          await getAllClassesAttendance();
        }
      };

      fetchData();

      return () => {};
    }, []),
  );

  useEffect(() => {
    // Process attendance data when it changes
    if (
      studentDashboard.classes?.length > 0 &&
      Object.keys(classAttendance).length > 0
    ) {
      processAttendanceData();
    }
  }, [classAttendance, studentDashboard.classes]);

  // Process attendance data for the line chart
  const processAttendanceData = () => {
    // Get all meetings from all classes with dates
    const allMeetings = [] as any;

    // Collect all meetings with their dates
    Object.keys(classAttendance).forEach((classId) => {
      const meetings = classAttendance[classId];
      if (meetings && meetings.length > 0) {
        meetings.forEach((meeting) => {
          // Check if this student attended
          const studentAttended = meeting.attendees.some(
            (attendee) =>
              attendee.student._id === authUser?._id && attendee.attended,
          );

          allMeetings.push({
            date: new Date(meeting.time),
            attended: studentAttended ? 1 : 0,
            title: meeting.title,
          });
        });
      }
    });

    // Sort meetings by date
    allMeetings.sort(({ a, b }: any) => a.date.getTime() - b.date.getTime());

    // Get data for the last 7 days (one week)
    const last7Days = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      last7Days.push({
        date: day,
        label: day.toLocaleDateString("default", { weekday: "short" }),
      });
    }

    // Calculate attendance for each day
    const dailyAttendance = last7Days.map((dayData) => {
      const dayStart = new Date(dayData.date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(dayData.date);
      dayEnd.setHours(23, 59, 59, 999);

      const dayMeetings = allMeetings.filter(
        (meeting: any) => meeting.date >= dayStart && meeting.date <= dayEnd,
      );

      const totalMeetings = dayMeetings.length;
      const attendedMeetings = dayMeetings.filter(
        (m: any) => m.attended,
      ).length;

      // Return number of attended meetings for the day (or 0 if none)
      return attendedMeetings;
    });

    setAttendanceData({
      labels: last7Days.map((d) => d.label),
      datasets: [
        {
          data: dailyAttendance,
          color: (opacity = 1) => `rgba(71, 126, 232, ${opacity})`,
          strokeWidth: 2,
        },
      ],
    } as any);
  };

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
                width={chartParentWidth}
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
            <Box className="flex-1">
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

          {/* Class Attendance Trends Line Chart */}
          <Box className="mb-6 w-full">
            <Text className="mb-2 text-lg font-semibold">
              Class Attendance Trends (Last 7 Days)
            </Text>
            {attendanceData.labels.length > 0 ? (
              <LineChart
                data={attendanceData}
                width={screenWidth - 200}
                height={220}
                chartConfig={{
                  backgroundColor: "#ffffff",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(71, 126, 232, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

                  propsForDots: {
                    r: "4",
                    strokeWidth: "2",
                    stroke: "#477EE8",
                  },
                }}
                yAxisSuffix=""
                yAxisLabel=""
                fromZero
                segments={5}
              />
            ) : (
              <Box className="h-[220px] w-full items-center justify-center rounded-lg bg-gray-100">
                <Text className="text-gray-500">
                  No attendance data available
                </Text>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default StudentDashboard;
