// src/pages/degree.js
import Head from "next/head";
import Degree from "../components/Degree";

export default function DegreePage() {
  return (
    <>
      <Head>
        <title>Degree • CareerNext</title>
        <meta name="description" content="Tell us your degree to find matching jobs" />
      </Head>
      <Degree />
    </>
  );
}
