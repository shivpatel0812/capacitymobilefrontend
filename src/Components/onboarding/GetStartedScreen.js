import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert } from 'react-native';

function EmailInputScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (input) => {
    const eduEmailRegex = /^[^\s@]+@[^\s@]+\.(edu)$/i;
    setEmail(input);
    setIsValid(eduEmailRegex.test(input));
  };

  const handleConfirm = () => {
    if (isValid) {
      navigation.navigate('VerificationPage', { email }); // Pass email to VerificationPage
    } else {
      Alert.alert('Error', 'Please enter a valid .edu email.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.headerText}>
          Welcome to the <Text style={styles.bold}>CAP@UVA</Text> app!{'\n'}
          Please enter your .edu email{'\n'}
          to begin.
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
  bold: {
    fontWeight: 'bold',
  },
  emailInput: {
    backgroundColor: '#f1f3f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 16,
    width: '100%',
    fontSize: 16,
    color: '#333',
  },
  confirmButton: {
    backgroundColor: '#d9d9d9',
    borderRadius: 8,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  confirmButtonActive: {
    backgroundColor: '#E57200',
  },
  confirmButtonText: {
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

export default EmailInputScreen;
