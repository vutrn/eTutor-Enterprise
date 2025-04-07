import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
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
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Pressable } from "@/components/ui/pressable";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { ArrowLeft, Eye, EyeOff, Lock, User } from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/useAuthStore";

const { width } = Dimensions.get("window");
const isTablet = width > 768;

const LoginScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  // Form validation states
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const { login, isLoggingIn } = useAuthStore();

  const validateForm = () => {
    let isValid = true;

    if (!formData.username.trim()) {
      setUsernameError("Username is required");
      isValid = false;
    } else {
      setUsernameError("");
    }

    if (!formData.password) {
      setPasswordError("Password is required");
      isValid = false;
    } else {
      setPasswordError("");
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await login(formData);
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: error.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <Box className={`${isTablet ? "w-[450px]" : "w-full"} mx-auto`}>
            {/* Login Card */}
            <Box className="rounded-2xl bg-white p-8 shadow-lg">
              {/* Logo and Header */}
              <VStack space="2xl" className="mb-8 items-center">
                <Image
                  source={require("../../../assets/black-graduate-hat.png")}
                  alt="eTutor Logo"
                  className="size-20"
                />
                <VStack space="xs" className="items-center">
                  <Heading size="2xl" className="text-primary-600">
                    Welcome Back
                  </Heading>
                  <Text className="text-center text-gray-500">
                    Sign in to continue to eTutor Enterprise
                  </Text>
                </VStack>
              </VStack>

              {/* Form */}
              <VStack space="lg">
                {/* Username Field */}
                <FormControl isInvalid={!!usernameError}>
                  <FormControlLabel>
                    <FormControlLabelText>Username</FormControlLabelText>
                  </FormControlLabel>

                  <Input variant="outline" size="lg">
                    <InputSlot>
                      <InputIcon
                        as={User}
                        size="md"
                        className="ml-1 text-gray-500"
                      />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your username"
                      value={formData.username}
                      onChangeText={(value) => {
                        setFormData({ ...formData, username: value });
                        if (value.trim()) setUsernameError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.nativeEvent.key === "Enter") {
                          handleLogin();
                        }
                      }}
                    />
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={User} />
                    <FormControlErrorText>{usernameError}</FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* Password Field */}
                <FormControl isInvalid={!!passwordError}>
                  <FormControlLabel>
                    <FormControlLabelText>Password</FormControlLabelText>
                  </FormControlLabel>

                  <Input variant="outline" size="lg">
                    <InputSlot>
                      <InputIcon
                        as={Lock}
                        size="md"
                        className="ml-1 text-gray-500"
                      />
                    </InputSlot>
                    <InputField
                      placeholder="Enter your password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChangeText={(value) => {
                        setFormData({ ...formData, password: value });
                        if (value) setPasswordError("");
                      }}
                      onKeyPress={(e) => {
                        if (e.nativeEvent.key === "Enter") {
                          handleLogin();
                        }
                      }}
                    />
                    <InputSlot>
                      <Pressable onPress={() => setShowPassword(!showPassword)}>
                        <InputIcon
                          as={showPassword ? EyeOff : Eye}
                          size="sm"
                          className="mr-2 text-gray-500"
                        />
                      </Pressable>
                    </InputSlot>
                  </Input>

                  <FormControlError>
                    <FormControlErrorIcon as={Lock} />
                    <FormControlErrorText>{passwordError}</FormControlErrorText>
                  </FormControlError>
                </FormControl>

                {/* Login Button */}
                <Button
                  size="lg"
                  variant="solid"
                  action="primary"
                  isDisabled={isLoggingIn}
                  isFocusVisible={false}
                  onPress={handleLogin}
                  className="mt-2"
                >
                  {isLoggingIn ? (
                    <ButtonText>Logging in...</ButtonText>
                  ) : (
                    <ButtonText>Login</ButtonText>
                  )}
                </Button>

                {/* Registration Link */}
                {/* <HStack space="sm" className="mt-4 items-center justify-center">
                  <Text className="text-gray-600">Don't have an account?</Text>
                  <Pressable onPress={() => navigation.navigate("signup")}>
                    <Text className="font-bold text-primary-600">Sign up</Text>
                  </Pressable>
                </HStack> */}
              </VStack>
            </Box>

            {/* Back to home button */}
            <Button
              variant="link"
              onPress={() => navigation.navigate("landing")}
              className="mt-6"
            >
              <ButtonIcon
                as={ArrowLeft}
                size="sm"
                className="mr-1 text-primary-600"
              />
              <ButtonText className="text-primary-600">Back to Home</ButtonText>
            </Button>
          </Box>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
  },
});

export default LoginScreen;
