// src/pages/loadingscreen.js
import Head from 'next/head'
import LoadingScreen from '../components/LoadingScreen'

export default function LoadingScreenPage() {
  return (
    <>
      <Head>
        <title>Loading…</title>
      </Head>
      <LoadingScreen />
    </>
  )
}
