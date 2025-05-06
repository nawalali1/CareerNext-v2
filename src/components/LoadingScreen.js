import { useEffect } from "react";
import { useRouter } from "next/router";


function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/results");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="loading-screen">
      <div className="loading-box">
        <div className="loader" />
        <h2>Analyzing your answers...</h2>
      </div>
    </div>
  );
}

export default LoadingScreen;
