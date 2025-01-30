import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert
} from 'react-native';
import { supabase } from './supabaseClient';

export default function VerificationScreen({ route, navigation }) {
  // Retrieve the email passed from a previous screen (e.g., EmailInputScreen)
  const { email } = route.params || {};
  const [codeSent, setCodeSent] = useState(false);

  // Function to handle "Send Code" (actually a magic link) via Supabase
  const handleSendCode = async () => {
    // This sends a magic link to the user's email
    // Make sure to set the correct redirect URL below, and also configure it in Supabase Auth settings
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // This should be the URL that your user is directed to after they click the magic link
        // In an Expo dev environment, you can set an Expo deep link like "myapp://expo-development"
        emailRedirectTo: 'capatuva://',
      },
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      setCodeSent(true);
      Alert.alert(
        'Verification Link Sent',
        `A magic link has been sent to ${email}. Please check your inbox.`
      );
    }
  };

  // Handle "Next" button press
  const handleNext = () => {
    if (!codeSent) {
      Alert.alert('Error', 'Please send a verification link first.');
      return;
    }

    // This is up to your flow—often you'd show a message telling the user:
    // "Check your email. Once you tap the link, you'll be signed in automatically."
    // Or navigate to a "check your email" screen.
    Alert.alert('Check Your Email', 'Click the magic link to verify your account.');
    
    // If you want to navigate to a "Set Password" screen after they've verified:
    // navigation.navigate('SetPasswordScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>
          To register as a member,{'\n'}please verify your email.
        </Text>

        {/* Email Box with Send Code (Magic Link) Button */}
        <View style={styles.emailContainer}>
          <TextInput
            style={styles.nonEditableInput}
            value={email}
            editable={false} // Make the email field non-editable
            placeholderTextColor="#999"
          />
          <TouchableOpacity
            style={[styles.sendCodeButton, codeSent && styles.sendCodeButtonDisabled]}
            onPress={handleSendCode}
            disabled={codeSent}
          >
            <Text style={styles.sendCodeText}>{codeSent ? 'Link Sent' : 'Send Link'}</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, codeSent && styles.nextButtonActive]}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>

      {/* Footer Section */}
      <View style={styles.footerContainer}>
        <Text style={styles.footerText}>CAP@UVA</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafc',
    justifyContent: 'space-between',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    marginBottom: 20,
  },
  emailContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  nonEditableInput: {
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  sendCodeButton: {
    backgroundColor: '#E57200', // UVA Orange
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendCodeButtonDisabled: {
    backgroundColor: '#d9d9d9', // Gray when disabled
  },
  sendCodeText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
  },
  nextButton: {
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  nextButtonActive: {
    backgroundColor: '#E57200',
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  footerContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
});
