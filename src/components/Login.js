import React, { useState } from "react";
import { useRouter } from "next/router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/cvbuilder");
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  };

  const mapAuthError = (code) => {
    switch (code) {
      case "auth/user-not-found":
        return "No account found with that email.";
      case "auth/wrong-password":
        return "Incorrect password.";
      case "auth/invalid-email":
        return "Invalid email format.";
      default:
        return "Login failed. Please try again.";
    }
  };

  return (
    <div className="login-background">
      <div className="login-overlay" />

      <div className="login-centered-card">
        <div className="login-card">
          <h1>Welcome Back</h1>
          <p className="login-subtext">
            Log in to continue exploring career paths and tools.
          </p>

          <form onSubmit={handleLogin} aria-label="Login form">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-label="Email address"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-label="Password"
            />

            <div className="login-meta">
              <label>
                <input type="checkbox" /> Remember me
              </label>
              <span
                className="link"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot password?
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {error && <p className="login-error">{error}</p>}

          <div className="login-footer">
            <p>
              Don't have an account?{" "}
              <span className="link" onClick={() => router.push("/signup")}>
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
