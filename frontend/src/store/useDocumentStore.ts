import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { create } from "zustand";
import { IDocumentState } from "../types/store";
import axiosInstance from "../utils/axios";
import { useClassStore } from "./useClassStore";
import { useAuthStore } from "./useAuthStore";

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

  getDocuments: async (classId: string) => {
    try {
      const res = await axiosInstance.get(`v1/document/${classId}`);
      set({ documents: res.data.documents, loading: false });
    } catch (error) {
      console.error("Error fetching documents:", error);
      Toast.show({
        type: "error",
        text1: "Error fetching documents",
      });
    }
  },

  uploadDocument: async (formData: FormData, classId: string) => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (!token) throw new Error("No token found");

      set({ loading: true });
      const res = await axiosInstance.post(`v1/document/upload/${classId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Toast.show({
        type: "success",
        text1: "Document uploaded successfully",
      });

      set({ loading: false });
      return res.data.document;
    } catch (error: any) {
      set({ loading: false });
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Please try again",
      });
      throw error;
    }
  },

  deleteDocument: async (classId:string, documentId: string) => {
    try {
      set({ loading: true });
      await axiosInstance.delete(`v1/document/${classId}/${documentId}`);

      // Update documents list by removing deleted document
      const { documents } = get();
      const updatedDocuments = documents.filter((doc) => doc._id !== documentId);

      set({ documents: updatedDocuments, loading: false });
      Toast.show({ type: "success", text1: "Document deleted successfully" });
    } catch (error: any) {
      set({ loading: false });
      console.error("Delete error:", error);
      Toast.show({ type: "error", text1: error.response?.data?.message || "Please try again" });
      throw error;
    }
  },
}));
