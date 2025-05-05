// src/components/Navbar.js

import Link from "next/link";

export default function Navbar() {
  const linkStyle = {
    color: "#ffffff",
    fontWeight: 600,
    textDecoration: "none",
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1.5rem",
        padding: "1rem 2rem",
        backgroundColor: "#3f51b5",
      }}
    >
      <Link href="/" style={linkStyle}>
        Home
      </Link>

      <Link href="/questionnaire" style={linkStyle}>
        Questionnaire
      </Link>

      <Link href="/CVBuilder" style={linkStyle}>
        CV Builder
      </Link>
    </nav>
  );
}
