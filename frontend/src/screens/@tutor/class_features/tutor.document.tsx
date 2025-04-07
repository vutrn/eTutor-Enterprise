import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import alert from "../../../components/alert";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClassStore } from "../../../store/useClassStore";
import { useDocumentStore } from "../../../store/useDocumentStore";
import {
  Archive,
  ExternalLink,
  File,
  FileMinus,
  FilePlus,
  FileText,
  FileTextIcon,
  Image,
  Music,
  RefreshCcw,
  Trash2,
  Upload,
  Video,
} from "lucide-react-native";

const getDocumentIcon = (filename: string): any => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  // Document types
  if (["doc", "docx", "rtf"].includes(extension)) return FileText;
  if (["xls", "xlsx", "csv"].includes(extension)) return FilePlus;
  if (["ppt", "pptx"].includes(extension)) return FileMinus;
  if (["pdf"].includes(extension)) return FileTextIcon;
  if (["txt"].includes(extension)) return File;
  if (["zip", "rar", "7z"].includes(extension)) return Archive;

  // Image types
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension))
    return Image;

  // Video types
  if (["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(extension))
    return Video;

  // Audio types
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(extension)) return Music;

  return File;
};

const getDocumentColor = (filename: string) => {
  const extension = filename.split(".").pop()?.toLowerCase() || "";

  // Document types
  if (["doc", "docx", "rtf"].includes(extension)) return "text-blue-600";
  if (["xls", "xlsx", "csv"].includes(extension)) return "text-green-600";
  if (["ppt", "pptx"].includes(extension)) return "text-orange-600";
  if (["pdf"].includes(extension)) return "text-red-600";

  // Media types
  if (["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"].includes(extension))
    return "text-green-500";
  if (["mp4", "avi", "mov", "wmv", "flv", "mkv", "webm"].includes(extension))
    return "text-orange-500";
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(extension))
    return "text-purple-500";
  if (["zip", "rar", "7z"].includes(extension)) return "text-amber-700";

  // Default color
  return "text-gray-600";
};

const TutorDocument = () => {
  const { documents, getDocuments, uploadDocument, deleteDocument, loading } =
    useDocumentStore();
  const { selectedClass } = useClassStore();
  const { authUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 64) / 3;

  useEffect(() => {
    if (selectedClass && selectedClass._id) {
      loadDocuments();
    }
  }, [selectedClass]);

  const loadDocuments = async () => {
    try {
      setRefreshing(true);
      await getDocuments(selectedClass._id);
    } catch (error) {
      console.error("Failed to load documents:", error);
      Toast.show({
        type: "error",
        text1: "Failed to load documents",
        text2: "Please try again",
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handlePickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
      copyToCacheDirectory: true,
    });

    if (
      result.canceled === false &&
      result.assets &&
      result.assets.length > 0
    ) {
      const file = result.assets[0];
      const formData = new FormData();

      if ((file.size as any) > 10 * 1024 * 1024) {
        return Toast.show({
          type: "error",
          text1: "File too large",
          text2: "Please select a file smaller than 10MB",
        });
      }
      formData.append("file", file.file as any);
      formData.append("userId", authUser?._id as any);
      await uploadDocument(formData, selectedClass._id);
      loadDocuments();
    }
  };

  const openDocument = (url: string) => {
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: "error",
        text1: "Error opening document",
        text2: "Could not open the document URL",
      });
    });
  };

  const handleDeleteDocument = async (selectedDocumentId: string) => {
    try {
      alert("Are you sure?", "This action cannot be undone", [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => {},
        },
        {
          text: "Delete",
          onPress: async () => {
            await deleteDocument(selectedClass._id, selectedDocumentId);
            loadDocuments();
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const renderItem = ({ item }: any) => {
    const iconComponent = getDocumentIcon(item.filename);
    const iconColor = getDocumentColor(item.filename);

    return (
      <Box
        className="m-2 rounded-lg bg-white p-4 shadow"
        style={{ width: itemWidth }}
      >
        <VStack space="md">
          <HStack className="items-center space-x-2">
            <Icon as={iconComponent} size="md" className={iconColor} />
            <Text
              className="flex-1 text-lg font-bold text-gray-800"
              numberOfLines={1}
            >
              {item.filename}
            </Text>
          </HStack>

          <HStack>
            <Badge className="bg-blue-100" size="sm">
              <Text className="text-xs text-blue-600">
                {format(new Date(item.uploadedAt), "dd/MM/yyyy")}
              </Text>
            </Badge>
          </HStack>

          <HStack space="sm" className="mt-2">
            <Button
              onPress={() => openDocument(item.url)}
              className="flex-1"
              size="sm"
              action="primary"
            >
              <ButtonIcon as={ExternalLink} size="sm" />
              <ButtonText>Open</ButtonText>
            </Button>

            <Button
              onPress={() => handleDeleteDocument(item._id)}
              className="flex-1"
              size="sm"
              action="negative"
              variant="outline"
            >
              <ButtonIcon as={Trash2} size="sm" />
              <ButtonText>Delete</ButtonText>
            </Button>
          </HStack>
        </VStack>
      </Box>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Box className="flex-1">
        <Box className="flex-row items-center justify-between border-b border-gray-300 bg-white p-4">
          <Heading size="lg" className="text-gray-800">
            Documents
          </Heading>
          <Button
            size="md"
            action="primary"
            onPress={handlePickDocument}
            className="rounded-md"
          >
            <ButtonIcon as={Upload} size="sm" />
            <ButtonText>Upload</ButtonText>
          </Button>
        </Box>

        {loading ? (
          <Box className="flex-1 items-center justify-center">
            <Spinner size="large" />
            <Text className="mt-3 text-gray-600">Loading documents...</Text>
          </Box>
        ) : (
          <FlatList
            data={documents}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ padding: 16 }}
            numColumns={3}
            columnWrapperStyle={{
              justifyContent: "flex-start",
              gap: 16,
            }}
            onRefresh={loadDocuments}
            refreshing={refreshing}
            ListEmptyComponent={
              <Box className="items-center justify-center py-10">
                <Text className="mb-4 text-base text-gray-600">
                  No documents available
                </Text>
                <Button
                  variant="outline"
                  onPress={loadDocuments}
                  className="mt-2"
                >
                  <ButtonIcon as={RefreshCcw} size="sm" />
                  <ButtonText>Refresh</ButtonText>
                </Button>
              </Box>
            }
          />
        )}
      </Box>
    </SafeAreaView>
  );
};
export default TutorDocument;
