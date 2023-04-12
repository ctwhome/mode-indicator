// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDBnhZ4nughD-xkahLSReyzVv-9vO9-yDY",
  authDomain: "mode-app-3cc3c.firebaseapp.com",
  projectId: "mode-app-3cc3c",
  storageBucket: "mode-app-3cc3c.appspot.com",
  messagingSenderId: "190228192039",
  appId: "1:190228192039:web:d2d76575ccf79c6cade702"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Get a reference to the Firestore database
export const db = getFirestore(app);
