import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from './firebaseConfig'; // Import Firebase config

function VerificationPage({ route, navigation }) {
  const { email } = route.params; // Retrieve the email passed from EmailInputScreen
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);

  // Function to handle "Send Code" button
  const handleSendCode = async () => {
    const actionCodeSettings = {
      url: 'http://www.virginia.edu', // Replace with your app's URL
      handleCodeInApp: true,
    };

    try {
        await sendSignInLinkToEmail(auth, email, actionCodeSettings);
        Alert.alert('Verification Link Sent', `A verification link has been sent to ${email}`);
      } catch (error) {
        console.error(error.message);
        Alert.alert('Error', error.message);
      }
      
  };

  // Function to handle "Next" button
  const handleNext = () => {
    if (codeSent) {
      Alert.alert(
        'Check Your Email',
        'Please check your email inbox and click the verification link to continue.'
      );
      // Navigate to the next screen or show further instructions
    } else {
      Alert.alert('Error', 'Please send a verification code first.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>
          To register as a member,{'\n'}Please verify your email.
        </Text>

        {/* Email Box with Send Code Button */}
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
            disabled={codeSent} // Disable the button after sending the code
          >
            <Text style={styles.sendCodeText}>{codeSent ? 'Code Sent' : 'Send Code'}</Text>
          </TouchableOpacity>
        </View>

        {/* Next Button */}
        <TouchableOpacity
          style={[styles.nextButton, codeSent ? styles.nextButtonActive : null]}
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

export default VerificationPage;
