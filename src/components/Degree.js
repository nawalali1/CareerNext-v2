import React, { useState } from "react";
import { useRouter } from "next/router";

export default function Degree() {
  const [degree, setDegree] = useState("");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!degree.trim()) return;
    router.push(`/jobs?degree=${encodeURIComponent(degree.trim())}`);
  };

  return (
    <div className="degree-container">
      <form className="degree-form" onSubmit={handleSubmit}>
        <h2>Enter Your Degree</h2>
        <input
          type="text"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          placeholder="e.g. BSc Computer Science"
          required
        />
        <button type="submit">Search Jobs</button>
      </form>
    </div>
  );
}
