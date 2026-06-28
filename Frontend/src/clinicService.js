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
  orderBy 
} from "firebase/firestore";

/**
 * 1. BOOK AN APPOINTMENT (Patient Feature)
 * Pushes a new booking entry into the global clinic queue timeline.
 */
export const bookAppointment = async (appointmentData) => {
  try {
    const docRef = await addDoc(collection(db, "appointments"), {
      patientId: appointmentData.patientId,
      patientName: appointmentData.patientName,
      doctorId: appointmentData.doctorId,
      doctorName: appointmentData.doctorName,
      date: appointmentData.date,       // Format: YYYY-MM-DD
      timeSlot: appointmentData.timeSlot, // e.g., "11:00 AM"
      queueNumber: appointmentData.queueNumber, // Dynamic queue calculation tracker
      status: "pending",                 // 'pending', 'active', 'completed', 'cancelled'
      createdAt: new Date()
    });
    return { success: true, appointmentId: docRef.id };
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