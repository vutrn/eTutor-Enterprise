import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Link, LinkText } from "@/components/ui/link";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import MeetingDetailsModal from "@/src/components/meeting/MeetingDetails.modal";
import CreateMeetingModal from "@/src/components/meeting/CreateMeeting.modal";
import { useMeetingStore } from "@/src/store/useMeetingStore";
import { OfflineMeeting, OnlineMeeting } from "@/src/types/store";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";

const MeetingList = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const {
    setSelectedMeeting,
    getOfflineMeetings,
    getOnlineMeetings,
    selectedMeeting,
    offlineMeetings,
    onlineMeetings,
    loading,
  } = useMeetingStore();
  const [combinedMeetings, setCombinedMeetings] = useState<
    Array<
      (OfflineMeeting | OnlineMeeting) & { meetingType: "offline" | "online" }
    >
  >([]);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    loadAllMeetings();
  }, []);

  useEffect(() => {
    const offlineWithType = offlineMeetings?.map((meeting) => ({
      ...meeting,
      meetingType: "offline" as const,
    }));

    const onlineWithType = onlineMeetings?.map((meeting) => ({
      ...meeting,
      meetingType: "online" as const,
    }));

    const combined = [...offlineWithType, ...onlineWithType].sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    setCombinedMeetings(combined);
  }, [offlineMeetings, onlineMeetings, loading]);

  const loadAllMeetings = async () => {
    await Promise.all([getOfflineMeetings(), getOnlineMeetings()]);
  };

  const handleViewDetails = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };

  const handleCreateMeeting = () => {
    setIsCreateModalOpen(true);
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
          <Button size="sm" onPress={handleCreateMeeting} action="primary">
            <ButtonText>Create Meeting</ButtonText>
          </Button>
        </GridItem>
      );
    }

    return combinedMeetings?.map((meeting, index) => {
      const isOfflineMeeting = meeting?.meetingType === "offline";

      return (
        <GridItem
          key={meeting?._id || index}
          className="transition-all duration-200 hover:bg-background-50"
          _extra={{
            className: "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3",
          }}
        >
          <Box
            className={`h-full rounded-md ${isOfflineMeeting ? "bg-background-100" : "bg-blue-50"} p-3`}
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

              <Text highlight className="p-1">
                {format(new Date(meeting.time), "eee HH:mm | MMM dd, yyyy")}
              </Text>

              {isOfflineMeeting ? (
                <Text className="text-sm">
                  Location:{" "}
                  {(meeting as OfflineMeeting).location || "Not specified"}
                </Text>
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
                <Text size="sm" className="font-semibold">
                  {meeting.attendees?.length || 0} attendees
                </Text>
                <Button
                  size="xs"
                  variant="outline"
                  onPress={() => handleViewDetails(meeting)}
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

            <Button size="sm" onPress={handleCreateMeeting} action="primary">
              <ButtonText>Create Meeting</ButtonText>
            </Button>
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
      <MeetingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        meeting={selectedMeeting as any}
      />
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Box>
  );
};

export default MeetingList;

const styles = StyleSheet.create({});
