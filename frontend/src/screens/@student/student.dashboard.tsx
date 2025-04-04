import { Text } from "@/components/ui/text";
import { useDashboardStore } from "@/src/store/useDashboadStore";
import { useMeetingStore } from "@/src/store/useMeetingStore";
import React, { useEffect } from "react";
import { View } from "react-native";

const StudentDashboard = () => {
  const { getDashboard, dashboard } = useDashboardStore();
  const {
    getOfflineMeetings,
    getOnlineMeetings,
    offlineMeetings,
    onlineMeetings,
  } = useMeetingStore();

  useEffect(() => {
    const fetchData = async () => {
      await getDashboard();
    };
    fetchData();
  }, []);

  const getAllMeetings = async () => {
    dashboard.classes?.map(async (item) => {
      await getOfflineMeetings(item._id);
    });
  };

  useEffect(() => {
    if (dashboard.classes) {
      getAllMeetings();
    }
  }, [dashboard.classes]);

  return (
    <View>
      {offlineMeetings.map((meeting) => (
        <Text key={meeting._id}>{meeting.title}</Text>
      ))}
    </View>
  );
};

export default StudentDashboard;
