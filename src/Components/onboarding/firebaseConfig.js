import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyBxqMQZ1W-VMAyGgykMDS5RijNUE_MIGAM",
    authDomain: "cap-at-uva.firebaseapp.com",
    projectId: "cap-at-uva",
    storageBucket: "cap-at-uva.firebasestorage.app",
    messagingSenderId: "178569930515",
    appId: "1:178569930515:web:408d87807ac93fedd51ce6",
    measurementId: "G-XSTC85LHSZ"
  };

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Enable persistence with AsyncStorage
});
