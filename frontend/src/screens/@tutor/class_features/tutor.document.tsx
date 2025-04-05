import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { FlatList, Linking, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import alert from "../../../components/alert";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClassStore } from "../../../store/useClassStore";
import { useDocumentStore } from "../../../store/useDocumentStore";
import { Dimensions } from "react-native";

const TutorDocument = () => {
  const { documents, getDocuments, uploadDocument, deleteDocument, loading } =
    useDocumentStore();
  const { selectedClass } = useClassStore();
  const { authUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  const screenWidth = Dimensions.get("window").width;
  const itemWidth = (screenWidth - 64) / 3;

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setRefreshing(true);
    await getDocuments(selectedClass._id);
    setRefreshing(false);
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
    return (
      <View
        className="m-2 rounded-lg bg-white p-4 shadow"
        style={{ width: itemWidth }}
      >
        <Text className="mb-2 text-lg font-bold text-gray-800">
          {item.filename}
        </Text>
        <Text className="mb-4 text-sm text-gray-600">
          Uploaded: {format(new Date(item.uploadedAt), "dd/MM/yyyy")}
        </Text>
        <Button
          mode="contained"
          onPress={() => openDocument(item.url)}
          className="mb-2"
        >
          Open
        </Button>
        <Button
          mode="outlined"
          onPress={() => handleDeleteDocument(item._id)}
          className="mt-2"
        >
          Delete
        </Button>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="flex-row items-center justify-between border-b border-gray-300 bg-white p-4">
        <Text className="text-xl font-bold text-gray-800">Documents</Text>
        <Button
          icon="upload"
          mode="contained"
          onPress={handlePickDocument}
          className="rounded-md"
        >
          Upload
        </Button>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" />
          <Text className="mt-3 text-gray-600">Loading documents...</Text>
        </View>
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
            <View className="flex-1 items-center justify-center py-10">
              <Text className="mb-4 text-base text-gray-600">
                No documents available
              </Text>
              <Button
                icon="refresh"
                mode="outlined"
                onPress={loadDocuments}
                className="mt-2"
              >
                Refresh
              </Button>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};
export default TutorDocument;
