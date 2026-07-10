import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAWTKqthI4iE97oKHNi1ckbwCqumLnv8Y0",
  authDomain: "clinic-management-system-a8c06.firebaseapp.com",
  projectId: "clinic-management-system-a8c06",
  storageBucket: "clinic-management-system-a8c06.firebasestorage.app",
  messagingSenderId: "864313873135",
  appId: "1:864313873135:web:be508b3fe2d33ab728411a",
  measurementId: "G-9J1NV6SVK1",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);