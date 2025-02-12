// screens/CreatePasswordScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { supabase } from "./supabaseClient.js";

export default function CreatePasswordScreen({ navigation }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }

    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    if (sessionError || !sessionData?.session) {
      Alert.alert(
        "Not Logged In",
        "No active session found. Please sign in again."
      );
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("Success", "Your password has been set successfully!");
      // e.g. navigation.navigate('Home');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create your password</Text>

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSetPassword}>
        <Text style={styles.saveButtonText}>Save Password</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Password Requirement: 8 character minimum with 3 of the following:
          Uppercase letter / Lowercase letter / Number / Special character.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafc",
    padding: 20,
    justifyContent: "center",
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#333", marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: "#E57200",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  footer: { marginTop: 16 },
  footerText: { fontSize: 14, color: "#666" },
});
