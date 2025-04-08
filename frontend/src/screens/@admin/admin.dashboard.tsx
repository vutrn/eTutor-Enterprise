import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Card } from "@/components/ui/card";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useClassStore } from "@/src/store/useClassStore";
import { useDashboardStore } from "@/src/store/useDashboadStore";
import { useUserStore } from "@/src/store/useUserStore";
import { Book, GraduationCap, Users } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const AdminDashboard = () => {
  const { getDashboard, adminDashboard, tutorDashboard } = useDashboardStore();
  const { getUsers, tutors, students } = useUserStore();
  const { classes, getClasses } = useClassStore();
  const [loading, setLoading] = useState(false);
  const [chartParentWidth, setChartParentWidth] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    setLoading(true);
    await Promise.all([getDashboard(), getUsers(), getClasses()]);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  // Prepare data for the bar chart
  const classLabels =
    classes?.map((cls) =>
      cls.name.length > 10 ? cls.name.substring(0, 10) + "..." : cls.name,
    ) || [];

  const studentCounts = classes?.map((cls) => cls.students.length) || [];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <VStack space="xl">
          {/* <Heading size="xl" className="mb-2">
            Admin Dashboard
          </Heading> */}

          {/* Stats Cards */}
          <Grid
            className="gap-4"
            _extra={{
              className: "grid-cols-12",
            }}
          >
            {/* Total Classes Card */}
            <GridItem _extra={{ className: "col-span-12 md:col-span-4" }}>
              <Card variant="elevated" className="bg-orange-100 p-4">
                <HStack className="items-center justify-between">
                  <VStack>
                    <Text className="text-gray-600">Total Classes</Text>
                    <Text className="text-2xl font-bold">
                      {classes.length || 0}
                    </Text>
                  </VStack>
                  <Box className="rounded-full bg-orange-200 p-3">
                    <Icon as={Book} size="lg" className="text-orange-600" />
                  </Box>
                </HStack>
              </Card>
            </GridItem>

            {/* Total Students Card */}
            <GridItem _extra={{ className: "col-span-12 md:col-span-4" }}>
              <Card variant="elevated" className="bg-success-50 p-4">
                <HStack className="items-center justify-between">
                  <VStack>
                    <Text className="text-gray-600">Total Students</Text>
                    <Text className="text-2xl font-bold">
                      {adminDashboard.studentsCount || 0}
                    </Text>
                  </VStack>
                  <Box className="rounded-full bg-success-100 p-3">
                    <Icon
                      as={GraduationCap}
                      size="lg"
                      className="text-success-600"
                    />
                  </Box>
                </HStack>
              </Card>
            </GridItem>

            {/* Total Tutors Card */}
            <GridItem _extra={{ className: "col-span-12 md:col-span-4" }}>
              <Card variant="elevated" className="bg-info-50 p-4">
                <HStack className="items-center justify-between">
                  <VStack>
                    <Text className="text-gray-600">Total Tutors</Text>
                    <Text className="text-2xl font-bold">
                      {tutors?.length || 0}
                    </Text>
                  </VStack>
                  <Box className="rounded-full bg-info-100 p-3">
                    <Icon as={Users} size="lg" className="text-info-600" />
                  </Box>
                </HStack>
              </Card>
            </GridItem>
          </Grid>

          {/* Bar Chart - Students per Class */}
          <Card variant="elevated" className="mt-6">
            <Text className="mb-4 text-lg font-semibold">
              Students Per Class
            </Text>

            {/* {dashboard. && dashboard.classes.length > 0 ? ( */}
            <View
              className="w-full"
              onLayout={({ nativeEvent }) =>
                setChartParentWidth(nativeEvent.layout.width)
              }
            >
              <BarChart
                data={{
                  labels: classLabels,
                  datasets: [
                    {
                      data: studentCounts,
                    },
                  ],
                }}
                width={chartParentWidth}
                height={220}
                yAxisLabel=""
                yAxisSuffix=""
                chartConfig={{
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(45, 51, 107, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  // barPercentage: 0.7,
                  fillShadowGradient: "#2D336B",
                  fillShadowGradientOpacity: 1,
                }}
                fromZero
                showValuesOnTopOfBars
                style={{
                  borderRadius: 8,
                  marginVertical: 8,
                  paddingHorizontal: 0,
                }}
              />
            </View>
            {/* ) : (
              <Box className="items-center justify-center py-10">
                <Text className="text-gray-500">No class data available</Text>
              </Box>
            )} */}
          </Card>

          {/* Class List with Details */}
          {/* <Card variant="elevated" className="mt-4 p-4">
            <Text className="mb-4 text-lg font-semibold">Class Details</Text>

            
              <VStack space="md">
                {tutorDashboard?.classes?.map((classItem, index) => (
                  <Card
                    key={classItem._id || index}
                    className="border border-gray-200 p-3"
                  >
                    <HStack className="items-center justify-between">
                      <VStack>
                        <Text className="font-bold">{classItem.name}</Text>
                        <HStack className="items-center space-x-2">
                          <Icon
                            as={Users}
                            size="xs"
                            className="text-primary-600"
                          />
                          <Text className="text-sm text-gray-600">
                            {classItem.students.length} Students
                          </Text>
                        </HStack>
                      </VStack>
                      <HStack space="sm">
                        <Badge className="bg-success-100">
                          <Text className="text-xs text-success-600">
                            Active
                          </Text>
                        </Badge>
                      </HStack>
                    </HStack>
                  </Card>
                ))}
              </VStack>
          
          </Card> */}
        </VStack>
      </ScrollView>

      {loading && (
        <Box className="absolute inset-0 items-center justify-center bg-black/10">
          <Box className="rounded-lg bg-white p-6 shadow-md">
            <Spinner size="large" color="#4F46E5" />
            <Text className="mt-3">Loading dashboard data...</Text>
          </Box>
        </Box>
      )}
    </SafeAreaView>
  );
};

export default AdminDashboard;
