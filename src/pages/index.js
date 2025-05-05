// src/pages/index.js
import Head from 'next/head'
import Home from '../components/Home'

export default function IndexPage() {
  return (
    <>
      <Head>
        <title>CareerNext</title>
        <meta name="description" content="Find your best career path" />
      </Head>
      <Home />
    </>
  )
}
