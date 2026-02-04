"use client";

import { useMemo, useState } from "react";

type Prediction = {
  stockCode: string;
  stockName: string;
  currentPrice: number;
  priceChange: number;
  priceChangePercentage: string;
  predictedPriceIn30Days: string;
  predictedPriceIn90Days: string;
  predictedPriceIn180Days: string;
  signal: string;
  accuracy: string;
  result: string;
};

type ApiResponse =
  | { success: true; data: Prediction; error: null }
  | { success: false; data: null; error: string };

export default function SearchPage() {
  const [stockCode, setStockCode] = useState("");
  const [result, setResult] = useState<Prediction | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const normalizedCode = useMemo(
    () => stockCode.trim().toUpperCase(),
    [stockCode],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setResult(null);

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
      const payload = (await response.json()) as ApiResponse;

      if (!response.ok || !payload.success) {
        setError(payload.error ?? "Failed to generate prediction.");
        return;
      }

      setResult(payload.data);
    } catch (fetchError) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
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

          {result && (
            <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    {result.stockCode}
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold">
                    {result.stockName}
                  </h2>
                </div>
                <div className="rounded-full border border-white/10 bg-white/10 px-5 py-2 text-sm text-white/70">
                  Signal:{" "}
                  <span className="font-semibold text-emerald-200">
                    {result.signal}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Current Price
                  </p>
                  <p className="mt-3 text-2xl font-semibold">
                    ₹{result.currentPrice}
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    {result.priceChange} ({result.priceChangePercentage})
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Accuracy
                  </p>
                  <p className="mt-3 text-2xl font-semibold">
                    {result.accuracy}
                  </p>
                  <p className="mt-2 text-sm text-white/70">
                    Model confidence score
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                    Price Targets
                  </p>
                  <p className="mt-3 text-sm text-white/80">
                    30D: {result.predictedPriceIn30Days}
                  </p>
                  <p className="mt-2 text-sm text-white/80">
                    90D: {result.predictedPriceIn90Days}
                  </p>
                  <p className="mt-2 text-sm text-white/80">
                    180D: {result.predictedPriceIn180Days}
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-white/80">
                {result.result}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}