import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";

import Login from "./src/Components/Login";
import CapacityData from "./src/Components/CapacityData";
import Clemons from "./src/Components/Clemons";
import Shannon from "./src/Components/Shannon";
import AFC from "./src/Components/AFC";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

function App() {
  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Hide the splash screen after app is ready
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

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
          name="CapacityData"
          component={CapacityData}
          options={{
            headerShown: false,
          }}
        />

        {/* Clemons Library Screen */}
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

        {/* Shannon Library Screen */}
        <Stack.Screen
          name="Shannon"
          component={Shannon}
          options={{ title: "Shannon Library" }}
        />

        {/* AFC Gym Screen */}
        <Stack.Screen
          name="AFC"
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
