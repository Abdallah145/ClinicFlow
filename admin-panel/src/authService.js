import { auth, db } from "./firebaseConfig";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

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
 * 2. ADMIN-LED DOCTOR REGISTRATION (Upgraded for UI Fields)
 * Allows a logged-in Admin to create an account for a new Doctor with full profile metadata.
 */
export const registerDoctor = async (email, password, doctorData) => {
  try {
    // 1. Create the authentication record in Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Create the complete profile matching the Admin Panel form fields
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: doctorData.fullName,
      email: email,
      phone: doctorData.phone,
      role: "doctor",
      specialty: doctorData.specialty,
      education: doctorData.education || "",
      experience: doctorData.experience || "",
      fees: doctorData.fees || "",
      about: doctorData.about || "",
      address: {
        line1: doctorData.addressLine1 || "",
        line2: doctorData.addressLine2 || ""
      },
      available: true, // Used to toggle availability status on cards
      createdAt: new Date()
    });

    return { success: true, uid: user.uid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 3. UNIVERSAL LOGIN & ROLE RETRIEVAL
 * Logs in any user (Patient, Doctor, or Admin) and fetches their database 
 * profile so the React router can immediately redirect them to the correct dashboard.
 */
export const loginUser = async (email, password) => {
  try {
    // 1. Authenticate the email and password credentials
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Fetch the user's matching document from the 'users' collection
    const userDoc = await getDoc(doc(db, "users", user.uid));

    if (userDoc.exists()) {
      const userData = userDoc.data();
      // Return the role along with success so the frontend team can read it instantly
      return { success: true, role: userData.role, uid: user.uid, name: userData.name };
    } else {
      throw new Error("User registration profile data was not found.");
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 4. SESSION TERMINATION
 * Clears the active authentication state tracking token from the client browser session.
 */
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 5. UPDATED DOCTOR PROFILE MUTATOR
 * Dynamically updates profile data or Cloudinary strings globally in Firestore.
 */
export const updateDoctorProfile = async (doctorId, updatedFields) => {
  try {
    const doctorRef = doc(db, "users", doctorId);

    // Updates only the changed parameters while leaving existing rows untouched
    await updateDoc(doctorRef, {
      ...updatedFields,
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};