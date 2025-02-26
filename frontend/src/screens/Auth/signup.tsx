import { Picker } from "@react-native-picker/picker";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Button, KeyboardAvoidingView, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/useAuthStore";
import { fonts } from "../../utils/constant";
import { Feather } from "@expo/vector-icons";

const SignUpScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { signup, isSigningUp } = useAuthStore();

  // State to manage form data
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "student", // Default role
    password: "",
  });

  // Handle form submission
  const handleSignUp = async () => {
    // Validation
    if (!formData.username.trim())
      return Toast.show({ type: "error", text1: "ERROR", text2: "Username is required" });
    if (formData.username.length < 5)
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Username must be at least 5 characters",
      });

    if (!formData.email.trim())
      return Toast.show({ type: "error", text1: "ERROR", text2: "Email is required" });
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email))
      return Toast.show({ type: "error", text1: "ERROR", text2: "Invalid email format" });

    if (!formData.password)
      return Toast.show({ type: "error", text1: "ERROR", text2: "Password is required" });
    if (formData.password.length < 6)
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Password must be at least 6 characters",
      });

    try {
      const res = await signup(formData);
      if (res) navigation.navigate("login");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: error.response?.data?.message,
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
        <View>
          {/* Username Input */}
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => setFormData({ ...formData, username: text })}
            placeholder="Enter username"
          />

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
            keyboardType="email-address"
            placeholder="Enter email"
          />

          {/* Role Picker */}
          <Text style={styles.label}>Role</Text>
          <Picker
            selectedValue={formData.role}
            style={styles.picker}
            onValueChange={(itemValue) => setFormData({ ...formData, role: itemValue })}
          >
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Tutor" value="tutor" />
          </Picker>

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => setFormData({ ...formData, password: text })}
            secureTextEntry
            placeholder="Enter password"
          />

          {/* Sign Up Button */}
          {isSigningUp ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="loader" size={24} color="black" />
              <Button title="Signing up..." disabled={true} />
            </View>
          ) : (
            <Button title="Sign Up" onPress={handleSignUp} />
          )}

          {/* Login Link */}

          <View>
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Already have an account?{" "}
              <Text style={{ color: "blue" }} onPress={() => navigation.goBack()}>
                Login
              </Text>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    // borderColor: "gray",
    // borderWidth: 3,
    flex: 1,
    justifyContent: "center",
    padding: 20,
    fontFamily: fonts.regular,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginBottom: 10,
    // borderColor: "red",
    // borderWidth: 2,
    backgroundColor: "lightblue",
  },
});

export default SignUpScreen;
