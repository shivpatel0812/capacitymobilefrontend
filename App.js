// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Login from "./src/Components/Login";
import CapacityData from "./src/Components/CapacityData";
import Clemons from "./src/Components/Clemons";
import Shannon from "./src/Components/Shannon";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login Screen (no header) */}
        <Stack.Screen
          name="Login"
          component={Login}
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

            // Label on the back button
            headerBackTitle: "Login",
            headerBackTitleVisible: true,

            // Move arrow up by 10px (adjust as you like)
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

            // If you also want to move the arrow for Clemons screen:
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
