"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Prediction = {
  id: string;
  stockCode: string;
  stockName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: number;
  predictedPriceIn30Days: number;
  predictedPriceIn90Days: number;
  predictedPriceIn180Days: number;
  signal: string;
  accuracy: number;
  result: string;
  createdAt: string;
};

type GenerateApiResponse =
  | { success: true; data: Prediction; error: null }
  | { success: false; data: null; error: string };

type PredictionsApiResponse =
  | { success: true; data: Prediction[]; error: null }
  | { success: false; data: null; error: string };

export default function SearchPage() {
  const router = useRouter();
  const [stockCode, setStockCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const normalizedCode = useMemo(
    () => stockCode.trim().toUpperCase(),
    [stockCode]
  );

  // Fetch all predictions on mount
  useEffect(() => {
    async function fetchPredictions() {
      try {
        const response = await fetch("/api/v1/predictions");
        const payload = (await response.json()) as PredictionsApiResponse;
        if (payload.success && payload.data) {
          setPredictions(payload.data);
        }
      } catch (err) {
        console.error("Failed to fetch predictions:", err);
      }
    }
    fetchPredictions();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!normalizedCode) {
      setError("Enter a stock code to continue.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: normalizedCode }),
      });
      const payload = (await response.json()) as GenerateApiResponse;

      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Failed to generate prediction.");
        return;
      }

      // Redirect to the reports page
      router.push(`/reports/${payload.data.stockCode}`);
    } catch (fetchError) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getSignalColor = (signal: string) => {
    switch (signal.toUpperCase()) {
      case "STRONG BUY":
        return "text-emerald-400";
      case "BUY":
        return "text-green-400";
      case "HOLD":
        return "text-amber-400";
      case "SELL":
        return "text-orange-400";
      case "STRONG SELL":
        return "text-red-400";
      default:
        return "text-white/70";
    }
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-emerald-400";
    if (change < 0) return "text-red-400";
    return "text-white/70";
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-[160px]" />
          <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-[160px]" />
        </div>

        <main className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-10 px-6 py-20">
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.35em] text-white/60">
              AI Stock Search
            </p>
            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              Search a stock code
            </h1>
            <p className="mt-3 text-base text-white/70">
              Enter a NSE code to generate a fresh market prediction.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full">
            <div className="group relative">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 opacity-60 blur-2xl transition duration-500 group-hover:opacity-90" />
              <div className="absolute inset-0 rounded-full bg-white/10 opacity-40 blur-3xl animate-pulse" />
              <div className="relative flex items-center gap-3 rounded-full border border-white/10 bg-[#0A1128]/90 px-6 py-4 shadow-2xl shadow-black/40 backdrop-blur-xl md:px-8 md:py-5">
                <span className="text-sm text-white/60">NSE</span>
                <input
                  value={stockCode}
                  onChange={(event) => setStockCode(event.target.value)}
                  placeholder="e.g. RELIANCE, HDFCBANK"
                  className="w-full bg-transparent text-lg font-semibold tracking-wide text-white outline-none placeholder:text-white/40 md:text-xl"
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-[#0A1128] shadow-lg shadow-amber-500/30 transition disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isLoading ? "Generating..." : "Generate"}
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-amber-200">
              {error}
            </div>
          )}

          {/* Auto-scrolling predictions section */}
          {predictions.length > 0 && (
            <div className="w-full mt-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    Recent Predictions
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    Generated Reports
                  </h2>
                </div>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 hover:bg-white/10 transition"
                >
                  {isPaused ? "Resume" : "Pause"}
                </button>
              </div>

              {/* Continuous scroll container */}
              <div className="overflow-hidden">
                <div
                  onMouseEnter={() => setIsPaused(true)}
                  onMouseLeave={() => setIsPaused(false)}
                  className="flex gap-4 pb-4"
                  style={{
                    animation: `scroll ${predictions.length * 5}s linear infinite`,
                    animationPlayState: isPaused ? "paused" : "running",
                    width: "fit-content",
                  }}
                >
                  {/* Render predictions twice for seamless loop */}
                  {[...predictions, ...predictions].map((prediction, index) => (
                    <div
                      key={`${prediction.id}-${index}`}
                      onClick={() => router.push(`/reports/${prediction.stockCode}`)}
                      className="flex-shrink-0 w-72 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl cursor-pointer hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                            {prediction.stockCode}
                          </p>
                          <h3 className="mt-1 text-lg font-semibold truncate max-w-[180px]">
                            {prediction.stockName}
                          </h3>
                        </div>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full bg-white/10 ${getSignalColor(
                            prediction.signal
                          )}`}
                        >
                          {prediction.signal}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-2xl font-semibold">
                          ₹{prediction.currentPrice.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-sm ${getPriceChangeColor(
                            prediction.priceChange
                          )}`}
                        >
                          {prediction.priceChange > 0 ? "+" : ""}
                          {prediction.priceChange.toFixed(2)} (
                          {prediction.priceChangePercentage.toFixed(2)}%)
                        </span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-white/70">
                          <span>30D Target</span>
                          <span className="font-medium text-white">
                            ₹{prediction.predictedPriceIn30Days.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>90D Target</span>
                          <span className="font-medium text-white">
                            ₹{prediction.predictedPriceIn90Days.toLocaleString("en-IN")}
                          </span>
                        </div>
                        <div className="flex justify-between text-white/70">
                          <span>Accuracy</span>
                          <span className="font-medium text-emerald-400">
                            {prediction.accuracy}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
