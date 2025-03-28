import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { FlatList, Linking, StyleSheet, View } from "react-native";
import { ActivityIndicator, Button, Card, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useClassStore } from "../../../store/useClassStore";
import { useDocumentStore } from "../../../store/useDocumentStore";
import { FONTS } from "../../../utils/constant";
import { DocumentCard } from "../../../components/DocumentCard";

const StudentDocument = () => {
  const { documents, getDocuments, loading } = useDocumentStore();
  const { selectedClass } = useClassStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setRefreshing(true);
    await getDocuments(selectedClass._id);
    setRefreshing(false);
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

  const renderItem = ({ item }: any) => {
    return <DocumentCard document={item} onDelete={() => {}} onOpen={openDocument} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Class Documents</Text>
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
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
  },
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  listContent: {
    padding: 16,
  },
  filename: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  uploadInfo: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    marginBottom: 4,
  },
  uploadText: {
    fontFamily: FONTS.semiBold,
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
    fontFamily: FONTS.regular,
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
    fontFamily: FONTS.regular,
  },
  refreshButton: {
    marginTop: 8,
  },
});

export default StudentDocument;