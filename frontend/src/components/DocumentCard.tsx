import { format } from "date-fns";
import { StyleSheet } from "react-native";
import { Button, Card, IconButton, Text } from "react-native-paper";

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

export const DocumentCard = ({ document, onDelete, onOpen }: DocumentCardProps) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Card.Title titleStyle={styles.filename} title={document.filename} />
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
        <IconButton icon="delete" onPress={() => onDelete(document._id)} />
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
  },
  uploadInfo: {
    fontSize: 14,
    marginBottom: 4,
  },
  uploadText: {
    fontWeight: "bold",
  },
});
