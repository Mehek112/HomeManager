// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace with YOUR Firebase config (from console)
const firebaseConfig = {
  apiKey: "AIzaSyDZj-RU4dule9kFRo6SB1-yXzgu0tdIh3o",
  authDomain: "homemanagerapp-e0fed.firebaseapp.com",
  projectId: "homemanagerapp-e0fed",
  storageBucket: "homemanagerapp-e0fed.firebasestorage.app",
  messagingSenderId: "347062348685",
  appId: "1:347062348685:web:9fc3eb83854b116479ebc4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);