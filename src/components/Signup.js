import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebase';

const Signup = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('Signup clicked', { email, password });
    setError(''); // Clear previous error

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/questionnaire');
    } catch (error) {
      console.error('Signup failed:', error);
      if (error.code === 'auth/email-already-in-use') {
        setError('This email is already in use. Try logging in.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Invalid email format.');
      } else if (error.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError('Signup failed. Please try again.');
      }
    }
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Sign Up</button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};

export default Signup;
