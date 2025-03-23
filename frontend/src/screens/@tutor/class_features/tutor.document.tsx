import { format } from "date-fns";
import * as DocumentPicker from "expo-document-picker";
import React, { useEffect, useState } from "react";
import { Linking, Platform, StyleSheet, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  ActivityIndicator,
  Button,
  Card,
  IconButton,
  Modal,
  Paragraph,
  Portal,
  Text,
  Title,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../../store/useAuthStore";
import { useDocumentStore } from "../../../store/useDocumentStore";
import { FONTS } from "../../../utils/constant";
import alert from "../../../components/alert";

const TutorDocument = () => {
  const {
    documents,
    selectedDocument,
    setSelectedDocument,
    getDocuments,
    uploadDocument,
    deleteDocument,
    loading,
  } = useDocumentStore();
  const { authUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setRefreshing(true);
    await getDocuments();
    setRefreshing(false);
  };

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/doc",
        copyToCacheDirectory: true,
      });
      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const formData = new FormData();

        // Create file object compatible with FormData
        const fileObj = {
          uri: Platform.OS === 'ios' ? file.uri.replace('file://', '') : file.uri,
          name: file.name,
          type: file.mimeType,
        };
        console.log("DocumentPicker result:", result);
        console.log("File object:", fileObj);
        formData.append("file", fileObj as any);
        if (authUser?._id) {
          formData.append("userId", authUser._id); // Include userId if available
        }

        await uploadDocument(formData);
        loadDocuments();
      }
    } catch (error: any) {
      console.error("Error picking document:", error);
      Toast.show({
        type: "error",
        text1: error.response.data.message,
      });
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
            await deleteDocument(selectedDocumentId);
            loadDocuments();
            Toast.show({
              type: "success",
              text1: "Document deleted successfully",
            });
          },
        },
      ]);
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <Card style={styles.card}>
        <Card.Content>
          <Card.Title titleStyle={styles.filename} title={item.filename} />
          <Text style={styles.uploadInfo}>
            <Text style={styles.uploadText}>Uploaded by: </Text>
            {item.uploadedBy?.username || "Unknown user"}
          </Text>
          <Text style={styles.uploadInfo}>
            <Text style={styles.uploadText}>Uploaded on: </Text>
            {format(new Date(item.uploadedAt), "dd/MM/yyyy")}
          </Text>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" icon="open-in-new" onPress={() => openDocument(item.url)}>
            Open
          </Button>
          <IconButton icon="delete" onPress={() => handleDeleteDocument(item._id)} />
        </Card.Actions>
      </Card>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Documents</Text>
        <Button
          icon="upload"
          mode="contained"
          onPress={handlePickDocument}
          style={styles.uploadButton}
        >
          Upload
        </Button>
      </View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" />
          <Text style={styles.loaderText}>Loading documents...</Text>
        </View>
      ) : (
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
