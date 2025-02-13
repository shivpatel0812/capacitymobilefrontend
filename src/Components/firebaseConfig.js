// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAogZr3OQGAGwFYb9TQJVozbc4rTwK-jdQ",
  authDomain: "capatuva-63497.firebaseapp.com",
  projectId: "capatuva-63497",
  storageBucket: "capatuva-63497.appspot.com",
  messagingSenderId: "986626082130",
  appId: "1:986626082130:web:7f7aa7e84474308ec0268b",
  measurementId: "G-NPSCRF6Z5L",
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export { auth };
