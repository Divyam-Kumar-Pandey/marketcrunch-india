import { prisma } from "@/utils/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

const StockReportPage = async ({
  params,
}: {
  params: Promise<{ stockCode: string }>;
}) => {
  const { stockCode } = await params;

  const prediction = await prisma.prediction.findFirst({
    where: {
      stockCode: stockCode.toUpperCase(),
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!prediction) {
    notFound();
  }

  const getSignalColor = (signal: string) => {
    switch (signal.toUpperCase()) {
      case "STRONG BUY":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "BUY":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "HOLD":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "SELL":
        return "text-orange-400 bg-orange-400/10 border-orange-400/20";
      case "STRONG SELL":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-white/70 bg-white/10 border-white/20";
    }
  };

  const getPriceChangeColor = (change: number) => {
    if (change > 0) return "text-emerald-400";
    if (change < 0) return "text-red-400";
    return "text-white/70";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-IN", {
      dateStyle: "long",
      timeStyle: "short",
    }).format(new Date(date));
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-white">
      <div className="relative overflow-hidden">
        {/* Background gradients */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-96 w-96 rounded-full bg-amber-400/20 blur-[180px]" />
          <div className="absolute -right-10 bottom-0 h-96 w-96 rounded-full bg-emerald-400/20 blur-[180px]" />
        </div>

        <main className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-6 py-12">
          {/* Back button */}
          <Link
            href="/search"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition w-fit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            Back to Search
          </Link>

          {/* Header section */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-white/60">
                  {prediction.stockCode}
                </p>
                <h1 className="mt-3 text-3xl font-semibold md:text-4xl">
                  {prediction.stockName}
                </h1>
                <p className="mt-2 text-sm text-white/50">
                  Report generated on {formatDate(prediction.createdAt)}
                </p>
              </div>
              <div
                className={`inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-semibold ${getSignalColor(
                  prediction.signal
                )}`}
              >
                {prediction.signal}
              </div>
            </div>

            {/* Current price section */}
            <div className="mt-8 flex items-baseline gap-4">
              <span className="text-4xl font-bold md:text-5xl">
                ₹{prediction.currentPrice.toLocaleString("en-IN")}
              </span>
              <span
                className={`text-lg font-medium ${getPriceChangeColor(
                  prediction.priceChange
                )}`}
              >
                {prediction.priceChange > 0 ? "+" : ""}
                {prediction.priceChange.toFixed(2)} (
                {prediction.priceChangePercentage.toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                30 Day Target
              </p>
              <p className="mt-3 text-2xl font-semibold">
                ₹{prediction.predictedPriceIn30Days.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm text-white/50">Short term outlook</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                90 Day Target
              </p>
              <p className="mt-3 text-2xl font-semibold">
                ₹{prediction.predictedPriceIn90Days.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm text-white/50">Medium term outlook</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                180 Day Target
              </p>
              <p className="mt-3 text-2xl font-semibold">
                ₹{prediction.predictedPriceIn180Days.toLocaleString("en-IN")}
              </p>
              <p className="mt-2 text-sm text-white/50">Long term outlook</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.2em] text-white/60">
                Model Accuracy
              </p>
              <p className="mt-3 text-2xl font-semibold text-emerald-400">
                {prediction.accuracy}%
              </p>
              <p className="mt-2 text-sm text-white/50">Confidence score</p>
            </div>
          </div>

          {/* Analysis section */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-white/80">
              Analysis
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/80">
              {prediction.result}
            </p>
          </div>

          {/* Price targets visualization */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
            <h2 className="text-lg font-semibold uppercase tracking-[0.2em] text-white/80 mb-6">
              Price Targets
            </h2>
            <div className="space-y-6">
              {[
                {
                  label: "30 Days",
                  value: prediction.predictedPriceIn30Days,
                },
                {
                  label: "90 Days",
                  value: prediction.predictedPriceIn90Days,
                },
                {
                  label: "180 Days",
                  value: prediction.predictedPriceIn180Days,
                },
              ].map((target) => {
                const percentChange =
                  ((target.value - prediction.currentPrice) /
                    prediction.currentPrice) *
                  100;
                const isPositive = percentChange > 0;
                const barWidth = Math.min(
                  Math.abs(percentChange) * 2,
                  100
                );

                return (
                  <div key={target.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">
                        {target.label}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-semibold">
                          ₹{target.value.toLocaleString("en-IN")}
                        </span>
                        <span
                          className={`text-sm font-medium ${
                            isPositive ? "text-emerald-400" : "text-red-400"
                          }`}
                        >
                          {isPositive ? "+" : ""}
                          {percentChange.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isPositive
                            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
                            : "bg-gradient-to-r from-red-500 to-red-400"
                        }`}
                        style={{ width: `${barWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5">
            <p className="text-sm text-amber-200/80">
              <span className="font-semibold">Disclaimer:</span> This prediction
              is generated by AI based on fundamental analysis and is for
              informational purposes only. It does not constitute financial
              advice. Please consult a qualified financial advisor before making
              any investment decisions.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StockReportPage;
