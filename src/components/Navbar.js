// src/components/Navbar.js
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return unsub;
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/" className="navbar-logo">
          CareerNext
        </Link>
      </div>

      <div className="navbar-links">
        <Link
          href="/"
          className={`nav-link ${isActive("/") ? "active" : ""}`}
        >
          Home
        </Link>

        <Link
          href="/cvbuilder"
          className={`nav-link ${isActive("/cvbuilder") ? "active" : ""}`}
        >
          CV Builder
        </Link>

        <Link
          href="/settings"
          className={`nav-link ${isActive("/settings") ? "active" : ""}`}
        >
          Settings
        </Link>

        {user ? (
          <button onClick={handleLogout} className="nav-button">
            Logout
          </button>
        ) : (
          <Link href="/login" className="nav-button">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
