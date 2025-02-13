import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Linking, Alert } from "react-native";

import { supabase } from "./src/Components/onboarding/supabaseClient";
import EmailInputScreen from "./src/Components/onboarding/EmailInputScreen";
import VerificationScreen from "./src/Components/onboarding/VerificationScreen";
import CreatePasswordScreen from "./src/Components/onboarding/CreatePasswordScreen";

const Stack = createStackNavigator();

export default function App() {
  const prefix = "myapp://"; // Ensure this matches your Supabase Auth redirect settings

  const [session, setSession] = useState(null);

  // 🔹 Check session on app start
  useEffect(() => {
    const checkSession = async () => {
      console.log("🔍 Checking session on app start...");
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.log("❌ Error fetching session:", error.message);
      } else {
        console.log("Session data:", data);
        if (data.session) {
          console.log("✅ Session found!");
          setSession(data.session);
        } else {
          console.log("❌ No session found on start.");
        }
      }
    };

    checkSession();
  }, []);

  // 🔹 Handle deep links (cold start and while app is running)
  useEffect(() => {
    const handleDeepLink = async (event) => {
      const { url } = event;
      console.log("🔗 Received deep link:", url);
      if (!url) {
        console.log("No URL in deep link event.");
        return;
      }
      console.log("Exchanging code for session with URL:", url);
      const { data, error } = await supabase.auth.exchangeCodeForSession(url);
      if (error) {
        console.log("❌ Supabase exchange error:", error.message);
        Alert.alert("Error", error.message);
      } else if (data && data.session) {
        console.log("✅ Session Created Successfully:", data.session);
        setSession(data.session);
        Alert.alert(
          "Success",
          "You are signed in! Now you can set a password."
        );
      } else {
        console.log("No session returned from exchangeCodeForSession.");
      }
    };

    // For cold start deep linking
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log("Initial URL:", url);
        handleDeepLink({ url });
      } else {
        console.log("No initial URL on app launch.");
      }
    });

    // Listen for incoming deep links while the app is running
    const subscription = Linking.addEventListener("url", handleDeepLink);
    return () => {
      subscription.remove();
    };
  }, []);

  // 🔹 Listen for auth state changes (e.g., when the session is updated)
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("🔄 Auth state changed:", event, newSession);
        setSession(newSession);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <NavigationContainer linking={{ prefixes: [prefix] }}>
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
          component={(props) => (
            <CreatePasswordScreen {...props} session={session} />
          )}
          options={{ title: "Create Password" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
