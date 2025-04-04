import { Box } from "@/components/ui/box";
import MeetingList from "@/src/components/meeting/MeetingList";
import StudentMeetingDetailsModal from "@/src/components/meeting/StudentMeetingDetails.modal";
import { useClassStore } from "@/src/store/useClassStore";
import { useMeetingStore } from "@/src/store/useMeetingStore";
import { OfflineMeeting, OnlineMeeting } from "@/src/types/store";
import React, { useEffect, useState } from "react";

const StudentMeeting = () => {
  const { getOfflineMeetings, getOnlineMeetings, setSelectedMeeting } =
    useMeetingStore();
  const { selectedClass } = useClassStore();

  const [selectedMeeting, setSelectedMeetingLocal] = useState<
    | null
    | ((OfflineMeeting | OnlineMeeting) & { meetingType: "offline" | "online" })
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadAllMeetings();
  }, [selectedClass._id]);

  const loadAllMeetings = async () => {
    await Promise.all([getOfflineMeetings(), getOnlineMeetings()]);
  };

  const handleViewDetails = (meeting: any) => {
    setSelectedMeetingLocal(meeting);
    setSelectedMeeting(meeting);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reload meetings to get updated attendance status
    loadAllMeetings();
  };

  return (
    <Box className="flex-1">
      <MeetingList onViewDetails={handleViewDetails} showCreateButton={false} />

      <StudentMeetingDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        meeting={selectedMeeting}
      />
    </Box>
  );
};

export default StudentMeeting;
