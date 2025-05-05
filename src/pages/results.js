// src/pages/results.js
import Head from 'next/head'
import Results from '../components/Results'

export default function ResultsPage() {
  return (
    <>
      <Head>
        <title>Results</title>
        <meta name="description" content="Your career suggestions" />
      </Head>
      <Results />
    </>
  )
}
