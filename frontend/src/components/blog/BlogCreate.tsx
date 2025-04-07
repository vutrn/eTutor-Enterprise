import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useBlogStore } from "../../store/useBlogStore";

// Import Gluestack UI components
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { Input, InputField } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { VStack } from "@/components/ui/vstack";
import {
  AlertCircleIcon,
  ImagePlus,
  Upload,
  XCircle,
} from "lucide-react-native";

const BlogCreate = () => {
  const { createBlog } = useBlogStore();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    title: "",
    content: "",
  });
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  const validateForm = () => {
    let isValid = true;
    const newErrors = { title: "", content: "" };

    if (!title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    } else if (title.length < 5) {
      newErrors.title = "Title must be at least 5 characters";
      isValid = false;
    }

    if (!content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    } else if (content.length < 5) {
      newErrors.content = "Content must be at least 5 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleCreateBlog = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createBlog(title, content, image || undefined);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Blog post created successfully",
      });
      setImage(null);
      setTitle("");
      setContent("");
      navigation.navigate("blog_list");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to create blog post",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Card
          variant="elevated"
          size="md"
          className="mb-4 bg-white p-4 shadow-sm"
        >
          <VStack space="md">
            {/* Featured Image Upload */}
            <FormControl>
              <FormControlLabel>
                <FormControlLabelText>Featured Image</FormControlLabelText>
              </FormControlLabel>

              {!image ? (
                <Button
                  onPress={pickImage}
                  variant="outline"
                  action="secondary"
                  className="h-[200px] border-2 border-dashed border-gray-300 bg-gray-50"
                >
                  <VStack className="items-center">
                    <ButtonIcon
                      as={ImagePlus}
                      size="xl"
                      className="mb-2 text-gray-400"
                    />
                    <ButtonText>Upload an image</ButtonText>
                    {/* <Text className="mt-1 text-xs text-gray-500">
                      Recommended: 16:9 ratio
                    </Text> */}
                  </VStack>
                </Button>
              ) : (
                <Box className="relative">
                  <Image
                    source={{ uri: image }}
                    style={{ height: 200, width: "100%", borderRadius: 8 }}
                    resizeMode="cover"
                  />
                  <Button
                    onPress={removeImage}
                    variant="solid"
                    action="negative"
                    size="xs"
                    className="absolute right-2 top-2 rounded-full"
                  >
                    <ButtonIcon as={XCircle} />
                  </Button>
                </Box>
              )}
              {/* <FormControlHelperText>
                Adding an image will make your post more engaging
              </FormControlHelperText> */}
            </FormControl>

            {/* Title Input */}
            <FormControl isInvalid={!!errors.title}>
              <FormControlLabel>
                <FormControlLabelText>Title</FormControlLabelText>
              </FormControlLabel>
              <Input size="md" className="bg-gray-50">
                <InputField
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Title for your post"
                />
              </Input>
              {errors.title ? (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.title}</FormControlErrorText>
                </FormControlError>
              ) : (
                <FormControlHelper>
                  {/* <FormControlHelperText>
                    Make it clear and attention-grabbing
                  </FormControlHelperText> */}
                </FormControlHelper>
              )}
            </FormControl>

            {/* Content Input */}
            <FormControl isInvalid={!!errors.content}>
              <FormControlLabel>
                <FormControlLabelText>Content</FormControlLabelText>
              </FormControlLabel>
              <Textarea size="md" className="min-h-[200px] bg-gray-50">
                <TextareaInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="Write your blog post content here..."
                  multiline
                />
              </Textarea>
              {errors.content ? (
                <FormControlError>
                  <FormControlErrorIcon as={AlertCircleIcon} />
                  <FormControlErrorText>{errors.content}</FormControlErrorText>
                </FormControlError>
              ) : (
                <FormControlHelper>
                  {/* <FormControlHelperText>
                    Share your thoughts, knowledge, or experiences
                  </FormControlHelperText> */}
                </FormControlHelper>
              )}
            </FormControl>
          </VStack>
        </Card>

        {/* Action Buttons */}
        <HStack className="justify-end space-x-3">
          <Button
            variant="outline"
            action="secondary"
            onPress={() => navigation.goBack()}
            className="flex-1"
          >
            <ButtonText>Cancel</ButtonText>
          </Button>
          <Button
            variant="solid"
            action="primary"
            onPress={handleCreateBlog}
            isDisabled={isLoading}
            className="flex-1"
          >
            {isLoading ? (
              <HStack className="items-center space-x-2">
                <Spinner color="white" size="small" />
                <ButtonText>Creating...</ButtonText>
              </HStack>
            ) : (
              <HStack className="items-center space-x-2">
                <ButtonIcon as={Upload} className="mr-2" />
                <ButtonText>Publish Post</ButtonText>
              </HStack>
            )}
          </Button>
        </HStack>
      </ScrollView>
    </SafeAreaView>
  );
};

export default BlogCreate;
