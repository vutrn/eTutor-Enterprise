import { Badge } from "@/components/ui/badge";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { format } from "date-fns";
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
  Video,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Linking, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
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

const StudentDocument = () => {
  const { documents, getDocuments, loading } = useDocumentStore();
  const { selectedClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);

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

  const openDocument = (url: string) => {
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: "error",
        text1: "Error opening document",
        text2: "Could not open the document URL",
      });
    });
  };

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
            <Spinner size="large" />
            <Text className="mt-3 text-gray-600">Loading documents...</Text>
          </Box>
        </GridItem>
      );
    }

    if (documents.length === 0) {
      return (
        <GridItem
          className="col-span-12 rounded-md p-6 text-center"
          _extra={{
            className: "col-span-12",
          }}
        >
          <Box className="items-center justify-center py-10">
            <Text className="mb-4 text-base text-gray-600">
              No documents available
            </Text>
            <Button variant="outline" onPress={loadDocuments} className="mt-2">
              <ButtonIcon as={RefreshCcw} size="sm" />
              <ButtonText>Refresh</ButtonText>
            </Button>
          </Box>
        </GridItem>
      );
    }

    return documents.map((item, index) => {
      const iconComponent = getDocumentIcon(item.filename);
      const iconColor = getDocumentColor(item.filename);

      return (
        <GridItem
          key={item._id || index}
          className="transition-all duration-200 hover:bg-background-50"
          _extra={{
            className: "col-span-12 sm:col-span-6 lg:col-span-4 xl:col-span-3",
          }}
        >
          <Box className="m-2 rounded-lg bg-white p-4 shadow">
            <VStack space="md">
              <HStack className="items-center space-x-2">
                <Icon as={iconComponent} size="md" className={iconColor} />
                <Text className="line-clamp-1 text-lg font-bold text-gray-800">
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

              <Box style={{ flex: 1 }} />

              <Button
                onPress={() => openDocument(item.url)}
                className="mt-auto w-full"
                size="sm"
                action="primary"
              >
                <ButtonIcon as={ExternalLink} size="sm" />
                <ButtonText>Open Document</ButtonText>
              </Button>
            </VStack>
          </Box>
        </GridItem>
      );
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <Box className="flex-1">
        <Box className="border-b border-gray-300 bg-white p-4">
          <Heading size="lg" className="text-gray-800">
            Class Documents
          </Heading>
        </Box>

        <ScrollView
          contentContainerStyle={{
            paddingBottom: isWeb ? 0 : 100,
            flexGrow: 1,
          }}
        >
          <VStack className="w-full p-4" space="lg">
            <Grid
              className="gap-3"
              _extra={{
                className: "grid-cols-12",
              }}
            >
              {renderDocumentCards()}
            </Grid>

            {loading && documents.length > 0 && (
              <HStack className="justify-center p-4">
                <Text>Loading more documents...</Text>
              </HStack>
            )}
          </VStack>
        </ScrollView>
      </Box>
    </SafeAreaView>
  );
};

export default StudentDocument;
