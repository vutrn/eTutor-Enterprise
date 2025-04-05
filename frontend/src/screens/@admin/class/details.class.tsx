import { Badge, BadgeText } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import React from "react";
import { Modal } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useClassStore } from "../../../store/useClassStore";
import { User, X } from "lucide-react-native";

interface Props {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const ClassDetails = ({ modalVisible, setModalVisible }: Props) => {
  const { selectedClass } = useClassStore();

  if (!selectedClass) return null;

  return (
    <Modal
    
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <Box className="flex-1 items-center justify-center bg-black/50 p-4">
        <Box className="w-full max-w-md rounded-xl bg-white p-5 shadow-lg">
          <HStack className="mb-4 items-center justify-between">
            <Heading size="lg">Class Details</Heading>
            <Button
              size="sm"
              variant="link"
              onPress={() => setModalVisible(false)}
            >
              <Icon as={X} size="md" color="$gray500" />
            </Button>
          </HStack>

          <Divider className="mb-4" />

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <VStack className="space-y-4">
              <Box>
                <Text className="mb-1 text-gray-500">Class Name</Text>
                <Text className="text-lg font-semibold">
                  {selectedClass.name}
                </Text>
              </Box>

              <Box>
                <Text className="mb-1 text-gray-500">Tutor</Text>
                <HStack className="items-center space-x-2">
                  <Icon as={User} size="sm" className="text-blue-500" />
                  <Text className="font-medium">
                    {selectedClass.tutor?.username || "Not assigned"}
                  </Text>
                </HStack>
              </Box>

              <Box>
                <Text className="mb-1 text-gray-500">Students</Text>
                {selectedClass.students && selectedClass.students.length > 0 ? (
                  <VStack className="space-y-2">
                    {selectedClass.students.map((student: any) => (
                      <HStack
                        key={student._id}
                        className="items-center space-x-2"
                      >
                        <Icon as={User} size="sm" />
                        <Text>{student.username}</Text>
                      </HStack>
                    ))}
                  </VStack>
                ) : (
                  <Text className="italic">No students enrolled</Text>
                )}
              </Box>

              <HStack className="flex-wrap space-x-2">
                <Badge variant="outline" className="px-2 py-1">
                  <BadgeText>
                    Created:{" "}
                    {new Date(selectedClass.createdAt).toLocaleDateString()}
                  </BadgeText>
                </Badge>
              </HStack>
            </VStack>
          </ScrollView>

          <Divider className="my-4" />

          <Button
            onPress={() => setModalVisible(false)}
            className="mt-2"
            variant="outline"
          >
            <ButtonText>Close</ButtonText>
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ClassDetails;
