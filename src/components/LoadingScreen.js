import { useRouter } from "next/router";
import { useEffect } from "react";

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const answers = JSON.parse(localStorage.getItem("cn_answers") || "[]");

    (async () => {
      try {
        const res = await fetch("/api/questionnaireFeedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers }),
        });
        const data = await res.json();
        const raw = data.text || "";
        const match = raw.match(/\{[\s\S]*\}/);
        if (match) {
          const parsed = JSON.parse(match[0]);
          // For 5 recommendations:
          localStorage.setItem(
            "cn_recs",
            JSON.stringify(parsed.recommendations || [])
          );
        }
      } catch (e) {
        console.error("API error:", e);
        // store empty array so Results shows fallback
        localStorage.setItem("cn_recs", JSON.stringify([]));
      } finally {
        router.push("/results");
      }
    })();
  }, [router]);

  return (
    <div className="loading-screen">
      <div className="loading-box">
        <div className="loader" />
        <h2>Analyzing your answers…</h2>
      </div>
    </div>
  );
}
