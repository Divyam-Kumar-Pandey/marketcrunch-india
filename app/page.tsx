"use client";

import { memo, useEffect, useRef, useState } from "react";

const predictions = [
  {
    stock: "$RELIANCE",
    signal: "Bullish",
    accuracy: "86%",
    result: "Hit",
  },
  {
    stock: "$HDFCBANK",
    signal: "Bearish",
    accuracy: "79%",
    result: "Hit",
  },
  {
    stock: "$INFY",
    signal: "Bullish",
    accuracy: "83%",
    result: "Miss",
  },
  {
    stock: "$TCS",
    signal: "Bullish",
    accuracy: "88%",
    result: "Hit",
  },
  {
    stock: "$ITC",
    signal: "Neutral",
    accuracy: "72%",
    result: "Hit",
  },
];

const TradingViewWidget = memo(function TradingViewWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "dataSource": "SENSEX",
        "blockSize": "market_cap_basic",
        "blockColor": "change",
        "grouping": "sector",
        "locale": "en",
        "symbolUrl": "",
        "colorTheme": "dark",
        "exchanges": [],
        "hasTopBar": false,
        "isDataSetEnabled": false,
        "isZoomEnabled": true,
        "hasSymbolTooltip": true,
        "isMonoSize": false,
        "width": "100%",
        "height": "100%"
      }`;

    containerRef.current.appendChild(script);

    return () => {
      if (containerRef.current?.contains(script)) {
        containerRef.current.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container" ref={containerRef}>
      <div className="tradingview-widget-container__widget" />
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/heatmap/stock/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Stock Heatmap</span>
        </a>
        <span className="trademark"> by TradingView</span>
      </div>
    </div>
  );
});

export default function Home() {
  const [ticker, setTicker] = useState("");
  const [showLogic, setShowLogic] = useState(false);

  useEffect(() => {
    if (!ticker) return;
    setShowLogic(true);
    const timer = setTimeout(() => setShowLogic(false), 1000);
    return () => clearTimeout(timer);
  }, [ticker]);

  return (
    <div className="min-h-screen bg-[#0A1128] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-72 w-72 rounded-full bg-amber-400/20 blur-[160px]" />
          <div className="absolute -right-10 bottom-0 h-72 w-72 rounded-full bg-emerald-400/20 blur-[160px]" />
        </div>
        <main className="relative mx-auto flex w-full max-w-6xl flex-col gap-20 px-6 py-16 md:px-10 lg:px-16">
          <header className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
                <svg
                  viewBox="0 0 24 24"
                  className="h-6 w-6 text-amber-300"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    d="M12 3l2.2 4.4 4.8.7-3.5 3.4.8 4.8L12 14.8 7.7 16.3l.8-4.8L5 8.1l4.8-.7L12 3z"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-white/60">
                  Market Crunch AI - India
                </p>
                <p className="text-lg font-semibold">Premium Bharat-Tech</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.25em] text-emerald-200">
                Verified by Backtesting
              </span>
              <span className="rounded-full border border-white/20 bg-white/5 px-4 py-1 text-xs uppercase tracking-[0.25em] text-amber-200">
                SEBI Compliant
              </span>
            </div>
          </header>

          <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-sm text-white/70">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Alpha for your Demat · Level up your SIP
              </div>
              <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                Predict the Nifty Pulse. 80% Accuracy for the Modern Indian
                Trader.
              </h1>
              <p className="max-w-xl text-lg text-white/70">
                Aesthetic glassmorphism intelligence layered with real market
                signals. Built for Gen Z traders who trust data, not noise.
              </p>
              <div className="flex flex-wrap gap-4">
                <button onClick={() => window.location.href = "/login"} className="cursor-pointer rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-[#0A1128] shadow-lg shadow-amber-500/20">
                  Start Predicting
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/60">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-emerald-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path
                        d="M4 14c4.5-3 6.5-8 8-8s3.5 5 8 8"
                        strokeLinecap="round"
                      />
                      <path
                        d="M4 14c4.5-3 6.5-8 8-8s3.5 5 8 8"
                        strokeLinecap="round"
                        transform="translate(0 6)"
                      />
                    </svg>
                  </span>
                  <span>Wealth/Lakshmi signals</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-5 w-5 text-amber-200"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    >
                      <path
                        d="M12 4l6 6-6 6-6-6 6-6z"
                        strokeLinejoin="round"
                      />
                      <path d="M6 16h12" strokeLinecap="round" />
                    </svg>
                  </span>
                  <span>Minimalist Bharat-tech iconography</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl border border-white/10 bg-white/5 blur-2xl" />
              <div className="relative rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl">
                <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60">
                  <span>Market Pulse</span>
                  <span>$NIFTY50</span>
                </div>
                <div className="mt-6 grid gap-4">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-white/70">Live Signal</p>
                        <p className="text-xl font-semibold">$HDFCBANK</p>
                      </div>
                      <span className="rounded-full bg-emerald-400/20 px-3 py-1 text-xs font-semibold text-emerald-200">
                        Buy
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span>Sentiment meter</span>
                        <span>Accuracy Score: 82%</span>
                      </div>
                      <div className="mt-2 h-2 rounded-full bg-white/10">
                        <div className="h-2 w-[82%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-300" />
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-white/70">
                        Glass Dashboard · $RELIANCE
                      </p>
                      <span className="text-xs text-emerald-200">
                        +1.8% Today
                      </span>
                    </div>
                    <div className="mt-4 h-32 w-full rounded-2xl bg-[#0A1128]/60 p-3">
                      <svg viewBox="0 0 220 80" className="h-full w-full">
                        <defs>
                          <linearGradient
                            id="candles"
                            x1="0"
                            x2="1"
                            y1="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#fbbf24" />
                            <stop offset="100%" stopColor="#34d399" />
                          </linearGradient>
                        </defs>
                        <rect
                          x="10"
                          y="24"
                          width="10"
                          height="32"
                          fill="url(#candles)"
                          rx="2"
                        />
                        <rect
                          x="30"
                          y="18"
                          width="10"
                          height="40"
                          fill="#34d399"
                          rx="2"
                        />
                        <rect
                          x="50"
                          y="30"
                          width="10"
                          height="26"
                          fill="#f59e0b"
                          rx="2"
                        />
                        <rect
                          x="70"
                          y="14"
                          width="10"
                          height="46"
                          fill="#34d399"
                          rx="2"
                        />
                        <rect
                          x="90"
                          y="26"
                          width="10"
                          height="34"
                          fill="#fbbf24"
                          rx="2"
                        />
                        <rect
                          x="110"
                          y="20"
                          width="10"
                          height="38"
                          fill="#34d399"
                          rx="2"
                        />
                        <rect
                          x="130"
                          y="28"
                          width="10"
                          height="30"
                          fill="#f59e0b"
                          rx="2"
                        />
                        <polyline
                          points="10,50 30,44 50,48 70,38 90,42 110,36 130,40 150,32 170,30 190,24 210,20"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                The Sandbox Hero
              </p>
              <h2 className="text-2xl font-semibold">Try the AI logic live.</h2>
              <p className="text-white/70">
                Gen Z doesn’t want hype. They want proof. Search any ticker and
                watch the logic stack light up.
              </p>
              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <label className="text-xs uppercase tracking-[0.25em] text-white/50">
                  Search the markets
                </label>
                <input
                  value={ticker}
                  onChange={(event) => setTicker(event.target.value)}
                  placeholder="Search $TATASTEEL, $ZOMATO, or $NIFTY..."
                  className="w-full rounded-xl border border-white/10 bg-[#0A1128]/60 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-300/40"
                />
                <div className="flex items-center gap-3 text-xs text-white/60">
                  <span className="inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                  Aura&apos;s Outlook: Bullish (80% Confidence).
                </div>
              </div>
              {showLogic && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-300/40 bg-emerald-300/10 px-4 py-3 text-xs text-emerald-100">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                  </span>
                  Crunching RSI · MACD · Twitter Sentiment
                </div>
              )}
            </div>
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Live signal
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold">$HDFCBANK</p>
                    <p className="text-sm text-white/60">
                      Buy sentiment · Momentum building
                    </p>
                  </div>
                  <span className="rounded-full bg-amber-400/20 px-3 py-1 text-xs font-semibold text-amber-200">
                    82% Accuracy
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10">
                  <div className="h-2 w-[74%] rounded-full bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-300" />
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  Trading hours
                </p>
                <p className="mt-3 text-lg font-semibold">
                  Market opens in 4h 20m.
                </p>
                <p className="text-sm text-white/60">
                  Get your morning pre-set before the bell.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Market Heatmap
                </p>
                <h2 className="text-3xl font-semibold">
                  See the Sensex pulse live.
                </h2>
              </div>
              <p className="text-sm text-white/60">
                Sector-level sentiment, instantly.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2">
              <div className="h-[520px] w-full">
                <TradingViewWidget />
              </div>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                  Receipts
                </p>
                <h2 className="text-3xl font-semibold">No Tips. Just Math.</h2>
              </div>
              <p className="text-sm text-white/60">
                Transparent track record, even the misses.
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/50">
                  <tr>
                    <th className="px-6 py-4">Stock</th>
                    <th className="px-6 py-4">Signal</th>
                    <th className="px-6 py-4">Accuracy</th>
                    <th className="px-6 py-4">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {predictions.map((row) => (
                    <tr
                      key={row.stock}
                      className="border-t border-white/10 text-white/80"
                    >
                      <td className="px-6 py-4 font-semibold text-white">
                        {row.stock}
                      </td>
                      <td className="px-6 py-4">{row.signal}</td>
                      <td className="px-6 py-4">{row.accuracy}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            row.result === "Miss"
                              ? "bg-rose-400/20 text-rose-200"
                              : "bg-emerald-400/20 text-emerald-200"
                          }`}
                        >
                          {row.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">
                Localization
              </p>
              <h2 className="text-2xl font-semibold">
                Built for Bharat&apos;s rhythm.
              </h2>
              <p className="text-white/70">
                From demat-ready insights to SIP-friendly cues, Market Crunch AI
                keeps your portfolio in sync with Indian market hours.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">
                  Aura insight: “Hold the base until Nifty breaks 19,900.”
                </p>
                <p className="text-xs text-white/60">
                  AI counsel that feels local, data that stays global.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold">
                  Alpha for your Demat
                </p>
                <p className="text-xs text-white/60">
                  Crisp signals your broker app can digest in seconds.
                </p>
              </div>
            </div>
          </section>

          <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50">
            <p>© 2024 Market Crunch AI India. SEBI Compliance ready.</p>
            <p>Risk Disclaimer: Markets involve risk. Past performance ≠ future.</p>
          </footer>
        </main>
      </div>
    </div>
  );
}
