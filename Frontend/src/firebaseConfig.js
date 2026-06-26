// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAWTKqthI4iE97oKHNi1ckbwCqumLnv8Y0",
  authDomain: "clinic-management-system-a8c06.firebaseapp.com",
  projectId: "clinic-management-system-a8c06",
  storageBucket: "clinic-management-system-a8c06.firebasestorage.app",
  messagingSenderId: "864313873135",
  appId: "1:864313873135:web:be508b3fe2d33ab728411a",
  measurementId: "G-9J1NV6SVK1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app) ;
export const db = getFirestore(app) ;