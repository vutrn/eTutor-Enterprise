import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { useAuthStore } from "../../store/useAuthStore";

const AdminProfile = () => {
  const { authUser, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Hello,</Text>
        <Text style={styles.value}>
          {authUser?.username ? authUser?.username : "{USERNAME}"}
        </Text>

        <Text style={styles.label}>Your Role:</Text>
        <Text style={styles.value}>
          {authUser?.role ? authUser?.role : "{ROLE}"}
        </Text>

        <Text style={styles.label}>Your Email:</Text>
        <Text style={styles.value}>{authUser?.email || "{EMAIL}"}</Text>

        <Text style={styles.label}>Your ID:</Text>
        <Text style={styles.value}>{authUser?._id || "{ID}"}</Text>
      </View>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  card: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#ff4d4f",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AdminProfile;
