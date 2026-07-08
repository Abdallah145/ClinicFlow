import { db } from "./firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  onSnapshot,
  runTransaction
} from "firebase/firestore";

/**
 * 1. BOOK AN APPOINTMENT (Patient Feature)
 * Pushes a new booking entry into the global clinic queue timeline.
 */
export const bookAppointment = async (appointmentData) => {
  try {
    const nextQueueNumber = await runTransaction(db, async (transaction) => {
      const appointmentsRef = collection(db, "appointments");

      // Query to find all appointments for this specific doctor on this specific day
      const q = query(
        appointmentsRef,
        where("doctorId", "==", appointmentData.doctorId),
        where("date", "==", appointmentData.date)
      );

      const querySnapshot = await getDocs(q);

      // The next queue number is simply the current count + 1
      return querySnapshot.size + 1;
    });

    // Now push the new document with the guaranteed unique queue number
    const docRef = await addDoc(collection(db, "appointments"), {
      patientId: appointmentData.patientId,
      patientName: appointmentData.patientName,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      doctorSpecialty: appointmentData.doctorSpecialty || "General Physician", // Baked in for UI cards
      date: appointmentData.date,       // Format: YYYY-MM-DD
      timeSlot: appointmentData.timeSlot, // e.g., "11:00 AM"
      queueNumber: nextQueueNumber,      // Automatically computed safe position
      status: "pending",
      createdAt: new Date()
    });

    return { success: true, appointmentId: docRef.id, queueNumber: nextQueueNumber };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 2. GET DOCTOR APPOINTMENTS (Doctor/Queue Management View)
 * Fetches all appointments assigned to a specific doctor for a given day, sorted by queue order.
 */
export const getDoctorAppointments = async (doctorId, date) => {
  try {
    const appointmentsRef = collection(db, "appointments");
    const q = query(
      appointmentsRef,
      where("doctorId", "==", doctorId),
      where("date", "==", date),
      orderBy("queueNumber", "asc")
    );

    const querySnapshot = await getDocs(q);
    const appointments = [];
    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 3. INITIALIZE/UPDATE MEDICAL RECORD (Doctor/Clinical Feature)
 * Maps a heavy clinical tracking document directly to a Patient's unique ID.
 */
export const saveMedicalRecord = async (patientId, recordData) => {
  try {
    // We use setDoc with merge: true so we don't accidentally overwrite past history fields
    await setDoc(doc(db, "medicalRecords", patientId), {
      patientId: patientId,
      bloodType: recordData.bloodType,
      allergies: recordData.allergies || [],
      history: recordData.history || [] // Array of diagnosis objects
    }, { merge: true });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 4. GET PATIENT MEDICAL RECORD (Doctor Reference Feature)
 * Safely fetches a patient's complete history file before a consultation begins.
 */
export const getPatientMedicalRecord = async (patientId) => {
  try {
    const docSnap = await getDoc(doc(db, "medicalRecords", patientId));
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: true, data: { bloodType: "Not Specified", allergies: [], history: [] } };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};



/**
 * 5. UPDATE APPOINTMENT STATUS (Queue Control Feature)
 * Modifies an individual appointment's state as it moves through the clinic workflow.
 */
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    const appointmentRef = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentRef, {
      status: newStatus,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};


/**
 * 6. REAL-TIME DOCTOR QUEUE STREAM (Live Dashboard Feature)
 * Establishes a persistent live socket listener for a specific doctor's queue.
 * Returns an unsubscribe function to clean up the listener when the component unmounts.
 */
export const subscribeToDoctorQueue = (doctorId, callback) => {
  try {
    const appointmentsRef = collection(db, "appointments");

    // Complex query: Filters by doctor and status, then sorts chronologically
    const q = query(
      appointmentsRef,
      where("doctorId", "==", doctorId),
      where("status", "in", ["pending", "active"]),
      orderBy("createdAt", "asc")
    );

    // Return the active snapshot listener stream
    return onSnapshot(
      q,
      (querySnapshot) => {
        const appointments = [];
        querySnapshot.forEach((doc) => {
          appointments.push({ id: doc.id, ...doc.data() });
        });
        callback({ success: true, appointments });
      },
      (error) => {
        callback({ success: false, error: error.message });
      }
    );
  } catch (error) {
    callback({ success: false, error: error.message });
  }
};

/**
 * 7. GET ALL DOCTORS (Patient Directory Feature)
 * Queries the 'users' collection to pull all profiles where the role is strictly 'doctor'.
 */
export const getAllDoctors = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("role", "==", "doctor"));

    const querySnapshot = await getDocs(q);
    const doctors = [];

    querySnapshot.forEach((doc) => {
      doctors.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, doctors };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 8. GET PATIENT APPOINTMENTS (Patient Profile Dashboard Feature)
 * Fetches all historical and upcoming appointments booked by a specific patient,
 * ordered chronologically with the newest bookings showing first.
 */
export const getPatientAppointments = async (patientId) => {
  try {
    const appointmentsRef = collection(db, "appointments");

    // Query filters by the logged-in patient's ID and sorts by creation date
    const q = query(
      appointmentsRef,
      where("patientId", "==", patientId),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const appointments = [];

    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

/**
 * 9. GET ALL APPOINTMENTS (Admin Portal Master Overview)
 * Fetches every single appointment in the database across all doctors and patients.
 * Sorted chronologically by creation date.
 */
export const getAllAppointmentsAdmin = async () => {
  try {
    const appointmentsRef = collection(db, "appointments");
    const q = query(appointmentsRef, orderBy("createdAt", "desc"));

    const querySnapshot = await getDocs(q);
    const appointments = [];

    querySnapshot.forEach((doc) => {
      appointments.push({ id: doc.id, ...doc.data() });
    });

    return { success: true, appointments };
  } catch (error) {
    return { success: false, error: error.message };
  }
};