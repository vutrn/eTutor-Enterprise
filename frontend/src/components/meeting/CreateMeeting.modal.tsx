import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
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
import { AlertCircleIcon, CircleIcon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Link, LinkText } from "@/components/ui/link";
import { Menu, MenuItem } from "@/components/ui/menu";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/modal";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import { useMeetingStore } from "@/src/store/useMeetingStore";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import React, { useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import Toast from "react-native-toast-message";
import DateTimePicker, { useDefaultStyles } from "react-native-ui-datepicker";
import { DatetimePicker } from "../DatetimePicker";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const googleMeetRegex =
  /^https:\/\/meet\.google\.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}$/i;

const CreateMeetingModal = ({ isOpen, onClose }: Props) => {
  const defaultStyles = useDefaultStyles();
  const {
    getOfflineMeetings,
    getOnlineMeetings,
    createOfflineMeeting,
    createOnlineMeeting,
    loading,
  } = useMeetingStore();
  const [meetingType, setMeetingType] = useState<"offline" | "online">(
    "offline",
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [linkggmeet, setLinkggmeet] = useState("");
  const [meetingDate, setMeetingDate] = useState<Date>(new Date());
  const [isCreating, setIsCreating] = useState(false);

  const [errors, setErrors] = useState({
    title: false,
    location: false,
    linkggmeet: false,
    linkggmeetFormat: false,
  });

  const resetForm = () => {
    setMeetingType("offline");
    setTitle("");
    setDescription("");
    setLocation("");
    setLinkggmeet("");
    setMeetingDate(new Date());
    setErrors({
      title: false,
      location: false,
      linkggmeet: false,
      linkggmeetFormat: false,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      title: false,
      location: false,
      linkggmeet: false,
      linkggmeetFormat: false,
    };

    if (!title.trim()) {
      newErrors.title = true;
      isValid = false;
    }

    if (meetingType === "offline" && !location.trim()) {
      newErrors.location = true;
      isValid = false;
    }

    if (meetingType === "online") {
      newErrors.linkggmeet = true;
      isValid = false;
    } else if (!googleMeetRegex.test(linkggmeet.trim())) {
      newErrors.linkggmeetFormat = true;
      isValid = false;
    }

    setErrors(newErrors);

    // if (!isValid) {
    //   Toast.show({
    //     type: "error",
    //     text1: "Error",
    //     text2: "Please fill in all required fields",
    //   });
    // }

    return isValid;
  };

  const handleCreateMeeting = async () => {
    if (!validateForm()) return;

    setIsCreating(true);
    try {
      if (meetingType === "offline") {
        await createOfflineMeeting(title, description, location, meetingDate);
      } else {
        await createOnlineMeeting(title, linkggmeet, meetingDate);
      }
      await loadAllMeetings();
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Meeting created successfully",
      });

      handleClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create meeting",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const loadAllMeetings = async () => {
    await Promise.all([getOfflineMeetings(), getOnlineMeetings()]);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size={isWeb ? "lg" : "full"}
      className="max-h-full"
    >
      <ModalBackdrop />
      <ModalContent className="max-h-[85vh]">
        <ModalHeader>
          <Heading>Create New Meeting</Heading>
          <ModalCloseButton />
        </ModalHeader>

        <ModalBody>
          <ScrollView>
            <VStack space="xs">
              <FormControl isRequired>
                <FormControlLabel className="gap-2">
                  <FormControlLabelText className="font-medium">
                    Meeting Type
                  </FormControlLabelText>
                  <RadioGroup
                    value={meetingType}
                    onChange={(value) =>
                      setMeetingType(value as "offline" | "online")
                    }
                  >
                    <HStack space="xl">
                      <Radio value="offline">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel>Offline</RadioLabel>
                      </Radio>
                      <Radio value="online">
                        <RadioIndicator>
                          <RadioIcon as={CircleIcon} />
                        </RadioIndicator>
                        <RadioLabel className="font-medium">Online</RadioLabel>
                      </Radio>
                    </HStack>
                  </RadioGroup>
                </FormControlLabel>
                <FormControl isRequired isInvalid={errors.title}>
                  <FormControlLabel>
                    <FormControlLabelText className="font-medium">
                      Title
                    </FormControlLabelText>
                  </FormControlLabel>
                  <Input>
                    <InputField
                      placeholder="Enter meeting title"
                      value={title}
                      onChangeText={(text) => {
                        setTitle(text);
                        if (text.trim()) {
                          setErrors((prev) => ({ ...prev, title: false }));
                        }
                      }}
                    />
                  </Input>
                  {errors.title && (
                    <FormControlError>
                      <FormControlErrorIcon as={AlertCircleIcon} />
                      <FormControlErrorText>
                        Title is required
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>Title is required</FormControlErrorText>
                </FormControlError>

                <FormControlLabel>
                  <FormControlLabelText className="font-medium">
                    Date & Time
                  </FormControlLabelText>
                </FormControlLabel>

                <Box>
                  <DatetimePicker
                    value={meetingDate}
                    onChange={(dateStr: string) => {
                      setMeetingDate(new Date(dateStr));
                    }}
                  />
                </Box>
                {meetingType === "offline" ? (
                  <>
                    {/* OFFLINE TYPE */}
                    <FormControl isRequired isInvalid={errors.location}>
                      <FormControlLabel>
                        <FormControlLabelText className="font-medium">
                          Location
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder="Enter meeting location"
                          value={location}
                          onChangeText={(text) => {
                            setLocation(text);
                            if (text.trim()) {
                              setErrors((prev) => ({
                                ...prev,
                                location: false,
                              }));
                            }
                          }}
                        />
                      </Input>
                      {errors.location && (
                        <FormControlError>
                          <FormControlErrorIcon as={AlertCircleIcon} />
                          <FormControlErrorText>
                            Location is required
                          </FormControlErrorText>
                        </FormControlError>
                      )}
                    </FormControl>

                    <FormControl>
                      <FormControlLabel>
                        <FormControlLabelText className="font-medium">
                          Description
                        </FormControlLabelText>
                      </FormControlLabel>
                      <Textarea>
                        <TextareaInput
                          placeholder="Enter meeting description"
                          value={description}
                          onChangeText={setDescription}
                        />
                      </Textarea>
                    </FormControl>
                  </>
                ) : (
                  <>
                    {/* ONLINE TYPE */}
                    <FormControl isRequired isInvalid={errors.linkggmeet}>
                      <FormControlLabel className="gap-2">
                        <FormControlLabelText>
                          Google Meet Link
                        </FormControlLabelText>
                        <Link href="https://meet.google.com/new" isExternal>
                          <LinkText>Create one</LinkText>
                        </Link>
                      </FormControlLabel>
                      <Input>
                        <InputField
                          placeholder="Enter Google Meet link"
                          value={linkggmeet}
                          onChangeText={(text) => {
                            setLinkggmeet(text);
                            if (text.trim()) {
                              setErrors((prev) => ({
                                ...prev,
                                linkggmeet: false,
                                linkggmeetFormat: !googleMeetRegex.test(
                                  text.trim(),
                                ),
                              }));
                            }
                          }}
                        />
                      </Input>
                      {errors.linkggmeet && (
                        <FormControlError>
                          <FormControlErrorIcon as={AlertCircleIcon} />
                          <FormControlErrorText>
                            Google Meet link is required
                          </FormControlErrorText>
                        </FormControlError>
                      )}
                      {errors.linkggmeetFormat && (
                        <FormControlError>
                          <FormControlErrorIcon as={AlertCircleIcon} />
                          <FormControlErrorText>
                            Invalid Google Meet link format.
                          </FormControlErrorText>
                        </FormControlError>
                      )}
                    </FormControl>
                  </>
                )}
              </FormControl>
            </VStack>
          </ScrollView>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" onPress={handleClose} className="mr-2">
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            onPress={handleCreateMeeting}
            isDisabled={isCreating || loading}
            action="primary"
          >
            {isCreating ? (
              <ActivityIndicator size="small" color="#ffffff" />
            ) : (
              <ButtonText>Create Meeting</ButtonText>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateMeetingModal;
