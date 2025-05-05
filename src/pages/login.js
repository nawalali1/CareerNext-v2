// src/pages/login.js
import Head from 'next/head'
import Login from '../components/Login'

export default function LoginPage() {
  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Log in to CareerNext" />
      </Head>
      <Login />
    </>
  )
}
