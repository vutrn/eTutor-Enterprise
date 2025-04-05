import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Link, LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/src/store/useAuthStore";
import { useMeetingStore } from "@/src/store/useMeetingStore";
import { OfflineMeeting, OnlineMeeting } from "@/src/types/store";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Linking, Platform, ScrollView } from "react-native";

interface Props {
  onViewDetails: (meeting: any) => void;
  onCreateMeeting?: () => void;
  showCreateButton?: boolean;
}

const MeetingList = ({
  onViewDetails,
  onCreateMeeting,
  showCreateButton = false,
}: Props) => {
  const { offlineMeetings, onlineMeetings, loading } = useMeetingStore();
  const { authUser } = useAuthStore();
  const userRole = authUser?.role;
  const userId = authUser?._id;

  const [combinedMeetings, setCombinedMeetings] = useState<
    Array<
      (OfflineMeeting | OnlineMeeting) & { meetingType: "offline" | "online" }
    >
  >([]);

  useEffect(() => {
    const offlineWithType = offlineMeetings.map((meeting) => ({
      ...meeting,
      meetingType: "offline" as const,
    }));

    const onlineWithType = onlineMeetings.map((meeting) => ({
      ...meeting,
      meetingType: "online" as const,
    }));
    // Sort the meetings: today's meetings first, then by time (newest first)
    const combined = [...offlineWithType, ...onlineWithType].sort((a, b) => {
      const aIsToday = isMeetingToday(a);
      const bIsToday = isMeetingToday(b);

      // If one is today and the other isn't, prioritize today's meeting
      if (aIsToday && !bIsToday) return -1;
      if (!aIsToday && bIsToday) return 1;

      // If both are today or both are not today, sort by time (newest first)
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    setCombinedMeetings(combined);
  }, [offlineMeetings, onlineMeetings, loading]);

  const isMeetingToday = (meeting: any) => {
    const meetingTime = new Date(meeting.time);
    const now = new Date();

    // Meeting is active from 15 minutes before start time until 3 hours after start time
    const fifteenMinutesBefore = new Date(meetingTime);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);

    const threeHoursAfter = new Date(meetingTime);
    threeHoursAfter.setHours(threeHoursAfter.getHours() + 3);

    return now >= fifteenMinutesBefore && now <= threeHoursAfter;
  };

  const isUpcoming = (meeting: any) => {
    const meetingTime = new Date(meeting.time);
    const now = new Date();

    const fifteenMinutesBefore = new Date(meetingTime);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);

    return now < fifteenMinutesBefore;
  };

  const isPast = (meeting: any) => {
    const meetingTime = new Date(meeting.time);
    const now = new Date();

    const threeHoursAfter = new Date(meetingTime);
    threeHoursAfter.setHours(threeHoursAfter.getHours() + 3);

    return now > threeHoursAfter;
  };

  const renderMeetingStatus = (meeting: any) => {
    if (isMeetingToday(meeting)) {
      return (
        <Badge className="bg-green-100" size="sm">
          <Text className="text-green-600">Today</Text>
        </Badge>
      );
    } else if (isUpcoming(meeting)) {
      return (
        <Badge className="bg-blue-100" size="sm">
          <Text className="text-blue-600">Upcoming</Text>
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-gray-100" size="sm">
          <Text className="text-gray-600">Past</Text>
        </Badge>
      );
    }
  };

  // For student role - check if current student has attended the meeting
  const getAttendanceStatus = (meeting: any) => {
    if (userRole !== "student" || !userId) return null;

    const userAttendance = meeting.attendees?.find(
      (attendee: any) =>
        attendee.student._id === userId || attendee.student === userId,
    );

    if (!userAttendance) return null;

    if (userAttendance.attended) {
      return (
        <Badge className="bg-green-100" size="sm">
          <Text className="text-green-600">Attended</Text>
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100" size="sm">
          <Text className="text-red-600">Absent</Text>
        </Badge>
      );
    }
  };

  const openGoogleMeet = (link: string) => {
    if (Platform.OS === "web") {
      window.open(link, "_blank");
    } else {
      Linking.openURL(link);
    }
  };

  const renderMeetingCards = () => {
    if (loading && combinedMeetings.length === 0) {
      return (
        <GridItem
          className="col-span-12 rounded-md bg-background-50 p-6 text-center"
          _extra={{
            className: "col-span-12",
          }}
        >
          <Text>Loading meetings...</Text>
        </GridItem>
      );
    }

    if (combinedMeetings.length === 0) {
      return (
        <GridItem
          className="col-span-12 rounded-md bg-background-50 p-6 text-center"
          _extra={{
            className: "col-span-12",
          }}
        >
          <Text className="mb-3">No meetings found</Text>
        </GridItem>
      );
    }

    return combinedMeetings.map((meeting, index) => {
      const isOfflineMeeting = meeting.meetingType === "offline";
      const today = isMeetingToday(meeting);
      const attendanceStatus = getAttendanceStatus(meeting);

      return (
        <GridItem
          key={meeting._id || index}
          className="transition-all duration-200 hover:bg-background-50"
          _extra={{
            className: "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3",
          }}
        >
          <Box
            className={`h-full rounded-md ${today ? "border-2 border-green-400" : ""} ${
              isOfflineMeeting ? "bg-background-100" : "bg-blue-50"
            } p-3`}
          >
            <VStack space="sm" style={{ height: "100%" }}>
              <HStack className="items-center justify-between">
                <Heading size="md" className="line-clamp-1">
                  {meeting.title}
                </Heading>
                <Badge
                  className={`ml-1 ${isOfflineMeeting ? "bg-gray-200" : "bg-blue-100"}`}
                  size="sm"
                >
                  <Text
                    className={`text-xs ${isOfflineMeeting ? "text-gray-600" : "text-blue-600"}`}
                  >
                    {isOfflineMeeting ? "Offline" : "Online"}
                  </Text>
                </Badge>
              </HStack>

              <HStack space="sm" className="flex-wrap items-center">
                <Text highlight className="p-1">
                  {format(new Date(meeting.time), "eee HH:mm | MMM dd, yyyy")}
                </Text>
                {renderMeetingStatus(meeting)}
              </HStack>

              {isOfflineMeeting ? (
                <Text className="text-sm">
                  Location:{" "}
                  {(meeting as OfflineMeeting).location || "Not specified"}
                </Text>
              ) : userRole === "student" && today ? (
                <Button
                  action="primary"
                  className="mt-2 self-start"
                  onPress={() =>
                    openGoogleMeet((meeting as OnlineMeeting).linkggmeet)
                  }
                >
                  <ButtonText>Join Now</ButtonText>
                </Button>
              ) : userRole === "student" ? (
                <Link>
                  <LinkText onPress={() => onViewDetails(meeting)}>
                    See meeting link
                  </LinkText>
                </Link>
              ) : (
                <Link>
                  <LinkText
                    onPress={() =>
                      window.open(
                        (meeting as OnlineMeeting).linkggmeet,
                        "_blank",
                      )
                    }
                  >
                    {(meeting as OnlineMeeting).linkggmeet ||
                      "No link available"}
                  </LinkText>
                </Link>
              )}

              <Box style={{ flex: 1 }} />

              <HStack className="items-center justify-between">
                {userRole === "tutor" && (
                  <Text size="sm" className="font-semibold">
                    {meeting.attendees?.length || 0} attendees
                  </Text>
                )}
                {attendanceStatus}
                <Button
                  size="xs"
                  variant="outline"
                  onPress={() => onViewDetails(meeting)}
                  className={userRole === "tutor" ? "" : "ml-auto"}
                >
                  <ButtonText>View Details</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Box>
        </GridItem>
      );
    });
  };

  return (
    <Box className="flex-1 bg-background-0">
      <ScrollView
        contentContainerStyle={{ paddingBottom: isWeb ? 0 : 100, flexGrow: 1 }}
      >
        <VStack className="w-full p-4" space="lg">
          <HStack className="items-center justify-between">
            <Heading size="2xl">Meetings</Heading>

            {showCreateButton && (
              <Button size="sm" onPress={onCreateMeeting} action="primary">
                <ButtonText>Create Meeting</ButtonText>
              </Button>
            )}
          </HStack>

          <Grid
            className="gap-3"
            _extra={{
              className: "grid-cols-12",
            }}
          >
            {renderMeetingCards()}
          </Grid>

          {loading && combinedMeetings.length > 0 && (
            <HStack className="justify-center p-4">
              <Text>Loading more meetings...</Text>
            </HStack>
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export default MeetingList;
