import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ user, element }) {
  // 1) While we’re waiting for Firebase to tell us if there *is* a user, show a loader.
  if (user === undefined) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading…</h2>
      </div>
    );
  }

  // 2) If there *is* a user, render the protected page.
  if (user) {
    return element;
  }

  // 3) Otherwise, send them to login.
  return <Navigate to="/login" replace />;
}
