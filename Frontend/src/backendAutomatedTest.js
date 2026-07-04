import { registerPatient, loginUser } from "./authService";
import { bookAppointment, saveMedicalRecord, getPatientMedicalRecord } from "./clinicService";

/**
 * TEST 1: Full Identity Flow (Registration + Login Profile Check)
 */
export const runIdentityTest = async () => {
  console.log("🚀 [TEST] Starting Identity Pipeline Test...");
  const uniqueEmail = `john_dev_${Date.now()}@clinicflow.com`; 
  
  const regResult = await registerPatient(
    uniqueEmail,
    "securepassword123",
    "john Dev Test",
    "0123456789"
  );

  if (regResult.success) {
    console.log("✅ [TEST] Registration Successful! UID:", regResult.user.uid);
    console.log("🔒 [TEST] Attempting universal login with new profile...");
    
    const loginResult = await loginUser(uniqueEmail, "securepassword123");
    if (loginResult.success) {
      console.log("🎯 [TEST] IDENTITY SUCCESS! Logged in role:", loginResult.role.toUpperCase());
      console.log("👋 [TEST] Welcome back,", loginResult.name);
    } else {
      console.error("❌ [TEST] Login Step Failed:", loginResult.error);
    }
  } else {
    console.error("❌ [TEST] Registration Step Failed:", regResult.error);
  }
};

/**
 * TEST 2: Clinical Operations Flow (Firestore Write + Read Check)
 */
export const runClinicalTest = async () => {
  console.log("⚙️ [TEST] Starting Clinical Database Pipeline Test...");
  const dummyPatientUID = `mockPatient_${Date.now()}`;

  console.log("📝 [TEST] Writing medical record file...");
  const recordRes = await saveMedicalRecord(dummyPatientUID, {
    bloodType: "B+",
    allergies: ["NSAIDs"],
    history: [{ date: "2026-06-28", diagnosis: "Chronic fatigue check up", doctorName: "Dr. Sherif" }]
  });

  if (recordRes.success) {
    console.log("✅ [TEST] Medical Record mapped to Firestore successfully!");
    console.log("🔍 [TEST] Testing real-time file retrieval tracking...");
    
    const fetchRes = await getPatientMedicalRecord(dummyPatientUID);
    console.log("📊 [TEST] CLINICAL SUCCESS! Cloud Record Data:", fetchRes.data);
  } else {
    console.error("❌ [TEST] Clinical Pipeline Failed:", recordRes.error);
  }
};