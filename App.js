// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./src/Components/Login";
import LoginScreen from "./src/Components/LoginScreen";
import SignUpScreen from "./src/Components/SignUpScreen";
import CapacityData from "./src/Components/CapacityData";
import Clemons from "./src/Components/Clemons";
import Shannon from "./src/Components/Shannon";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Landing Page */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        {/* Firebase Login Screen */}
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Login" }}
        />

        {/* Sign Up Screen */}
        <Stack.Screen
          name="SignUpScreen"
          component={SignUpScreen}
          options={{ title: "Sign Up" }}
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
            headerLeftContainerStyle: { marginTop: 50 },
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
            headerLeftContainerStyle: { marginTop: -10 },
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
