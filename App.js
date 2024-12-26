// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Importing Components
import Login from "./src/Components/Login";
import CapacityData from "./src/Components/CapacityData";
import Clemons from "./src/Components/Clemons"; // Clemons Library detailed page
import Shannon from "./src/Components/Shannon"; // Shannon Library detailed page

// Initialize Stack Navigator
const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Hide header for login screen
        />

        {/* Capacity Data Screen */}
        <Stack.Screen
          name="CapacityData"
          component={CapacityData}
          options={{ title: "Capacity Data" }}
        />

        {/* Clemons Library Detailed Page */}
        <Stack.Screen
          name="Clemons"
          component={Clemons}
          options={{ title: "Clemons Library" }}
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
