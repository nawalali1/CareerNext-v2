// src/pages/cvbuilder.js
import Head from 'next/head';
import dynamic from 'next/dynamic';

//Dynamically import the CVBuilder component from src/components
const CVBuilder = dynamic(() => import('../components/CVBuilder'), {
  ssr: false, //disable server‐side rendering if CVBuilder uses browser APIs
});

export default function CVBuilderPage() {
  return (
    <>
      <Head>
        <title>CV Builder • CareerNext</title>
        <meta
          name="description"
          content="Build your professional CV step by step with CareerNext."
        />
      </Head>

      <main style={{ padding: '2rem', marginTop: '4rem' }}>
        <CVBuilder />
      </main>
    </>
  );
}
