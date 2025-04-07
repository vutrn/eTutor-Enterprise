import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
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
  Search,
  Trash2,
  Upload,
  Video,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Linking, ScrollView, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import alert from "../../../components/alert";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClassStore } from "../../../store/useClassStore";
import { useDocumentStore } from "../../../store/useDocumentStore";

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
  const [searchQuery, setSearchQuery] = useState("");

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

  // Filter documents based on search query
  const filteredDocuments = documents.filter((doc) =>
    doc.filename.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const renderDocumentCards = () => {
    if (loading && documents.length === 0) {
      return (
        <GridItem
          className="col-span-12 rounded-md p-6 text-center"
          _extra={{
            className: "col-span-12",
          }}
        >
          <Box className="flex-1 items-center justify-center">
            <Spinner size="large" color="#4F46E5" />
            <Text className="mt-3 text-gray-600">Loading documents...</Text>
          </Box>
        </GridItem>
      );
    }

    if (filteredDocuments.length === 0) {
      return (
        <GridItem
          className="col-span-12 rounded-md p-6 text-center"
          _extra={{
            className: "col-span-12",
          }}
        >
          <Box className="items-center justify-center py-10">
            <Icon as={File} size="xl" className="mb-4 text-gray-400" />
            <Text className="mb-4 text-base text-gray-600">
              {searchQuery
                ? "No documents match your search"
                : "No documents available"}
            </Text>
            <Button variant="outline" onPress={loadDocuments} className="mt-2">
              <ButtonIcon as={RefreshCcw} className="mr-2" />
              <ButtonText>Refresh</ButtonText>
            </Button>
          </Box>
        </GridItem>
      );
    }

    return filteredDocuments.map((item) => {
      const iconComponent = getDocumentIcon(item.filename);
      const iconColor = getDocumentColor(item.filename);

      return (
        <GridItem
          key={item._id}
          className="transition-all duration-200 hover:bg-background-50"
          _extra={{
            className: "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3",
          }}
        >
          <Box className="m-2 rounded-lg bg-white p-4 shadow-sm">
            <VStack space="md">
              <HStack className="items-center space-x-2">
                <Icon as={iconComponent} size="md" className={iconColor} />
                <Text className="line-clamp-1 text-sm font-bold text-gray-800">
                  {item.filename}
                </Text>
              </HStack>

              <HStack className="flex-wrap gap-2">
                <Badge className="bg-blue-100">
                  <Text className="text-xs text-blue-600">
                    {format(new Date(item.uploadedAt), "MMM d, yyyy")}
                  </Text>
                </Badge>
              </HStack>

              <HStack space="sm" className="mt-1">
                <Button
                  onPress={() => openDocument(item.url)}
                  className="flex-1"
                  size="sm"
                  action="primary"
                  variant="solid"
                >
                  <ButtonIcon as={ExternalLink} className="mr-1" size="sm" />
                  <ButtonText>Open</ButtonText>
                </Button>

                <Button
                  onPress={() => handleDeleteDocument(item._id)}
                  className="flex-1"
                  size="sm"
                  action="negative"
                  variant="outline"
                >
                  <ButtonIcon as={Trash2} className="mr-1" size="sm" />
                  <ButtonText>Delete</ButtonText>
                </Button>
              </HStack>
            </VStack>
          </Box>
        </GridItem>
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Box className="flex-1">
        <VStack>
          {/* Header */}
          <Box className="border-b border-gray-200 bg-white px-4 py-4">
            <HStack className="mb-4 items-center justify-between">
              <Heading size="lg" className="text-gray-800">
                Class Documents
              </Heading>
              <Button
                size="md"
                action="primary"
                onPress={handlePickDocument}
                className="rounded-md"
              >
                <ButtonIcon as={Upload} className="mr-2" size="sm" />
                <ButtonText>Upload Document</ButtonText>
              </Button>
            </HStack>

            {/* Search Bar */}
            <Input size="md" variant="outline" className="bg-gray-50">
              <InputField
                placeholder="Search documents..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <InputSlot className="pl-3">
                <InputIcon>
                  <Icon as={Search} size="sm" />
                </InputIcon>
              </InputSlot>
            </Input>
          </Box>

          {/* Document Grid */}
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={loadDocuments}
              />
            }
          >
            <Box className="p-4">
              <Grid
                className="gap-3"
                _extra={{
                  className: "grid-cols-12",
                }}
              >
                {renderDocumentCards()}
              </Grid>
            </Box>
          </ScrollView>
        </VStack>
      </Box>

      {refreshing && (
        <Box className="absolute inset-0 items-center justify-center bg-black/10">
          <Box className="rounded-lg bg-white p-6 shadow-md">
            <Spinner size="large" color="#4F46E5" />
            <Text className="mt-3">Loading documents...</Text>
          </Box>
        </Box>
      )}
    </SafeAreaView>
  );
};

export default TutorDocument;
