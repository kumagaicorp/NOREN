import { useState } from "react";
import { HealthStatus } from "../features/health/HealthStatus";

export function App() {
  const [backendUrl] = useState("http://localhost:8000");

  return (
    <main>
      <h1>NOREN</h1>
      <HealthStatus backendUrl={backendUrl} />
    </main>
  );
}
