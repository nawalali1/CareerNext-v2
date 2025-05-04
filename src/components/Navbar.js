import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error.message);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link href="/">CareerNext</Link>
      </div>
      <div className="navbar-links">
        <Link href="/">Home</Link>
        <Link href="/cv">CV Builder</Link>
        <Link href="/questionnaire">Career Quiz</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
