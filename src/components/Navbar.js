import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";


export default function Navbar() {
  const auth = getAuth();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, u => setUser(u));
    return unsubscribe;
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    setMenuOpen(false);
    router.push("/");
  };

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="navbar">
      {/* Logo */}
      <Link href="/" className="navbar-logo">
        CareerNext
      </Link>

      {/* Burger icon */}
      <button
        className="navbar-burger"
        onClick={() => setMenuOpen(open => !open)}
        aria-label="Toggle menu"
      >
        {menuOpen 
          ? <AiOutlineClose size={24} /> 
          : <AiOutlineMenu size={24} />
        }
      </button>

      {/* Dropdown / Inline Links */}
      <div className={`navbar-links${menuOpen ? " active" : ""}`}>
        <Link href="/" className={`nav-link${isActive("/") ? " active" : ""}`} onClick={() => setMenuOpen(false)}>
          Home
        </Link>
        <Link href="/cvbuilder" className={`nav-link${isActive("/cvbuilder") ? " active" : ""}`} onClick={() => setMenuOpen(false)}>
          CV Builder
        </Link>
        <Link href="/settings" className={`nav-link${isActive("/settings") ? " active" : ""}`} onClick={() => setMenuOpen(false)}>
          Settings
        </Link>
        {user ? (
          <button className="nav-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link href="/login" className="nav-button" onClick={() => setMenuOpen(false)}>
            Login
          </Link>
        )}
      </div>
    </nav>
);
}
