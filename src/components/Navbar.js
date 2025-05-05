import { useState, useEffect } from "react";
import Link from "next/link";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

export default function Navbar() {
  const auth = getAuth();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // subscribe to auth state
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link href="/" legacyBehavior>
          <a>CareerNext</a>
        </Link>
      </div>
      <div className="navbar-links">
        <Link href="/" legacyBehavior>
          <a>Home</a>
        </Link>
        <Link href="/questionnaire" legacyBehavior>
          <a>Questionnaire</a>
        </Link>
        <Link href="/cvbuilder" legacyBehavior>
          <a>CV Builder</a>
        </Link>

        {!user ? (
          <Link href="/login" legacyBehavior>
            <button className="nav-button">Login</button>
          </Link>
        ) : (
          <>
            <Link href="/settings" legacyBehavior>
              <button className="nav-button">Settings</button>
            </Link>
            <button onClick={handleLogout} className="nav-button">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
