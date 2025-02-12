// screens/VerificationScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
} from "react-native";
import { supabase } from "./supabaseClient.js";

export default function VerificationScreen({ route, navigation }) {
  const { email } = route.params || {};
  const [codeSent, setCodeSent] = useState(false);

  // Send magic link to user’s email
  const handleSendLink = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // Must match your app’s deep link scheme
        emailRedirectTo: "myapp://",
      },
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      setCodeSent(true);
      Alert.alert("Check Your Email", `We sent a link to ${email}`);
    }
  };

  const handleNext = () => {
    if (!codeSent) {
      Alert.alert("Wait!", "Please send the magic link first.");
      return;
    }
    // At this point, we wait for the user to tap that link and come back via deep link
    // Once they do, the session is established. Then they can set a password:
    navigation.navigate("CreatePassword");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>
          Please verify your email with a magic link.
        </Text>
        <View style={styles.emailContainer}>
          <TextInput
            style={styles.nonEditableInput}
            value={email}
            editable={false}
          />
          <TouchableOpacity
            style={[styles.sendLinkButton, codeSent && styles.buttonDisabled]}
            onPress={handleSendLink}
            disabled={codeSent}
          >
            <Text style={styles.sendLinkText}>
              {codeSent ? "Link Sent" : "Send Link"}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.nextButton, codeSent && styles.nextButtonActive]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
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
    backgroundColor: "#f9fafc",
    justifyContent: "space-between",
  },
  inputContainer: { flex: 1, justifyContent: "center", padding: 20 },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  emailContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  nonEditableInput: {
    flex: 1,
    backgroundColor: "#f1f3f5",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  sendLinkButton: {
    backgroundColor: "#E57200",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonDisabled: {
    backgroundColor: "#d9d9d9",
  },
  sendLinkText: { fontSize: 14, fontWeight: "bold", color: "#fff" },
  nextButton: {
    backgroundColor: "#d9d9d9",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
  },
  nextButtonActive: {
    backgroundColor: "#E57200",
  },
  nextButtonText: { fontSize: 16, fontWeight: "600", color: "#fff" },
  footerContainer: { alignItems: "center", paddingBottom: 20 },
  footerText: { fontSize: 18, fontWeight: "bold", color: "#333" },
});
