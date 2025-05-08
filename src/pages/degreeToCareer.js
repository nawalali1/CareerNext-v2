// src/pages/degreeToCareer.js
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function DegreeToCareer() {
  const router = useRouter();
  const { career } = router.query;

  useEffect(() => {
    if (career) {
      // Automatically redirect to /jobs?degree=career
      router.push(`/jobs?degree=${encodeURIComponent(career)}`);
    }
  }, [career]);

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Redirecting to live jobs for: {career}</h2>
    </div>
  );
}
