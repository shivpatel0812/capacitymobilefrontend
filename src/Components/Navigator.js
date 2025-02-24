import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import LocationList from "./LocationList";
import Clemons from "./Clemons";
import Shannon from "./Shannon";

const Stack = createStackNavigator();

export default function Navigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={LocationList} />
        <Stack.Screen name="Clemons" component={Clemons} />
        <Stack.Screen name="Shannon" component={Shannon} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
