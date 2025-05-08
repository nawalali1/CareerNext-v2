// src/pages/cv-builder.js
import Head from 'next/head'
import dynamic from 'next/dynamic'

// CVBuilder uses html2canvas/jsPDF and client-only hooks, so we
// disable SSR to avoid “window is not defined” errors.
const CVBuilder = dynamic(() => import('../components/CVBuilder'), { ssr: false })

export default function CvBuilderPage() {
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
