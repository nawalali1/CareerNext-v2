// src/pages/results.js
import Head from "next/head";
import Results from "../components/Results";

export default function ResultsPage() {
  return (
    <>
      <Head>
        <title>Your Results • CareerNext</title>
        <meta
          name="description"
          content="Personalized career recommendations"
        />
      </Head>
      <Results />
    </>
  );
}
