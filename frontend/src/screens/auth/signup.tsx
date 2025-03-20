import { Picker } from "@react-native-picker/picker";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Dimensions, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import { Button, Divider, HelperText, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/useAuthStore";

const { width } = Dimensions.get("window");

const SignUpScreen = () => {
  const navigation: NavigationProp<RootStackParamList> = useNavigation();
  const { signup, isSigningUp } = useAuthStore();

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
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Username is required",
      });
    if (formData.username.length < 5)
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Username must be at least 5 characters",
      });

    if (!formData.email.trim())
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Email is required",
      });
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email))
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Invalid email format",
      });

    if (!formData.password)
      return Toast.show({
        type: "error",
        text1: "ERROR",
        text2: "Password is required",
      });
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

  const hasError = () => {
    if (!formData.username.trim()) return;
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior="padding">
        <Text style={{ textAlign: "center", fontSize: 24, marginBottom: 20 }}>Sign Up</Text>
        <View>
          {/* Username Input */}
          <View style={{ marginBottom: 20 }}>
            <Text variant="titleMedium">Username</Text>
            <TextInput
              label="Username"
              mode="outlined"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
            />
            {!formData.username.trim() ? (
              <HelperText type="error" visible={true}>
                Username is required
              </HelperText>
            ) : null}
            {formData.username && formData.username.length < 5 ? (
              <HelperText type="error" visible={true}>
                Username must be at least 5 characters
              </HelperText>
            ) : null}
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 20 }}>
            <Text variant="titleMedium">Email</Text>
            <TextInput
              label="Email"
              mode="outlined"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
            />
            {!formData.email.trim() ? (
              <HelperText type="error" visible={true}>
                Email is required
              </HelperText>
            ) : null}
            {formData.email && !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(formData.email) ? (
              <HelperText type="error" visible={true}>
                Invalid email format
              </HelperText>
            ) : null}
          </View>

          {/* Role Picker */}
          <View
            style={{
              marginBottom: 20,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Text variant="titleMedium" style={{ flex: 1 }}>
              I want to be a{" "}
            </Text>
            <Picker
              selectedValue={formData.role}
              style={styles.picker}
              onValueChange={(itemValue) => setFormData({ ...formData, role: itemValue })}
            >
              <Picker.Item label="Student" value="student" />
              <Picker.Item label="Tutor" value="tutor" />
            </Picker>
          </View>

          {/* Password Input */}
          <View>
            <Text variant="titleMedium">Password</Text>
            <TextInput
              label="Password"
              mode="outlined"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry
            />
            {!formData.password ? (
              <HelperText type="error" visible={true}>
                Password is required
              </HelperText>
            ) : null}
            {formData.password && formData.password.length < 6 ? (
              <HelperText type="error" visible={true}>
                Password must be at least 6 characters
              </HelperText>
            ) : null}
          </View>

          {/* Sign Up Button */}
          {isSigningUp ? (
            <Button mode="contained" loading disabled style={styles.button}>
              Signing up...
            </Button>
          ) : (
            <Button
              mode="contained"
              buttonColor="#2D336B"
              textColor="white"
              style={styles.button}
              onPress={handleSignUp}
            >
              Sign up
            </Button>
          )}

          <Divider />

          <View style={styles.linkContainer}>
            <Text variant="titleMedium">Already have an account?</Text>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              buttonColor="#2D336B"
              textColor="white"
              icon="arrow-left"
            >
              Login
            </Button>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    width: width > 768 ? "30%" : "100%",
    alignSelf: "center",
  },
  picker: {
    flex: 2,
    height: 50,
    backgroundColor: "#7886C7",
    color: "white",
  },
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    gap: 10,
  },
  button: {
    marginVertical: 20,
  },
});

export default SignUpScreen;
