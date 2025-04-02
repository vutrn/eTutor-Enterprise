import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { FlatList, Linking, Platform, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import alert from "../../../components/alert";
import { useAuthStore } from "../../../store/useAuthStore";
import { useClassStore } from "../../../store/useClassStore";
import { useDocumentStore } from "../../../store/useDocumentStore";
import { FONTS, MIME_TYPES } from "../../../utils/constant";
import { DocumentCard } from "../../../components/DocumentCard";

const TutorDocument = () => {
  const { documents, getDocuments, uploadDocument, deleteDocument, loading } =
    useDocumentStore();
  const { selectedClass } = useClassStore();
  const { authUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

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
      type: Object.values(MIME_TYPES),
      // type: "*/*",
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
    Linking.openURL(url).catch((err) => {
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

  // hàm renderItem dùng để render từng item trong mảng document
  // DocumentCard trong folder src/components/DocumentCard.tsx
  const renderItem = ({ item }: any) => {
    return (
      <DocumentCard
        document={item}
        onDelete={handleDeleteDocument}
        onOpen={openDocument}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        {/* nút upload document */}
        <Button
          icon="upload"
          mode="contained"
          onPress={handlePickDocument}
          style={styles.uploadButton}
        >
          Upload
        </Button>
      </View>

      {/* Mặc định loaing == false */}
      {/* Khi bấm nút upload document -> loading == true */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loaderText}>Loading documents...</Text>
        </View>
      ) : (
        // Khi upload xong -> loading == false
        // khi loading == false thì hiển thị danh sách document bằng flatlist
        // nếu documents.length == 0 thì hiển thị thông báo không có tài liệu nào bằng  ListEmptyComponent
        <FlatList
          data={documents}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          onRefresh={loadDocuments}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No documents available</Text>
              <Button
                icon="refresh"
                mode="outlined"
                onPress={loadDocuments}
                style={styles.refreshButton}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    // backgroundColor: "#ffffff",
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  uploadButton: {
    borderRadius: 4,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    elevation: 2,
  },
  filename: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  uploadInfo: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    margin: 3,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#757575",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#757575",
    marginBottom: 16,
  },
  refreshButton: {
    marginTop: 8,
  },

  uploadText: {
    fontFamily: FONTS.semiBold,
  },
});

export default TutorDocument;
