import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import {
    Modal,
    ModalBackdrop,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { useAuthStore } from "@/src/store/useAuthStore";
import { OfflineMeeting, OnlineMeeting } from "@/src/types/store";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { format } from "date-fns";
import React from "react";
import { Linking, Platform } from "react-native";

interface StudentMeetingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting:
    | ((OfflineMeeting | OnlineMeeting) & { meetingType: "offline" | "online" })
    | null;
}

const StudentMeetingDetailsModal: React.FC<StudentMeetingDetailsModalProps> = ({
  isOpen,
  onClose,
  meeting,
}) => {
  const { authUser } = useAuthStore();
  const userId = authUser?._id;

  const formatDate = (date: Date | string) => {
    try {
      return format(new Date(date), "EEEE, MMMM dd, yyyy 'at' h:mm a");
    } catch (error) {
      return "Invalid date";
    }
  };

  const openGoogleMeet = (link: string) => {
    if (Platform.OS === "web") {
      window.open(link, "_blank");
    } else {
      Linking.openURL(link);
    }
  };

  const isMeetingActive = (meeting: any) => {
    const meetingTime = new Date(meeting.time);
    const now = new Date();
    
    // Meeting is active from 15 minutes before start time until 3 hours after start time
    const fifteenMinutesBefore = new Date(meetingTime);
    fifteenMinutesBefore.setMinutes(fifteenMinutesBefore.getMinutes() - 15);
    
    const threeHoursAfter = new Date(meetingTime);
    threeHoursAfter.setHours(threeHoursAfter.getHours() + 3);
    
    return now >= fifteenMinutesBefore && now <= threeHoursAfter;
  };

  const renderMeetingStatus = (meeting: any) => {
    if (isMeetingActive(meeting)) {
      return (
        <Badge className="bg-green-100" size="sm">
          <Text className="text-green-600">Active now</Text>
        </Badge>
      );
    } else if (new Date() < new Date(meeting.time)) {
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

  const getAttendanceStatus = () => {
    if (!meeting || !userId) return null;
    
    const userAttendance = meeting.attendees?.find(
      (attendee: any) => attendee.student._id === userId || attendee.student === userId
    );
    
    if (!userAttendance) return null;
    
    if (userAttendance.attended) {
      return (
        <Badge className="bg-green-100" size="sm">
          <Text className="text-green-600">You are marked as attended</Text>
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-red-100" size="sm">
          <Text className="text-red-600">You are marked as absent</Text>
        </Badge>
      );
    }
  };

  if (!meeting) {
    return null;
  }

  const isOfflineMeeting = meeting.meetingType === "offline";
  const active = isMeetingActive(meeting);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={isWeb ? "lg" : "full"}>
      <ModalBackdrop />
      <ModalContent>
        <ModalHeader>
          <Heading>{meeting.title}</Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            <HStack space="sm" className="items-center flex-wrap">
              <Badge
                className={`${isOfflineMeeting ? "bg-gray-200" : "bg-blue-100"}`}
                size="sm"
              >
                <Text
                  className={`${isOfflineMeeting ? "text-gray-600" : "text-blue-600"}`}
                >
                  {isOfflineMeeting ? "Offline" : "Online"}
                </Text>
              </Badge>
              <Text>{formatDate(meeting.time)}</Text>
              {renderMeetingStatus(meeting)}
            </HStack>

            {getAttendanceStatus() && (
              <Box className="my-2">
                {getAttendanceStatus()}
              </Box>
            )}

            <Divider />

            {isOfflineMeeting ? (
              <>
                <Box className="rounded-md bg-gray-50 p-3">
                  <VStack space="xs">
                    <HStack>
                      <Text className="font-bold">Location: </Text>
                      <Text>{(meeting as OfflineMeeting).location}</Text>
                    </HStack>

                    {(meeting as OfflineMeeting).description && (
                      <VStack space="xs">
                        <Text className="font-bold">Description:</Text>
                        <Text>{(meeting as OfflineMeeting).description}</Text>
                      </VStack>
                    )}
                  </VStack>
                </Box>
              </>
            ) : (
              <>
                <Box className="rounded-md bg-blue-50 p-3">
                  <VStack space="xs">
                    <Text className="font-bold">Google Meet Link:</Text>
                    <Text className="text-blue-600 break-all">
                      {(meeting as OnlineMeeting).linkggmeet}
                    </Text>

                    <Button
                      size="sm"
                      onPress={() =>
                        openGoogleMeet((meeting as OnlineMeeting).linkggmeet)
                      }
                      className="mt-1 self-start"
                      isDisabled={!active}
                      action={active ? "primary" : "secondary"}
                    >
                      <ButtonText>
                        {active ? "Join Meeting Now" : "Meeting not active yet"}
                      </ButtonText>
                    </Button>
                  </VStack>
                </Box>
              </>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onPress={onClose} className="mr-2">
            <ButtonText>Close</ButtonText>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default StudentMeetingDetailsModal;