import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "@/components/ui/checkbox";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { CheckIcon } from "@/components/ui/icon";
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
import { useMeetingStore } from "@/src/store/useMeetingStore";
import { Meeting, OfflineMeeting, OnlineMeeting } from "@/src/types/store";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  meeting:
    | ((OfflineMeeting | OnlineMeeting) & { meetingType: "offline" | "online" })
    | null;
}

const MeetingDetailsModal = ({ isOpen, onClose, meeting }: Props) => {
  const { markOfflineAttendance, markOnlineAttendance } = useMeetingStore();
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize selected students when meeting changes
  useEffect(() => {
    if (meeting) {
      const attendedStudents = meeting.attendees
        ?.filter((attendee) => attendee.attended)
        .map((attendee) => attendee.student._id);

      setSelectedStudents(attendedStudents || []);
    }
  }, [meeting]);

  const handleSaveAttendance = async () => {
    if (!meeting) return;

    setIsSaving(true);
    console.log("selectedStudents", selectedStudents);
    try {
      if (meeting.meetingType === "offline") {
        await markOfflineAttendance(meeting._id, selectedStudents);
      } else {
        await markOnlineAttendance(meeting._id, selectedStudents);
      }

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Attendance marked successfully",
      });

      onClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to mark attendance",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) => {
      if (prev?.includes(studentId)) {
        console.log("Removing student:", studentId);
        return prev.filter((id) => id !== studentId);
      } else {
        console.log("Adding student:", studentId);
        return [...prev, studentId];
      }
    });
  };

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

  const renderAttendeeItem = ({ item }: { item: Meeting["attendees"][0] }) => {
    const student = item.student || {};
    const studentId = student._id;
    const studentName = student.username ? student.username : "UNKNOWN";
    const isSelected = selectedStudents?.includes(studentId);

    return (
      <HStack className="items-center border-b border-gray-100 py-2" space="sm">
        <Checkbox
          value={studentId}
          isChecked={isSelected}
          onChange={() => toggleStudentSelection(studentId)}
        >
          <CheckboxIndicator>
            <CheckboxIcon as={CheckIcon} />
          </CheckboxIndicator>
          <CheckboxLabel>{studentName}</CheckboxLabel>
        </Checkbox>
      </HStack>
    );
  };

  if (!meeting) {
    return null;
  }

  const isOfflineMeeting = meeting.meetingType === "offline";

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
            <HStack space="sm" className="items-center">
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
            </HStack>

            {isOfflineMeeting ? (
              <>
                <Box className="rounded-md bg-gray-50 p-3">
                  <VStack space="xs">
                    <HStack>
                      <Text className="font-bold">Location: </Text>
                      <Text>{(meeting as OfflineMeeting).location}</Text>
                    </HStack>

                    {(meeting as OfflineMeeting).description && (
                      <HStack space="xs">
                        <Text className="font-bold">Description:</Text>
                        <Text>{(meeting as OfflineMeeting).description}</Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              </>
            ) : (
              <Box className="rounded-md bg-blue-50 p-3">
                <VStack space="xs">
                  <Text className="font-bold">Google Meet Link:</Text>
                  <Text className="text-blue-600">
                    {(meeting as OnlineMeeting).linkggmeet}
                  </Text>

                  <Button
                    size="sm"
                    onPress={() =>
                      openGoogleMeet((meeting as OnlineMeeting).linkggmeet)
                    }
                    className="mt-1 self-start"
                  >
                    <ButtonText>Open in Google Meet</ButtonText>
                  </Button>
                </VStack>
              </Box>
            )}

            <Divider />

            <VStack space="sm">
              <HStack space="sm">
                <Heading size="sm">Attendance</Heading>
                <Text>
                  ({selectedStudents.length}/{meeting.attendees?.length || 0}{" "}
                  attended)
                </Text>
              </HStack>

              {meeting.attendees && meeting.attendees.length > 0 ? (
                <Box className="max-h-[300px]">
                  <FlatList
                    data={meeting.attendees}
                    keyExtractor={(item) => item.student._id}
                    renderItem={renderAttendeeItem}
                    nestedScrollEnabled
                  />
                </Box>
              ) : (
                <Text>No students in this meeting</Text>
              )}
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onPress={onClose} className="mr-2">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={handleSaveAttendance}
            isDisabled={isSaving}
            action="primary"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <ButtonText>Save Attendance</ButtonText>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default MeetingDetailsModal;

const styles = StyleSheet.create({});
