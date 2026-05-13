import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
  apiKey: "AIzaSyDltqddkXi8X3sTUEGW-zUhxOr9_Wjavac",
  authDomain: "immune-connect.firebaseapp.com",
  projectId: "immune-connect",
  storageBucket: "immune-connect.firebasestorage.app",
  messagingSenderId: "523826882591",
  appId: "1:523826882591:web:7b336b308770e92c9d0d2a",
  measurementId: "G-BVVEPRZB5R"
};

// Inicializamos Firebase y la Base de Datos (Firestore)
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app); 
