import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useBlogStore } from "../../../store/useBlogStore";
import { FONTS } from "../../../utils/constant";

const TutorBlogCreate = () => {
  const { createBlog, getAllBlogs } = useBlogStore();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Create Blog",
      headerTitleStyle: {
        fontFamily: FONTS.bold,
        fontSize: 20,
      },
    });
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateBlog = async () => {
    if (!title.trim()) return Toast.show({ type: "error", text1: "ERROR", text2: "Title is required" });
    if (!content.trim()) return Toast.show({ type: "error", text1: "ERROR", text2: "Content is required" });
    if (title.length < 5)
      return Toast.show({ type: "error", text1: "ERROR", text2: "Title must be at least 5 characters" });
    if (content.length < 5)
      return Toast.show({ type: "error", text1: "ERROR", text2: "Content must be at least 5 characters" });

    setIsLoading(true);
    await createBlog(image || undefined, title, content);
    setImage(null);
    setTitle("");
    setContent("");
    await getAllBlogs();
    navigation.goBack();
    Toast.show({ type: "success", text1: "SUCCESS", text2: "Blog created successfully" });
    setIsLoading(false);
  };

  navigation.setOptions({
    headerRight: () => (
      <Button
        icon="plus"
        mode="contained"
        style={styles.createButton}
        onPress={handleCreateBlog}
        disabled={isLoading}
        loading={isLoading}
      >
        {isLoading ? "Creating..." : "Create"}
      </Button>
    ),
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {image && <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />}
        <Button onPress={pickImage}>Choose image</Button>
      </View>
      <TextInput
        mode="outlined"
        placeholder="Post Title"
        placeholderTextColor="#8E8E93"
        value={title}
        onChangeText={(text) => setTitle(text)}
        autoCapitalize="words"
        style={styles.titleInput}
        outlineStyle={{ borderWidth: 0 }}
      />
      {!title.trim() ? (
        <HelperText type="error" visible={true}>
          Title is required
        </HelperText>
      ) : null}
      {!title.trim() || title.length < 5 ? (
        <HelperText type="error" visible={true}>
          Title must be at least 5 characters
        </HelperText>
      ) : null}

      <TextInput
        mode="outlined"
        placeholder="Write your post..."
        multiline
        placeholderTextColor="#8E8E93"
        value={content}
        onChangeText={(text) => setContent(text)}
        style={styles.contentInput}
        outlineStyle={{ borderWidth: 0 }}
      />
      {!content.trim() ? (
        <HelperText type="error" visible={true}>
          Content is required
        </HelperText>
      ) : null}
      {!content.trim() || content.length < 5 ? (
        <HelperText type="error" visible={true}>
          Content must be at least 5 characters
        </HelperText>
      ) : null}
    </ScrollView>
  );
};

export default TutorBlogCreate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  imageContainer: {
    borderWidth: 2,
    borderStyle: "dashed",
    padding: 10,
    borderRadius: 15,
    borderColor: "#c4c4c4",
    backgroundColor: "#F2F2F7",
    gap: 10,
    marginBottom: 20,
  },
  image: {
    height: 200,
    borderRadius: 8,
  },
  titleInput: {
    // marginBottom: 20,
    fontSize: 24,
    backgroundColor: "white",
    fontFamily: FONTS.bold,
    fontWeight: "bold",
  },
  contentInput: {
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    minHeight: 200,
    backgroundColor: "white",
    fontFamily: FONTS.regular,
    borderWidth: 0,
    borderRadius: 8,
  },
  createButton: {
    backgroundColor: "#2D336B",
    borderRadius: 8,
    marginRight: 15,
  },
});
