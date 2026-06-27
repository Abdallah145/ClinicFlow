// TEMPORARY DUAL ARCHITECTURE TEST BLOCK
import { registerPatient, loginUser } from "./authService";

const runFullIdentityTest = async () => {
  console.log("🚀 Step 1: Registering fresh patient profile...");
  const uniqueEmail = `john_dev_${Date.now()}@clinicflow.com`; // Guarantees a fresh account every single reload
  
  const regResult = await registerPatient(
    uniqueEmail,
    "securepassword123",
    "john Dev Test",
    "0123456789"
  );

  if (regResult.success) {
    console.log("✅ Registration Successful! UID:", regResult.user.uid);
    console.log("🔒 Step 2: Attempting universal login with new profile...");
    
    // Now let's try logging in with the freshly minted account
    const loginResult = await loginUser(uniqueEmail, "securepassword123");
    
    if (loginResult.success) {
      console.log("🎯 DUAL TEST SUCCESS! Logged in user role is:", loginResult.role.toUpperCase());
      console.log("👋 Welcome back,", loginResult.name);
    } else {
      console.error("❌ Login Step Failed:", loginResult.error);
    }
  } else {
    console.error("❌ Registration Step Failed:", regResult.error);
  }
};

export default runFullIdentityTest ;