import { format } from "date-fns";
import { StyleSheet } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";
import { useAuthStore } from "../store/useAuthStore";

interface DocumentCardProps {
  document: {
    _id: string;
    filename: string;
    url: string;
    uploadedBy?: {
      _id: string;
      username: string;
    };
    uploadedAt: string;
  };
  onDelete: (id: string) => void;
  onOpen: (url: string) => void;
}

// Helper function to determine document type icon based on filename
const getDocumentIcon = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Document types
  if (['doc', 'docx', 'rtf'].includes(extension)) return 'file-word';
  if (['xls', 'xlsx', 'csv'].includes(extension)) return 'file-excel';
  if (['ppt', 'pptx'].includes(extension)) return 'file-powerpoint';
  if (['pdf'].includes(extension)) return 'file-pdf';
  if (['txt'].includes(extension)) return 'file-document';
  if (['zip', 'rar', '7z'].includes(extension)) return 'zip-box';
  
  // Image types
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) return 'file-image';
  
  // Video types
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(extension)) return 'file-video';
  
  // Audio types
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(extension)) return 'file-music';
  
  // Default icon
  return 'file';
};

// Helper function to get color based on document type
const getDocumentColor = (filename: string): string => {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  
  // Document types
  if (['doc', 'docx', 'rtf'].includes(extension)) return '#2B579A'; // Word blue
  if (['xls', 'xlsx', 'csv'].includes(extension)) return '#217346'; // Excel green
  if (['ppt', 'pptx'].includes(extension)) return '#D24726'; // PowerPoint orange
  if (['pdf'].includes(extension)) return '#F40F02'; // PDF red
  
  // Media types
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg', 'webp'].includes(extension)) return '#4CAF50'; // Green for images
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm'].includes(extension)) return '#FF5722'; // Orange for videos
  if (['mp3', 'wav', 'ogg', 'flac', 'aac'].includes(extension)) return '#9C27B0'; // Purple for audio
  if (['zip', 'rar', '7z'].includes(extension)) return '#795548'; // Brown for archives
  
  // Default color
  return '#607D8B'; // Blue grey
};

export const DocumentCard = ({ document, onDelete, onOpen }: DocumentCardProps) => {
  const { authUser } = useAuthStore();
  const docIcon = getDocumentIcon(document.filename);
  const docColor = getDocumentColor(document.filename);
  
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Card.Title 
          titleStyle={styles.filename} 
          title={document.filename}
          left={(props) => (
            <IconButton
              {...props}
              icon={docIcon}
              size={24}
              iconColor={docColor}
              style={styles.typeIcon}
            />
          )}
        />
        <Text style={styles.uploadInfo}>
          <Text style={styles.uploadText}>Uploaded by: </Text>
          {document.uploadedBy?.username || "Unknown user"}
        </Text>
        <Text style={styles.uploadInfo}>
          <Text style={styles.uploadText}>Uploaded on: </Text>
          {format(new Date(document.uploadedAt), "dd/MM/yyyy")}
        </Text>
      </Card.Content>
      <Card.Actions>
        <Button mode="contained" icon="open-in-new" onPress={() => onOpen(document.url)}>
          Open
        </Button>
        {authUser?.role === "tutor" || authUser?.role === "admin" ? (
          <IconButton icon="delete" onPress={() => onDelete(document._id)} />
        ) : null}
      </Card.Actions>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: 8,
    borderRadius: 8,
    elevation: 4,
  },
  filename: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  uploadInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  uploadText: {
    fontWeight: "bold",
  },
  typeIcon: {
    margin: 0,
    padding: 0,
  },
});
