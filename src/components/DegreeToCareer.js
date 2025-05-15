// components/DegreeToCareer.js
import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function DegreeToCareer() {
  const router = useRouter();
  const { career } = router.query;

  useEffect(() => {
    if (career) {
      //Auto-redirect to /jobs?degree=…
      router.push(`/jobs?degree=${encodeURIComponent(career)}`);
    }
  }, [career]);

  return (
    <div className="degree-container">
      <h2>Redirecting to live jobs for: {career}</h2>
    </div>
  );
}
