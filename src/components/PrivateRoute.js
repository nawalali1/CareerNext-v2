// src/components/PrivateRoute.js

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth } from "../firebase";           //import the auth instance
import { onAuthStateChanged } from "firebase/auth";

export default function PrivateRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    //Subscribe to auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }
  return children;
}
