// App.js
import React, { useEffect } from "react";
import { Linking } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Supabase v2 client
import { supabase } from "./src/Components/onboarding/supabaseClient";

// Screens
import Login from "./src/Components/Login";
import CapacityData from "./src/Components/CapacityData";
import Clemons from "./src/Components/Clemons";
import Shannon from "./src/Components/Shannon";
import GetStartedScreen from "./src/Components/onboarding/GetStartedScreen";
import VerificationPage from "./src/Components/onboarding/VerificationScreen";
import CreatePasswordScreen from "./src/Components/onboarding/CreatePasswordScreen";

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // 1. If the app is launched (cold start) by a magic link
    Linking.getInitialURL().then((initialUrl) => {
      if (initialUrl) {
        supabase.auth.setSessionFromUrl({ url: initialUrl });
      }
    });

    // 2. If the app is already running, but a magic link is tapped
    const handleDeepLink = ({ url }) => {
      supabase.auth.setSessionFromUrl({ url });
    };

    // Subscribe to URL events
    const subscription = Linking.addEventListener("url", handleDeepLink);

    // Cleanup on unmount
    return () => subscription.remove();
  }, []);

  return (
    // Provide the 'linking' prop to handle your custom scheme
    <NavigationContainer
      linking={{
        // The scheme(s) your app handles. Must match "scheme" in app.json.
        prefixes: ["capatuva://"],
        // Optional: define route configs if you want to map deep link paths to screens
        // config: {
        //   screens: {
        //     CreatePassword: "expo-development",
        //   },
        // },
      }}
    >
      <Stack.Navigator initialRouteName="GetStarted">
        {/* Onboarding Screen */}
        <Stack.Screen
          name="GetStarted"
          component={GetStartedScreen}
          options={{ headerShown: false }}
        />

        {/* Login Screen (no header) */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        {/* Verification Screen */}
        <Stack.Screen
          name="VerificationPage"
          component={VerificationPage}
          options={{ headerShown: false }}
        />

        {/* Create Password Screen */}
        <Stack.Screen
          name="CreatePassword"
          component={CreatePasswordScreen}
          options={{ headerShown: false }}
        />

        {/* Capacity Data Screen */}
        <Stack.Screen
          name="CapacityData"
          component={CapacityData}
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerTintColor: "#fff",
            headerBackTitle: "Login",
            headerBackTitleVisible: true,
            headerLeftContainerStyle: {
              marginTop: 50,
            },
          }}
        />

        {/* Clemons Library Detailed Page */}
        <Stack.Screen
          name="Clemons"
          component={Clemons}
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerTintColor: "#fff",
            headerBackTitleVisible: false,
            headerLeftContainerStyle: {
              marginTop: -10,
            },
          }}
        />

        {/* Shannon Library Detailed Page */}
        <Stack.Screen
          name="Shannon"
          component={Shannon}
          options={{ title: "Shannon Library" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}