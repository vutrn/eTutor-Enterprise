import { Box } from "@/components/ui/box";
import CreateMeetingModal from "@/src/components/meeting/CreateMeeting.modal";
import MeetingDetailsModal from "@/src/components/meeting/MeetingDetails.modal";
import MeetingList from "@/src/components/meeting/MeetingList";
import { useMeetingStore } from "@/src/store/useMeetingStore";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";

const TutorMeetingList = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const {
    setSelectedMeeting,
    getOfflineMeetings,
    getOnlineMeetings,
    selectedMeeting,
  } = useMeetingStore();
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleViewDetails = (meeting: any) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };

  const handleCreateMeeting = () => {
    setIsCreateModalOpen(true);
  };

  // Load meetings when modal is closed
  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    loadAllMeetings();
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
    loadAllMeetings();
  };

  const loadAllMeetings = async () => {
    await Promise.all([getOfflineMeetings(), getOnlineMeetings()]);
  };

  return (
    <Box className="flex-1">
      <MeetingList
        onViewDetails={handleViewDetails}
        onCreateMeeting={handleCreateMeeting}
        showCreateButton={true}
      />

      <MeetingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        meeting={selectedMeeting as any}
      />

      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseCreateModal}
      />
    </Box>
  );
};

export default TutorMeetingList;
