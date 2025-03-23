import Toast from "react-native-toast-message";
import { create } from "zustand";
import { IDocumentState } from "../types/store";
import axiosInstance from "../utils/axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useDocumentStore = create<IDocumentState>((set, get) => ({
  documents: [],
  selectedDocument: {
    _id: "",
    filename: "",
    url: "",
    uploadedBy: {
      _id: "",
      username: "",
      email: "",
    },
    uploadedAt: "",
  },
  loading: false,

  setSelectedDocument: (selectedDocument: any) => set({ selectedDocument }),

  getDocuments: async () => {
    try {
      const res = await axiosInstance.get("v1/document");
      set({ documents: res.data.documents, loading: false });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error fetching documents",
      });
    }
  },

  uploadDocument: async (formData: FormData) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");
      set({ loading: true });
      const res = await axiosInstance.post("v1/document/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Update documents list with new document
      Toast.show({
        type: "success",
        text1: "Document uploaded successfully",
      });
      set({ loading: false });
      return res.data.document;
    } catch (error) {
      set({ loading: false });
      Toast.show({ type: "error", text1: "Error uploading document" });
      throw error;
    }
  },

  deleteDocument: async (documentId: string) => {
    try {
      set({ loading: true });
      await axiosInstance.delete(`v1/document/${documentId}`);

      // Update documents list by removing deleted document
      const { documents } = get();
      const updatedDocuments = documents.filter((doc) => doc._id !== documentId);

      set({ documents: updatedDocuments, loading: false });
      Toast.show({ type: "success", text1: "Document deleted successfully" });
    } catch (error) {
      set({ loading: false });
      Toast.show({ type: "error", text1: "Error deleting document" });
      throw error;
    }
  },
}));
