import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../supabaseClient';

export default function SetPasswordScreen() {
  const [password, setPassword] = useState('');

  const handleSetPassword = async () => {
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      Alert.alert('Not Signed In', 'Please sign in via the verification link first.');
      return;
    }

    // Update the user’s password
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Success', 'Password has been updated. You are all set!');
      // Possibly navigate to a logged-in home screen
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Create Password</Text>
      <TextInput
        secureTextEntry
        placeholder="Enter New Password"
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, borderColor: '#ccc', marginBottom: 15 }}
      />
      <Button title="Save Password" onPress={handleSetPassword} />
    </View>
  );
}
