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
import { useAuthStore } from "../../store/useAuthStore";
import { useDocumentStore } from "../../store/useDocumentStore";

const StudentDocument = () => {
  const { documents, getDocuments, uploadDocument, deleteDocument, loading } = useDocumentStore();
  const { authUser } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);

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
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        const formData = new FormData();

        // Create file object compatible with FormData
        const fileObj = {
          uri: file.uri,
          name: file.name,
          type: file.mimeType,
        };

        formData.append("file", fileObj as any);
        formData.append("userId", authUser?._id);

        await uploadDocument(formData);
        loadDocuments();
      }
    } catch (error) {
      console.error("Error picking document:", error);
      Toast.show({
        type: "error",
        text1: "Error selecting document",
        text2: "Please try again",
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

  const showDocumentDetails = (document: any) => {
    setSelectedDocument(document);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedDocument(null);
  };

  const confirmDelete = () => {
    setDeleteConfirmVisible(true);
  };

  const cancelDelete = () => {
    setDeleteConfirmVisible(false);
  };

  const handleDeleteDocument = async () => {
    if (selectedDocument) {
      try {
        await deleteDocument(selectedDocument._id);
        setDeleteConfirmVisible(false);
        hideModal();
        loadDocuments();
      } catch (error) {
        console.error("Error deleting document:", error);
      }
    }
  };

  const renderItem = ({ item }: any) => {
    return (
      <Card style={styles.card} onPress={() => showDocumentDetails(item)}>
        <Card.Content>
          <Title numberOfLines={1} style={styles.filename}>
            {item.filename}
          </Title>
          <Paragraph style={styles.uploadInfo}>
            Uploaded on {format(new Date(item.uploadedAt), "dd/MM/yyyy")}
          </Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={() => openDocument(item.url)} style={styles.viewButton}>
            View
          </Button>
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
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
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
    fontWeight: "bold",
  },
  uploadInfo: {
    fontSize: 14,
    color: "#757575",
    marginTop: 4,
  },
  viewButton: {
    borderRadius: 4,
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
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  closeButton: {
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    marginRight: 24,
  },
  modalInfo: {
    marginBottom: 20,
  },
  modalInfoText: {
    fontSize: 14,
    marginBottom: 8,
  },
  boldText: {
    fontWeight: "bold",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    marginTop: 8,
    borderRadius: 4,
    flex: 1,
  },
  viewFileButton: {
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: "#f44336",
    marginLeft: 8,
  },
  deleteModalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  deleteTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  deleteMessage: {
    fontSize: 14,
    marginBottom: 20,
    lineHeight: 20,
  },
  deleteButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  cancelButton: {
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: "#f44336",
  },
});

export default StudentDocument;
