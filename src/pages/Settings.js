// src/pages/settings.js
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Head from "next/head";
import Settings from "../components/Settings";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        //If no user, send them to login
        router.replace("/login");
      } else {
        //Logged in — show the page
        setLoading(false);
      }
    });
    return unsubscribe;
  }, [auth, router]);

  //While checking auth, show a placeholder
  if (loading) {
    return <p style={{ padding: "2rem", marginTop: "4rem" }}>Loading…</p>;
  }

  return (
    <>
      <Head>
        <title>Settings • CareerNext</title>
        <meta name="description" content="Manage your CareerNext account settings" />
      </Head>
      <main style={{ padding: "2rem", marginTop: "4rem" }}>
        <Settings />
      </main>
    </>
  );
}
