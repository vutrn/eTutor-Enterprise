import { NavigationProp, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import Toast from "react-native-toast-message";
import { useBlogStore } from "../../store/useBlogStore";
import { FONTS } from "../../utils/constant";

const BlogUpdate = () => {
  const { selectedBlog, setSelectedBlog, updateBlog } = useBlogStore();
  const [image, setImage] = useState<string | null>(null);
  const [title, setTitle] = useState(selectedBlog.title || "");
  const [content, setContent] = useState(selectedBlog.content || "");
  const [isLoading, setIsLoading] = useState(false);
  const navigation: NavigationProp<RootStackParamList> = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          icon="content-save"
          mode="contained"
          style={styles.createButton}
          onPress={() => {
            handleUpdateBlog();
          }}
          disabled={isLoading}
          loading={isLoading}
          contentStyle={{ flexDirection: "row-reverse" }}
        >
          {isLoading ? "Saving..." : "Save changes"}
        </Button>
      ),
    });
  }, [isLoading, title, content, image]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleUpdateBlog = async () => {
    if (!title.trim())
      return Toast.show({ type: "error", text1: "ERROR", text2: "Title is required" });
    if (title.length < 5)
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Title must be at least 5 characters",
      });
    if (!content.trim())
      return Toast.show({ type: "error", text1: "ERROR", text2: "Content is required" });
    if (content.length < 5)
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Content must be at least 5 characters",
      });

    setIsLoading(true);

    const success = await updateBlog(selectedBlog._id, title, content, image || undefined);
    if (success) {
      const currentBlog = { ...selectedBlog };
      setSelectedBlog({
        ...currentBlog,
        title,
        content,
        image: image || currentBlog.image,
      });

      navigation.goBack();
    }
    setIsLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} resizeMode="contain" />
        ) : selectedBlog.image ? (
          <Image source={{ uri: selectedBlog.image }} style={styles.image} resizeMode="contain" />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>No image selected</Text>
          </View>
        )}
        <Button onPress={pickImage}>{image ? "Change image" : "Choose image"}</Button>
      </View>

      <TextInput
        mode="outlined"
        placeholder="Post Title"
        placeholderTextColor="#8E8E93"
        value={title}
        onChangeText={setTitle}
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
        onChangeText={setContent}
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
  noImagePlaceholder: {
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#888",
    fontSize: 16,
    fontFamily: FONTS.regular,
  },
});

export default BlogUpdate;
