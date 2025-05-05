// src/pages/cvbuilder.js
import Head from 'next/head'
import CVBuilder from '../components/CVBuilder'

export default function CVBuilderPage() {
  return (
    <>
      <Head>
        <title>CV Builder</title>
        <meta name="description" content="Create your CV" />
      </Head>
      <CVBuilder />
    </>
  )
}
