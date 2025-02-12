// screens/EmailInputScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";

export default function EmailInputScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (input) => {
    const eduEmailRegex = /^[^\s@]+@[^\s@]+\.(edu)$/i;
    setEmail(input);
    setIsValid(eduEmailRegex.test(input));
  };

  const handleConfirm = () => {
    if (isValid) {
      navigation.navigate("Verification", { email });
    } else {
      Alert.alert("Error", "Please enter a valid .edu email.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>
          Welcome to the CAP@UVA app!{"\n"}Please enter your .edu email to
          begin.
        </Text>
        <TextInput
          style={styles.emailInput}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={validateEmail}
        />
        <TouchableOpacity
          style={[styles.confirmButton, isValid && styles.confirmButtonActive]}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>CAP@UVA</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    backgroundColor: "#f9fafc",
  },
  inputContainer: { flex: 1, justifyContent: "center", padding: 20 },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  emailInput: {
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    color: "#333",
  },
  confirmButton: {
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonActive: {
    backgroundColor: "#E57200",
  },
  confirmButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  footerContainer: { alignItems: "center", paddingBottom: 20 },
  footerText: { fontSize: 18, fontWeight: "bold" },
});
