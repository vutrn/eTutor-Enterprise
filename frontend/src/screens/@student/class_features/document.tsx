import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Linking, View } from "react-native";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useClassStore } from "../../../store/useClassStore";
import { useDocumentStore } from "../../../store/useDocumentStore";

const StudentDocument = () => {
  const { documents, getDocuments, loading } = useDocumentStore();
  const { selectedClass } = useClassStore();
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

  const openDocument = (url: string) => {
    Linking.openURL(url).catch(() => {
      Toast.show({
        type: "error",
        text1: "Error opening document",
        text2: "Could not open the document URL",
      });
    });
  };

  const renderItem = ({ item }: any) => {
    return (
      <View
        className="bg-white rounded-lg shadow p-4 m-2"
        style={{ width: itemWidth }}
      >
        <Text className="text-lg font-bold text-gray-800 mb-2">
          {item.filename}
        </Text>
        <Text className="text-sm text-gray-600 mb-4">
          Uploaded: {format(new Date(item.uploadedAt), "dd/MM/yyyy")}
        </Text>
        <Button mode="contained" onPress={() => openDocument(item.url)}>
          Open
        </Button>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <View className="border-b border-gray-300 bg-gray-200 p-4">
        <Text className="text-2xl font-bold text-gray-800">Class Documents</Text>
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
          columnWrapperStyle={{ justifyContent: "space-between" }}
          onRefresh={loadDocuments}
          refreshing={refreshing}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-10">
              <Text className="mb-4 text-gray-600">No documents available</Text>
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

export default StudentDocument;