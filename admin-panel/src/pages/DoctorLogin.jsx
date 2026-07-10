import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { auth, db } from "../firebaseConfig";

const DoctorLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        throw new Error("User profile was not found.");
      }

      const userData = userDoc.data();

      if (userData.role !== "doctor") {
        await auth.signOut();
        toast.error("This account is not a doctor account.");
        return;
      }

      toast.success("Doctor logged in successfully");
      navigate("/doctor-dashboard");
    } catch (error) {
      console.error(error);
      toast.error(error.message.replace("Firebase: ", ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-screen flex items-center justify-center bg-[#F8F9FD]"
    >
      <div className="flex flex-col gap-3 p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white">
        <p className="text-2xl font-semibold m-auto text-[#5F6FFF]">
          <span className="text-gray-800">Doctor</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className="border rounded w-full p-2.5 mt-1"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="border rounded w-full p-2.5 mt-1"
            type="password"
            required
          />
        </div>

        <button
          disabled={loading}
          className="bg-[#5F6FFF] text-white w-full py-2.5 rounded-md mt-2 disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login as Doctor"}
        </button>
      </div>
    </form>
  );
};

export default DoctorLogin;