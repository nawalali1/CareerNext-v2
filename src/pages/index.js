// src/pages/index.js
import Head from "next/head";
import Home from "../components/Home";

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Home • CareerNext</title>
        <meta
          name="description"
          content="Discover careers tailored to your strengths and goals."
        />
      </Head>
      <Home />
    </>
  );
}
