// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

// Screens
import Login from "./src/Components/Login";
import CapacityData from "./src/Components/CapacityData";
import Clemons from "./src/Components/Clemons";
import Shannon from "./src/Components/Shannon";
import AFC from "./src/Components/AFC";

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Login Screen */}
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />

        {/* Capacity Data Screen */}
        <Stack.Screen
          name="CapacityData" // <-- We'll navigate to this name from Login or wherever
          component={CapacityData}
          options={{
            headerShown: false,
          }}
        />

        {/* Clemons Library Screen */}
        <Stack.Screen
          name="Clemons" // <-- Must match what we use in `navigation.navigate("Clemons")`
          component={Clemons}
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerTintColor: "#fff",
            headerBackTitleVisible: false,
            headerLeftContainerStyle: { marginTop: -10 },
          }}
        />

        {/* Shannon Library Screen */}
        <Stack.Screen
          name="Shannon" // <-- Must match `navigation.navigate("Shannon")`
          component={Shannon}
          options={{ title: "Shannon Library" }}
        />

        {/* AFC Gym Screen */}
        <Stack.Screen
          name="AFC" // <-- Must match `navigation.navigate("AFC")`
          component={AFC}
          options={{
            headerTitle: "",
            headerTransparent: true,
            headerTintColor: "#fff",
            headerBackTitleVisible: false,
            headerLeftContainerStyle: { marginTop: -10 },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
