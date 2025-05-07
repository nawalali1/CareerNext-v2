// src/pages/settings.js
import Head from "next/head";
import Settings from "../components/Settings";

export default function SettingsPage() {
  return (
    <>
      <Head>
        <title>Settings • CareerNext</title>
        <meta name="description" content="Manage your CareerNext account settings" />
      </Head>
      <Settings />
    </>
  );
}
