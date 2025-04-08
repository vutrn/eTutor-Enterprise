import { Box } from "@/components/ui/box";
import { Divider } from "@/components/ui/divider";
import { Grid, GridItem } from "@/components/ui/grid";
import { HStack } from "@/components/ui/hstack";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useBlogStore } from "@/src/store/useBlogStore";
import { useClassStore } from "@/src/store/useClassStore";
import { useDashboardStore } from "@/src/store/useDashboadStore";
import { useMeetingStore } from "@/src/store/useMeetingStore";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { get } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { Dimensions, ScrollView, View } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

const TutorDashboard = () => {
  const {
    getAllOfflineMeetings,
    getAllOnlineMeetings,
    allOfflineMeetings,
    allOnlineMeetings,
  } = useMeetingStore();
  const { blogs, getAllBlogs } = useBlogStore();
  const { tutorDashboard, getDashboard, getClassDocuments, classDocuments } =
    useDashboardStore();
  const { authUser } = useAuthStore();
  const [chartParentWidth, setChartParentWidth] = useState(0);
  const [attendanceData, setAttendanceData] = useState({
    attended: 0,
    absent: 0,
  });
  const [documentData, setDocumentData] = useState({
    labels: [],
    counts: [],
    classNames: {},
  });
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          await getDashboard();
          await Promise.all([
            getAllOfflineMeetings(),
            getAllOnlineMeetings(),
            getAllBlogs(),
          ]);
          if (tutorDashboard?.classes) {
            for (const cls of tutorDashboard.classes) {
              await getClassDocuments(cls._id);
            }
          }
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        }
      };

      fetchData();

      return () => {
        setDocumentData({ labels: [], counts: [], classNames: {} });
        setAttendanceData({ attended: 0, absent: 0 });
      };
    }, [getDashboard, getClassDocuments]),
  );

  useEffect(() => {
    if (tutorDashboard?.classes && Object.keys(classDocuments).length > 0) {
      const classNames = {} as any;
      const labels = [] as any;
      const counts = [] as any;

      tutorDashboard?.classes.forEach((cls) => {
        const className =
          cls.name.length > 10 ? cls.name.substring(0, 10) + "..." : cls.name;
        classNames[cls._id] = className;
        labels.push(className);
        const docsCount = classDocuments[cls._id]?.length || 0;
        counts.push(docsCount);
      });

      setDocumentData({ labels, counts, classNames });
    }
  }, [tutorDashboard?.classes, getDashboard, classDocuments]);

  const filteredOfflineMeetings = allOfflineMeetings.filter(
    (meeting) => meeting.createdBy === authUser?._id,
  );
  const filteredOnlineMeetings = allOnlineMeetings.filter(
    (meeting) => meeting.createdBy === authUser?._id,
  );
  useEffect(() => {
    const allMeetings = [...filteredOfflineMeetings, ...filteredOnlineMeetings];

    let attended = 0;
    let absent = 0;

    allMeetings.forEach((meeting) => {
      meeting.attendees.forEach((attendee) => {
        if (attendee.attended) {
          attended++;
        } else {
          absent++;
        }
      });
    });
    setAttendanceData({ attended, absent });
  }, [allOfflineMeetings, allOnlineMeetings]);

  const tutorBlogs = blogs.filter((blog) => blog.author._id === authUser?._id);
  const tutorComments = blogs.reduce(
    (total, blog) =>
      total +
      blog.comments.filter((comment) => comment.user === authUser?._id).length,
    0,
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-3">
        <Box>
          <Text className="mb-2 text-2xl font-bold">Activity Summary</Text>
          <VStack className="mb-4 flex-row justify-between">
            <Box className="mr-2 flex-1 rounded-lg bg-blue-100 p-3">
              <Text className="font-semibold text-blue-800">Classes</Text>
              <Text className="text-2xl font-bold">
                {tutorDashboard?.totalClasses || 0}
              </Text>
            </Box>

            <Box className="mr-2 flex-1 rounded-lg bg-green-100 p-3">
              <Text className="font-semibold text-green-800">Blogs</Text>
              <Text className="text-2xl font-bold">{tutorBlogs.length}</Text>
            </Box>

            <Box className="mr-2 flex-1 rounded-lg bg-orange-100 p-3">
              <Text className="font-semibold text-orange-800">Comments</Text>
              <Text className="text-2xl font-bold">{tutorComments}</Text>
            </Box>
          </VStack>
        </Box>

        {/* Document count by class bar chart */}
        <Box className="flex-1">
          <Text className="mb-3 text-2xl font-bold">Documents by Class</Text>
          <View
            className="flex-1"
            onLayout={({ nativeEvent }) =>
              setChartParentWidth(nativeEvent.layout.width)
            }
          >
            <BarChart
              data={{
                labels: documentData.labels,
                datasets: [
                  {
                    data: documentData.counts,
                  },
                ],
              }}
              chartConfig={{
                backgroundGradientFrom: "white",
                backgroundGradientTo: "white",
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                color: (opacity = 1) => `rgb(45, 51, 107, ${opacity})`,
                // labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              width={chartParentWidth}
              height={210}
              yAxisLabel=""
              yAxisSuffix=""
              fromZero
              showValuesOnTopOfBars
            />
          </View>
        </Box>
        <Box>
          <Text className="mb-2 text-2xl font-bold">Attendance Summary</Text>
          <HStack>
            <View className="flex-1">
              <Grid className="gap-4" _extra={{ className: "grid-cols-12" }}>
                <GridItem _extra={{ className: "col-span-6" }}>
                  <Text className="mb-2 text-lg font-semibold">
                    Total Meetings:
                  </Text>
                  <HStack space="md" className="rounded-md bg-slate-100 p-2">
                    <HStack space="xs" className="text-sm font-medium">
                      <Text className="text-gray-600">Offline: </Text>
                      <Text>{filteredOfflineMeetings.length}</Text>
                    </HStack>
                    <Divider
                      orientation="vertical"
                      className="h-6 bg-emerald-500"
                    />
                    <HStack space="xs" className="text-sm font-medium">
                      <Text className="text-blue-600">Online: </Text>
                      <Text className="text-blue-600">
                        {filteredOnlineMeetings.length}
                      </Text>
                    </HStack>
                  </HStack>
                </GridItem>

                <GridItem _extra={{ className: "col-span-6" }}>
                  <Text className="text-2xl font-bold">
                    {filteredOfflineMeetings.length +
                      filteredOnlineMeetings.length}
                  </Text>
                </GridItem>

                <GridItem _extra={{ className: "col-span-6" }}>
                  <Text className="text-lg font-semibold">Total Attended:</Text>
                </GridItem>

                <GridItem _extra={{ className: "col-span-6" }}>
                  <Text className="text-2xl font-bold text-green-500">
                    {attendanceData.attended}
                  </Text>
                </GridItem>

                <GridItem _extra={{ className: "col-span-6" }}>
                  <Text className="text-lg font-semibold">Total Absent:</Text>
                </GridItem>
                <GridItem _extra={{ className: "col-span-6" }}>
                  <Text className="text-2xl font-bold text-red-500">
                    {attendanceData.absent}
                  </Text>
                </GridItem>
              </Grid>
            </View>
            <View
              className="flex-2 w-[70%]"
              onLayout={({ nativeEvent }) =>
                setChartParentWidth(nativeEvent.layout.width)
              }
            >
              <PieChart
                data={[
                  {
                    name: "Attended",
                    population: attendanceData.attended,
                    color: "#47CE66",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                  {
                    name: "Absent",
                    population: attendanceData.absent,
                    color: "#F56F42",
                    legendFontColor: "#7F7F7F",
                    legendFontSize: 15,
                  },
                ]}
                width={chartParentWidth}
                height={210}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor={"population"}
                backgroundColor={"transparent"}
                center={[10, 0]}
                paddingLeft=""
              />
            </View>
          </HStack>
        </Box>
      </View>
    </ScrollView>
  );
};

export default TutorDashboard;
