import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "@/components/ui/form-control";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
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
import {
  Select,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { VStack } from "@/components/ui/vstack";
import { AlertCircle, ChevronDown, UserPlus, X } from "lucide-react-native";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/useAuthStore";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const CreateUserModal = ({ isOpen, onClose }: Props) => {
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {
      username: "",
      email: "",
      password: "",
    };

    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (formData.username.length < 5) {
      newErrors.username = "Username must be at least 5 characters";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleCreateUser = async () => {
    if (!validateForm()) return;

    try {
      const res = await signup(formData);
      if (res) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "User created successfully",
        });
        resetForm();
        onClose();
      }
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "User creation failed",
        text2: error.response?.data?.message || "An error occurred",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      role: "student",
      password: "",
    });
    setErrors({
      username: "",
      email: "",
      password: "",
    });
  };

  return (
    <Modal
      size="lg"
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
    >
      <ModalBackdrop />

      <ModalContent className="m-4">
        <ModalHeader>
          <Heading size="lg">Create New User</Heading>
          <ModalCloseButton>
            <Icon as={X} />
          </ModalCloseButton>
        </ModalHeader>

        <ModalBody>
          <VStack space="md">
            {/* Username Input */}
            <FormControl isInvalid={!!errors.username}>
              <FormControlLabel>
                <FormControlLabelText>Username</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={formData.username}
                  onChangeText={(text) =>
                    setFormData({ ...formData, username: text })
                  }
                  placeholder="Enter username"
                />
              </Input>
              {errors.username ? (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} />
                  <FormControlErrorText>{errors.username}</FormControlErrorText>
                </FormControlError>
              ) : (
                <FormControlHelper>
                  <FormControlHelperText>
                    Username must be at least 5 characters
                  </FormControlHelperText>
                </FormControlHelper>
              )}
            </FormControl>

            {/* Email Input */}
            <FormControl isInvalid={!!errors.email}>
              <FormControlLabel>
                <FormControlLabelText>Email</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={formData.email}
                  onChangeText={(text) =>
                    setFormData({ ...formData, email: text })
                  }
                  placeholder="Enter email address"
                  keyboardType="email-address"
                />
              </Input>
              {errors.email ? (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} />
                  <FormControlErrorText>{errors.email}</FormControlErrorText>
                </FormControlError>
              ) : (
                <FormControlHelper>
                  <FormControlHelperText>
                    Enter a valid email address
                  </FormControlHelperText>
                </FormControlHelper>
              )}
            </FormControl>

            {/* Role Select */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Role</FormControlLabelText>
              </FormControlLabel>
              <Select
                selectedValue={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectInput placeholder="Select role" />
                  <SelectIcon as={ChevronDown} className="mr-3" />
                </SelectTrigger>
                <SelectPortal>
                  <SelectContent>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    <SelectItem label="Student" value="student" />
                    <SelectItem label="Tutor" value="tutor" />
                  </SelectContent>
                </SelectPortal>
              </Select>
              <FormControlHelper>
                <FormControlHelperText>
                  Select the user's role
                </FormControlHelperText>
              </FormControlHelper>
            </FormControl>

            {/* Password Input */}
            <FormControl isInvalid={!!errors.password}>
              <FormControlLabel>
                <FormControlLabelText>Password</FormControlLabelText>
              </FormControlLabel>
              <Input>
                <InputField
                  value={formData.password}
                  onChangeText={(text) =>
                    setFormData({ ...formData, password: text })
                  }
                  placeholder="Enter password"
                  secureTextEntry
                />
              </Input>
              {errors.password ? (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircle} />
                  <FormControlErrorText>{errors.password}</FormControlErrorText>
                </FormControlError>
              ) : (
                <FormControlHelper>
                  <FormControlHelperText>
                    Password must be at least 6 characters
                  </FormControlHelperText>
                </FormControlHelper>
              )}
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            action="secondary"
            onPress={() => {
              resetForm();
              onClose();
            }}
            className="mr-2 flex-1"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            variant="solid"
            action="primary"
            onPress={handleCreateUser}
            isDisabled={isSigningUp}
            className="flex-1"
          >
            {isSigningUp ? (
              <HStack className="items-center space-x-2">
                <Spinner color="white" size="small" />
                <ButtonText>Creating...</ButtonText>
              </HStack>
            ) : (
              <>
                <ButtonIcon as={UserPlus} className="mr-2" />
                <ButtonText>Create User</ButtonText>
              </>
            )}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateUserModal;
