// src/pages/loading.js
import Head from "next/head";
import LoadingScreen from "../components/LoadingScreen";

export default function LoadingPage() {
  return (
    <>
      <Head>
        <title>Loading…</title>
      </Head>
      <LoadingScreen />
    </>
  );
}
