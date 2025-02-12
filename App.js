// App.js
import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Linking, Alert, Platform } from "react-native";
import * as LinkingExpo from "expo-linking";

import { supabase } from "./src/Components/onboarding/supabaseClient";
import EmailInputScreen from "./src/Components/onboarding/EmailInputScreen";
import VerificationScreen from "./src/Components/onboarding/VerificationScreen";
import CreatePasswordScreen from "./src/Components/onboarding/CreatePasswordScreen";

const Stack = createStackNavigator();

export default function App() {
  // We’ll use this app scheme in Supabase’s `emailRedirectTo`.
  // For Expo, you might have "myapp://", or "exp://127.0.0.1:19000/--", etc.
  // Make sure it matches your Supabase Auth settings.
  const scheme = "myapp://";

  // Handle deep links from cold start
  const prefix = LinkingExpo.createURL("/"); // e.g., "myapp:///" on iOS simulator

  // 1) On mount, parse any initial URL
  useEffect(() => {
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    // 2) Also listen for incoming links while app is open/in background
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  // This is where we tell Supabase to consume the link and finalize the session
  const handleDeepLink = async (event) => {
    let url = event.url;

    // On Android, sometimes you get "myapp:///" or "myapp://some/path"
    // Just pass the full URL to the supabase function that finalizes sign-in
    const { data, error } = await supabase.auth.exchangeCodeForSession(url);

    if (error) {
      Alert.alert("Link Error", error.message);
    } else if (data?.session) {
      // At this point, we have a valid user session
      Alert.alert("Success", "You are signed in. Now you can set a password.");
    }
  };

  // Use React Navigation to manage screens
  return (
    <NavigationContainer
      linking={{
        prefixes: [prefix],
        // If you have a deep link route config, you can specify it here, but not strictly required.
      }}
    >
      <Stack.Navigator>
        <Stack.Screen
          name="EmailInput"
          component={EmailInputScreen}
          options={{ title: "Enter .edu Email" }}
        />
        <Stack.Screen
          name="Verification"
          component={VerificationScreen}
          options={{ title: "Verify Email" }}
        />
        <Stack.Screen
          name="CreatePassword"
          component={CreatePasswordScreen}
          options={{ title: "Create Password" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
