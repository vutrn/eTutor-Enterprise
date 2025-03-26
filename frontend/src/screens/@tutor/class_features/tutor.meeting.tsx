import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { useMeetingStore } from "../../../store/useMeetingStore";
import { useClassStore } from "../../../store/useClassStore";

const TutorMeeting = () => {
  const { getMeetingsByClass } = useMeetingStore();
  const { selectedClass } = useClassStore();

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    if (selectedClass && selectedClass._id) {
      await getMeetingsByClass(selectedClass._id);
    }
  };

  return (
    <View>
      <Text>Tutor Meeting</Text>
    </View>
  );
};

export default TutorMeeting;
