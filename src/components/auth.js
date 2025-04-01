import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase"; // Import Firebase Auth & Firestore
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import "./auth.css"; // Import styles

const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(""); // Store error messages
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    try {
      if (isSignup) {
        // Signup Process
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        // Update Firebase Auth profile (display name)
        await updateProfile(user, {
          displayName: formData.username, // Store username in profile
        });

        // Store user details in Firestore
        await setDoc(doc(db, "users", user.uid), {
          username: formData.username,
          fullname: formData.fullname,
          email: formData.email,
        });

      } else {
        // Login Process
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      }

      navigate("/home"); // Redirect after login/signup
    } catch (err) {
      setError(err.message); // Show error message if authentication fails
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isSignup ? "Create Account" : "Sign In"}</h2>
        {error && <p className="error-message">{error}</p>} {/* Display error message */}
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="fullname"
                placeholder="Full Name"
                value={formData.fullname}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit">{isSignup ? "Sign Up" : "Login"}</button>
        </form>
        <p onClick={() => setIsSignup(!isSignup)} className="toggle-link">
          {isSignup ? "Already have an account? Sign In" : "New to Cartify? Sign Up"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
