import { useState, useEffect, useCallback } from "react";

type Status = "idle" | "loading" | "ok" | "error";

interface Props {
  backendUrl: string;
}

export function HealthStatus({ backendUrl }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const checkHealth = useCallback(async () => {
    setStatus("loading");
    setErrorMessage(null);

    try {
      const response = await fetch(`${backendUrl}/health`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.status === "ok") {
        setStatus("ok");
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    }
  }, [backendUrl]);

  useEffect(() => {
    checkHealth();
  }, [checkHealth]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Backend Status</h2>
      <div style={{ marginTop: "1rem" }}>
        {status === "loading" && <p>Checking...</p>}
        {status === "ok" && <p style={{ color: "green" }}>Connected</p>}
        {status === "error" && (
          <>
            <p style={{ color: "red" }}>Disconnected</p>
            {errorMessage && <p style={{ fontSize: "0.875rem" }}>{errorMessage}</p>}
          </>
        )}
      </div>
      <button
        onClick={checkHealth}
        disabled={status === "loading"}
        style={{ marginTop: "1rem", padding: "0.5rem 1rem" }}
      >
        Retry
      </button>
    </div>
  );
}
