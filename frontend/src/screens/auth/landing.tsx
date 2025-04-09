import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessageCircle,
  MessageSquare,
  Video,
} from "lucide-react-native";
import React from "react";
import { Dimensions, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const isTablet = width > 768;

const FeatureCard = ({
  icon,
  title,
  description,
}: {
  icon: any;
  title: string;
  description: string;
}) => {
  return (
    <Box
      className={`${isTablet ? "w-[30%]" : "w-full"} align-center rounded-xl p-6`}
      style={{ marginBottom: 20, marginHorizontal: isTablet ? 10 : 0 }}
    >
      <VStack space="md" className="items-center text-center">
        <Box className="mb-2 size-12 items-center justify-center rounded-full bg-gray-200">
          {icon}
        </Box>
        <Heading size="lg" className="text-gray-800">
          {title}
        </Heading>
        <Text className="text-center text-gray-600">{description}</Text>
      </VStack>
    </Box>
  );
};

const LandingScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const navigateToLogin = () => {
    navigation.navigate("login");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Login Button */}
      <Box className="border-b border-gray-200 bg-white px-6 py-4">
        <HStack className="items-center justify-between">
          <HStack className="items-center space-x-2">
            <Image
              source={require("../../../assets/black-graduate-hat.png")}
              alt="eTutor Logo"
              className="size-10"
            />
            <Heading size="lg" className="text-primary-600">
              eTutor
            </Heading>
          </HStack>

          <Button
            size="md"
            action="primary"
            variant="solid"
            onPress={navigateToLogin}
            className="rounded-full px-6"
          >
            <ButtonText>Login</ButtonText>
            <ButtonIcon as={ArrowRight} className="ml-1" />
          </Button>
        </HStack>
      </Box>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Section */}
        <Box className={`px-6 py-12 ${isTablet ? "py-20" : ""}`}>
          <VStack
            space="xl"
            className={`${isTablet ? "w-[70%]" : "w-full"} mx-auto items-center`}
          >
            <Heading size="2xl" className="text-center text-gray-800">
              Welcome to eTutor
            </Heading>

            <Text className="mb-6 text-center text-lg text-gray-600">
              The comprehensive platform connecting students and tutors for
              personalized learning experiences
            </Text>

            <Button
              size="lg"
              action="primary"
              variant="solid"
              onPress={navigateToLogin}
              className="mt-4 rounded-full px-8 py-3"
            >
              <ButtonText>Get Started</ButtonText>
              <ButtonIcon as={ArrowRight} />
            </Button>
          </VStack>
        </Box>

        {/* Features Section */}
        <Box className="bg-gray-50 px-6 py-12">
          <VStack space="xl" className="items-center">
            <Heading size="3xl" className="mb-2 text-center text-gray-800">
              Key Features
            </Heading>

            <Text className="mb-8 text-center text-gray-600">
              Everything you need for effective online tutoring
            </Text>

            <Box
              className={`flex-row flex-wrap ${isTablet ? "justify-between" : ""}`}
            >
              <FeatureCard
                icon={<MessageCircle size={28} className="text-primary-600" />}
                title="Messaging System"
                description="Direct communication between students and tutors for quick questions and guidance."
              />

              <FeatureCard
                icon={<BookOpen size={28} className="text-primary-600" />}
                title="Resource Sharing"
                description="Share documents, assignments, and study materials securely within the platform."
              />

              <FeatureCard
                icon={<GraduationCap size={28} className="text-primary-600" />}
                title="Meeting Management"
                description="Schedule, arrange, and record both in-person and virtual meetings with your personal tutor."
              />
            </Box>
          </VStack>
        </Box>

        {/* Footer */}
        <Box className="bg-gray-800 px-6 py-8">
          <VStack space="md">
            <HStack className="items-center space-x-2">
              <Image
                source={require("../../../assets/black-graduate-hat.png")}
                alt="eTutor Logo"
                className="size-8"
                style={{ tintColor: "white" }}
              />
              <Heading size="md" className="text-white">
                eTutor Enterprise
              </Heading>
            </HStack>

            <Text className="text-gray-400">
              © {new Date().getFullYear()} eTutor Enterprise. All rights
              reserved.
            </Text>
          </VStack>
        </Box>
      </ScrollView>
    </SafeAreaView>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
});

export default LandingScreen;
