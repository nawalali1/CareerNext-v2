// src/pages/questionnaire.js
import Head from 'next/head'
import Questionnaire from '../components/Questionnaire'

export default function QuestionnairePage() {
  return (
    <>
      <Head>
        <title>CareerNext Quiz</title>
        <meta name="description" content="Answer our career quiz" />
      </Head>
      <Questionnaire />
    </>
  )
}
