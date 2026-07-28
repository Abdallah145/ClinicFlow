import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  const [state, setState] = useState("Sign Up");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const switchMode = (newState) => {
    setState(newState);
    setError("");
    setInfoMsg("");
    setPassword("");
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    setInfoMsg("");
    setLoading(true);

    try {
      // ===========================
      // 1. SIGN UP FLOW
      // ===========================
      if (state === "Sign Up") {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        // Save user profile to Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role: "patient",
          createdAt: new Date(),
        });

        // Send native Firebase verification link
        await sendEmailVerification(user);

        // Sign out immediately so unverified user isn't kept logged in
        await signOut(auth);

        setInfoMsg(
          "Account created! A verification link has been sent to your email. Please verify your email before logging in."
        );
        setState("Login");
        return;
      }

      // ===========================
      // 2. LOGIN FLOW
      // ===========================
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      // Check if user has verified their email address
      if (!user.emailVerified) {
        await signOut(auth);
        throw new Error(
          "Your email address is not verified yet. Please check your inbox for the verification link."
        );
      }

      // Fetch user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        await signOut(auth);
        throw new Error("Your user profile was not found in the database.");
      }

      const userData = userDoc.data();

      if (userData.role !== "patient") {
        await signOut(auth);
        throw new Error(
          userData.role === "admin"
            ? "Please use the Admin Panel login page."
            : "Please use the Doctor login page."
        );
      }

      navigate("/");
    } catch (err) {
      setError(
        err.message
          .replace("Firebase: ", "")
          .replace("auth/", "")
          .replace(/-/g, " ")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="min-h-[80vh] flex items-center"
    >
      <div className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg">
        <p className="text-2xl font-semibold">
          {state === "Sign Up" ? "Create Account" : "Patient Login"}
        </p>

        <p>
          Please {state === "Sign Up" ? "create an account" : "log in"} to book
          an appointment.
        </p>

        {/* Success / Informational Banner */}
        {infoMsg && (
          <div className="w-full p-3 text-xs text-green-700 bg-green-50 rounded border border-green-200 font-medium">
            {infoMsg}
          </div>
        )}

        {/* Error Banner */}
        {error && (
          <div className="w-full p-3 text-xs text-red-600 bg-red-50 rounded border border-red-200">
            {error}
          </div>
        )}

        {state === "Sign Up" && (
          <>
            <div className="w-full">
              <p>Full Name</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="w-full">
              <p>Phone Number</p>
              <input
                className="border border-zinc-300 rounded w-full p-2 mt-1"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="w-full">
          <p>Email</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <input
            className="border border-zinc-300 rounded w-full p-2 mt-1"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength="6"
            required
          />
        </div>

        <button
          disabled={loading}
          type="submit"
          className="bg-primary text-white w-full py-2 rounded-md text-base mt-2 disabled:bg-zinc-400"
        >
          {loading
            ? "Processing..."
            : state === "Sign Up"
              ? "Create account"
              : "Login"}
        </button>

        {state === "Sign Up" ? (
          <p>
            Already have an account?{" "}
            <span
              onClick={() => switchMode("Login")}
              className="text-primary underline cursor-pointer"
            >
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{" "}
            <span
              onClick={() => switchMode("Sign Up")}
              className="text-primary underline cursor-pointer"
            >
              Click here
            </span>
          </p>
        )}
      </div>
    </form>
  );
};

export default Login;