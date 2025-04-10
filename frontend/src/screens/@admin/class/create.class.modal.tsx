import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { AlertCircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import { useClassStore } from "../../../store/useClassStore";
import { useUserStore } from "../../../store/useUserStore";

interface IProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

const CreateModal = ({ modalVisible, setModalVisible }: IProps) => {
  // Get data from stores
  const { tutors, students, getUsers, loading: loadingUsers } = useUserStore();
  const { createClass, loading: loadingClassCreation } = useClassStore();

  const [className, setClassName] = useState("");
  const [selectedTutor, setSelectedTutor] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const indexOfLastStudent = currentPage * itemsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - itemsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent,
  );
  const totalPages = Math.ceil(students.length / itemsPerPage);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState({
    className: false,
    tutor: false,
    students: false,
  });

  // Fetch users when component mounts or when modal becomes visible
  useEffect(() => {
    if (modalVisible) {
      getUsers();
    }
  }, [getUsers, modalVisible]);

  // Toggle student selection
  const toggleStudentSelection = (studentId: string) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter((id) => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }

    // Clear error if at least one student is selected
    if (!selectedStudents.includes(studentId)) {
      setErrors((prev) => ({ ...prev, students: false }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      className: false,
      tutor: false,
      students: false,
    };

    if (!className.trim()) {
      newErrors.className = true;
      isValid = false;
    }

    if (!selectedTutor) {
      newErrors.tutor = true;
      isValid = false;
    }

    if (selectedStudents.length === 0) {
      newErrors.students = true;
      isValid = false;
    }

    setErrors(newErrors);

    if (!isValid) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please fill in all required fields",
      });
    }

    return isValid;
  };

  // Handle form submission
  const handleCreateClass = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const success = await createClass(
        className,
        selectedTutor,
        selectedStudents,
      );
      if (success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Class created successfully",
        });
        handleCloseModal();
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create class",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setClassName("");
    setSelectedTutor("");
    setSelectedStudents([]);
    setErrors({
      className: false,
      tutor: false,
      students: false,
    });
    setModalVisible(false);
  };

  return (
    <Modal
      isOpen={modalVisible}
      onClose={handleCloseModal}
      size={isWeb ? "lg" : "full"}
      className="max-h-full"
    >
      <ModalBackdrop />
      <ModalContent className="max-h-[85vh]">
        <ModalHeader>
          <Heading>Create New Class</Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space="md">
              {/* CLASS NAME INPUT */}
              <FormControl isRequired isInvalid={errors.className}>
                <FormControlLabel>
                  <FormControlLabelText className="font-medium">
                    Class Name
                  </FormControlLabelText>
                </FormControlLabel>
                <Input>
                  <InputField
                    placeholder="Enter class name"
                    value={className}
                    onChangeText={(text) => {
                      setClassName(text);
                      if (text.trim()) {
                        setErrors((prev) => ({ ...prev, className: false }));
                      }
                    }}
                  />
                </Input>
                {errors.className && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      Class name is required
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              {/* TUTOR SELECTION */}
              <FormControl isRequired isInvalid={errors.tutor}>
                <FormControlLabel>
                  <FormControlLabelText className="font-medium">
                    Select Tutor
                  </FormControlLabelText>
                </FormControlLabel>

                {tutors.length > 0 ? (
                  <VStack className="mt-2 space-y-2">
                    {tutors.map((tutor) => (
                      <Pressable
                        key={tutor._id}
                        onPress={() => {
                          setSelectedTutor(tutor._id);
                          setErrors((prev) => ({ ...prev, tutor: false }));
                        }}
                      >
                        <Box
                          className={`rounded-md border p-3 ${
                            selectedTutor === tutor._id
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <HStack className="items-center justify-between">
                            <VStack>
                              <Text className="font-medium">
                                {tutor.username}
                              </Text>
                              <Text className="text-sm text-gray-500">
                                {tutor.email}
                              </Text>
                            </VStack>
                            {selectedTutor === tutor._id && (
                              <Badge className="bg-blue-500">
                                <Text className="text-white">Selected</Text>
                              </Badge>
                            )}
                          </HStack>
                        </Box>
                      </Pressable>
                    ))}
                  </VStack>
                ) : loadingUsers ? (
                  <HStack className="items-center justify-center p-4">
                    <ActivityIndicator size="small" color="#1890ff" />
                    <Text className="ml-2">Loading tutors...</Text>
                  </HStack>
                ) : (
                  <Box className="rounded-md bg-gray-50 p-4">
                    <Text className="text-center text-gray-500">
                      No tutors available
                    </Text>
                  </Box>
                )}

                {errors.tutor && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      Please select a tutor
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>

              <Divider className="my-2" />

              {/* STUDENT SELECTION */}
              <FormControl isRequired isInvalid={errors.students}>
                <FormControlLabel>
                  <HStack className="items-center justify-between">
                    <FormControlLabelText className="font-medium">
                      Select Students
                    </FormControlLabelText>
                    <Badge className="bg-blue-100">
                      <Text className="text-blue-700">
                        {selectedStudents.length} selected
                      </Text>
                    </Badge>
                  </HStack>
                </FormControlLabel>

                {students.length > 0 ? (
                  <VStack className="mt-2 space-y-2">
                    {currentStudents.map((student) => (
                      <Pressable
                        key={student._id}
                        onPress={() => toggleStudentSelection(student._id)}
                      >
                        <Box
                          className={`rounded-md border p-3 ${
                            selectedStudents.includes(student._id)
                              ? "border-blue-400 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <HStack className="items-center justify-between">
                            <VStack>
                              <Text className="font-medium">
                                {student.username}
                              </Text>
                              <Text className="text-sm text-gray-500">
                                {student.email}
                              </Text>
                            </VStack>
                            {selectedStudents.includes(student._id) && (
                              <Badge className="bg-blue-500">
                                <Text className="text-white">Selected</Text>
                              </Badge>
                            )}
                          </HStack>
                        </Box>
                      </Pressable>
                    ))}
                    <HStack className="items-center justify-center" space="md">
                      <Button
                        variant="outline"
                        onPress={goToPreviousPage}
                        disabled={currentPage === 1}
                      >
                        <ButtonText>Previous</ButtonText>
                      </Button>

                      <Text>
                        {currentPage} of {totalPages}
                      </Text>

                      <Button
                        variant="outline"
                        onPress={goToNextPage}
                        disabled={currentPage === totalPages}
                      >
                        <ButtonText>Next</ButtonText>
                      </Button>
                    </HStack>
                  </VStack>
                ) : loadingUsers ? (
                  <HStack className="items-center justify-center p-4">
                    <ActivityIndicator size="small" color="#1890ff" />
                    <Text className="ml-2">Loading students...</Text>
                  </HStack>
                ) : (
                  <Box className="rounded-md bg-gray-50 p-4">
                    <Text className="text-center text-gray-500">
                      No students available
                    </Text>
                  </Box>
                )}

                {errors.students && (
                  <FormControlError>
                    <FormControlErrorIcon as={AlertCircleIcon} />
                    <FormControlErrorText>
                      Please select at least one student
                    </FormControlErrorText>
                  </FormControlError>
                )}
              </FormControl>
            </VStack>
          </ScrollView>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onPress={handleCloseModal} className="mr-2">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={handleCreateClass}
            isDisabled={isSubmitting || loadingClassCreation}
            action="primary"
          >
            {isSubmitting || loadingClassCreation ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <ButtonText>Create Class</ButtonText>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateModal;
