import React, { useState } from "react";
import { useRouter } from "next/router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Signup() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/questionnaire");
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const mapAuthError = (code) => {
    switch (code) {
      case "auth/email-already-in-use":
        return "This email is already registered.";
      case "auth/invalid-email":
        return "Invalid email format.";
      case "auth/weak-password":
        return "Password should be at least 6 characters.";
      default:
        return "Signup failed. Please try again.";
    }
  };

  return (
    <div className="signup-background">
      <div className="signup-overlay" />

      <div className="signup-centered-card">
        <div className="signup-card">
          <h1>Create Your Account</h1>
          <p className="signup-subtext">Start discovering your ideal career path today.</p>

          <form onSubmit={handleSignup}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          {error && <p className="signup-error">{error}</p>}

          <div className="signup-footer">
            <p>
              Already have an account?{" "}
              <span className="link" onClick={() => router.push("/login")}>Log in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
