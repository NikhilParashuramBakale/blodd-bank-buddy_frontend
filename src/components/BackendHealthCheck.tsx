import { useEffect, useState } from "react";
import { API_URL } from "@/config/api";

const BackendHealthCheck = ({ children }: { children: React.ReactNode }) => {
  const [backendReady, setBackendReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [dots, setDots] = useState("");

  useEffect(() => {
    if (!API_URL) {
      // No API URL configured, skip health check
      setBackendReady(true);
      setChecking(false);
      return;
    }

    let cancelled = false;
    let dotInterval: ReturnType<typeof setInterval>;

    const pingBackend = async () => {
      try {
        const res = await fetch(`${API_URL}/api/health`, {
          method: "GET",
          signal: AbortSignal.timeout(10000),
        });
        if (!cancelled && res.ok) {
          setBackendReady(true);
          setChecking(false);
        }
      } catch {
        // Retry after 3 seconds
        if (!cancelled) {
          setTimeout(pingBackend, 3000);
        }
      }
    };

    // Animate dots
    dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);

    pingBackend();

    // Auto-dismiss after 45 seconds even if backend is unreachable
    const timeout = setTimeout(() => {
      if (!cancelled) {
        setBackendReady(true);
        setChecking(false);
      }
    }, 45000);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
      clearInterval(dotInterval);
    };
  }, []);

  if (!checking && backendReady) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-red-950 via-gray-900 to-red-950">
      <div className="text-center space-y-6 p-8">
        {/* Animated blood drop */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
          <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-red-600/30 border border-red-500/40">
            <span className="text-4xl animate-bounce">🩸</span>
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            Waking up the server{dots}
          </h2>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            The backend server is starting up. This may take up to 30 seconds on the first visit.
          </p>
        </div>

        {/* Progress bar animation */}
        <div className="w-64 mx-auto h-1.5 bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full animate-loading-bar" />
        </div>
      </div>
    </div>
  );
};

export default BackendHealthCheck;
