// src/pages/signup.js
import Head from 'next/head'
import Signup from '../components/Signup'

export default function SignupPage() {
  return (
    <>
      <Head>
        <title>Create an Account</title>
        <meta name="description" content="Sign up for CareerNext" />
      </Head>
      <Signup />
    </>
  )
}
