// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./src/Components/Login";
import CapacityData from "./src/Components/CapacityData";
import Clemons from "./src/Components/Clemons";
import Shannon from "./src/Components/Shannon";
import GetStartedScreen from "./src/Components/onboarding/GetStartedScreen"; // Import your onboarding screen
import VerificationPage from "./src/Components/onboarding/VerificationScreen"; // Verification Page


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
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
        {/* Email Verification Screen */}
        <Stack.Screen
          name="VerificationPage"
          component={VerificationPage}
          options={{ title: 'Verification', headerShown: false }}
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

export default App;
