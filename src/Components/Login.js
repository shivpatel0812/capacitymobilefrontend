// src/Components/Login.js
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

function Login() {
  const navigation = useNavigation();

  const handleLoginClick = () => {
    navigation.navigate("LoginScreen"); // Navigate to actual login page
  };

  const handleSignUpClick = () => {
    navigation.navigate("SignUpScreen"); // Navigate to actual sign-up page
  };

  return (
    <ImageBackground
      source={require("../../assets/rotunda.jpg")} // Replace with your image path
      style={styles.background}
      imageStyle={{ opacity: 0.8 }}
    >
      <TouchableOpacity
        style={styles.arrowContainer}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.contentContainer}>
        <Text style={styles.title}>UVA AI Capacity Tracker</Text>

        <TouchableOpacity style={styles.button} onPress={handleLoginClick}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleSignUpClick}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  arrowContainer: {
    position: "absolute",
    top: 50,
    left: 20,
  },
  contentContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: -200,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "#000000",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: "#E57200",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginVertical: 10,
  },
  buttonText: {
    fontSize: 22,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Login;
