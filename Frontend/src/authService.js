import { auth, db } from "./firebaseConfig"; 
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

/**
 * 1. PATIENT REGISTRATION
 * Creates an auth account and saves a matching user profile document with a 'patient' role.
 */
export const registerPatient = async (email, password, fullName, phone) => {
  try {
    // Create the user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save the user profile details into the Firestore 'users' collection
    // We use user.uid as the document ID to link Auth and Database together
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: fullName,
      email: email,
      phone: phone,
      role: "patient", // Enforces the role strictly
      createdAt: new Date()
    });

    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 2. UNIVERSAL LOGIN
 * Logs the user in and retrieves their specific role to handle dashboard redirection.
 */
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Fetch their profile document to find out their role
    const userDoc = await getDoc(doc(db, "users", user.uid));
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return { success: true, role: userData.role, user };
    } else {
      throw new Error("User profile data not found.");
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};