// src/components/LoadingScreen.js
import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function LoadingScreen() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/')
    }, 2000) // or whatever your v1 timing was
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="loading-screen">
      <div className="spinner" /> {/* your CSS spinner */}
      <p>Loading...</p>
    </div>
  )
}
