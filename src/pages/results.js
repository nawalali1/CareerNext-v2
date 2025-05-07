import Head from "next/head";
import Results from "../components/Results";

export default function ResultsPage() {
  return (
    <>
      <Head>
        <title>Your Results</title>
        <meta name="description" content="Personalized career recommendations" />
      </Head>
      <Results />
    </>
  );
}
