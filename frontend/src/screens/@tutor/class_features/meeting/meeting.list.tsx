import React, { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet } from "react-native";
import Toast from "react-native-toast-message";

import { Text } from "@/components/ui/text";

import { useClassStore } from "../../../../store/useClassStore";
import { useMeetingStore } from "../../../../store/useMeetingStore";

const isWeb = Platform.OS === "web";

// Helper function to format time
const formatTime = (hours: number, minutes: number) => {
  const ampm = hours >= 12 ? "PM" : "AM";
  const hour = hours % 12 || 12;
  return `${hour}:${minutes.toString().padStart(2, "0")} ${ampm}`;
};

// Function to create array of hours for select dropdown
const getHours = () => {
  const hours = [];
  for (let i = 1; i <= 12; i++) {
    hours.push(i);
  }
  return hours;
};

// Function to create array of minutes for select dropdown
const getMinutes = () => {
  const minutes = [];
  for (let i = 0; i < 60; i += 5) {
    minutes.push(i);
  }
  return minutes;
};

const TutorMeeting = () => {
  const { selectedClass } = useClassStore();
  const {
    getOfflineMeetings,
    getOnlineMeetings,
    createOfflineMeeting,
    createOnlineMeeting,
    meetings,
    loading,
  } = useMeetingStore();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Time selection state for web
  const [selectedHour, setSelectedHour] = useState<number>(10);
  const [selectedMinute, setSelectedMinute] = useState<number>(0);
  const [selectedAmPm, setSelectedAmPm] = useState<"AM" | "PM">("AM");

  // Time selection state for mobile
  const [visible, setVisible] = useState(false);
  const [time, setTime] = useState({ hours: 10, minutes: 0 });

  useEffect(() => {
    const fetchData = async () => {
      await getOfflineMeetings();
      await getOnlineMeetings();
    };
    fetchData();
  }, []);

  // Mobile time picker handlers
  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = useCallback(
    ({ hours, minutes }: any) => {
      setVisible(false);
      setTime({ hours, minutes });
    },
    [setVisible],
  );

  const getMeetingDateTime = () => {
    const date = new Date(selectedDate);

    // For web, convert hours from 12h to 24h format if needed
    if (isWeb) {
      let hours = selectedHour;
      if (selectedAmPm === "PM" && hours !== 12) {
        hours += 12;
      } else if (selectedAmPm === "AM" && hours === 12) {
        hours = 0;
      }
      date.setHours(hours, selectedMinute, 0);
    } else {
      // For mobile
      date.setHours(time.hours, time.minutes, 0);
    }

    return date;
  };

  const handleCreateMeeting = async () => {
    if (!title) {
      Toast.show({
        type: "error",
        text1: "Title is required",
      });
      return;
    }

    if (isOnline && !meetingLink) {
      Toast.show({
        type: "error",
        text1: "Meeting link is required for online meetings",
      });
      return;
    }

    if (!isOnline && !location) {
      Toast.show({
        type: "error",
        text1: "Location is required for offline meetings",
      });
      return;
    }

    const meetingDate = getMeetingDateTime();

    try {
      if (isOnline) {
        await createOnlineMeeting(
          selectedClass._id,
          title,
          meetingLink,
          meetingDate,
        );
      } else {
        await createOfflineMeeting(
          selectedClass._id,
          title,
          description,
          location,
          meetingDate,
        );
      }

      // Reset form on success
      setTitle("");
      setDescription("");
      setLocation("");
      setMeetingLink("");
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  return <Text>Tutor Meeting</Text>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  card: {
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },
});

export default TutorMeeting;
