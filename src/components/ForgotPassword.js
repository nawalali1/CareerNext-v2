import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { useRouter } from "next/router";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent! Check your inbox.");
    } catch (err) {
      setError("Something went wrong. Please check the email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-background">
      <div className="reset-overlay" />

      <div className="reset-centered-card">
        <div className="reset-card">
          <h1>Forgot Password?</h1>
          <p className="reset-subtext">
            Enter your email and we'll send you a reset link.
          </p>

          <form onSubmit={handleReset}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {error && <p className="reset-error">{error}</p>}
          {message && <p className="reset-success">{message}</p>}

          <div className="reset-footer">
            <p>
              Remembered your password?{" "}
              <span className="link" onClick={() => router.push("/login")}>Log in</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
