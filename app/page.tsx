"use client";

import { memo, useEffect, useRef, useState } from "react";
import { 
  HiSparkles, 
  HiTrendingUp, 
  HiChartBar, 
  HiLightningBolt,
  HiShieldCheck,
  HiClock,
  HiSearch,
  HiChevronRight,
  HiCheckCircle,
  HiXCircle,
  HiCurrencyRupee,
  HiGlobe,
  HiChip,
  HiEye,
  HiPlay,
  HiLockClosed,
  HiX
} from "react-icons/hi";
import { 
  HiArrowTrendingUp, 
  HiArrowTrendingDown,
  HiBolt,
  HiStar,
  HiRocketLaunch,
  HiCpuChip,
  HiSignal,
  HiPresentationChartLine
} from "react-icons/hi2";
import { BiLineChart, BiTargetLock } from "react-icons/bi";
import { RiStockLine, RiPulseLine } from "react-icons/ri";
import { IoAnalytics, IoFlash } from "react-icons/io5";
import { TbBrandTwitter, TbChartCandle, TbMathFunction } from "react-icons/tb";

const predictions = [
  { stock: "$RELIANCE", signal: "Bullish", accuracy: "86%", result: "Hit" },
  { stock: "$HDFCBANK", signal: "Bearish", accuracy: "79%", result: "Hit" },
  { stock: "$INFY", signal: "Bullish", accuracy: "83%", result: "Miss" },
  { stock: "$TCS", signal: "Bullish", accuracy: "88%", result: "Hit" },
  { stock: "$ITC", signal: "Neutral", accuracy: "72%", result: "Hit" },
];

const features = [
  {
    icon: HiCpuChip,
    title: "AI-Powered Analysis",
    description: "Deep learning models trained on 10+ years of NSE data",
    color: "text-amber-400",
    bgColor: "bg-amber-400/10",
  },
  {
    icon: IoAnalytics,
    title: "Real-Time Signals",
    description: "Live market signals updated every 5 minutes",
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/10",
  },
  {
    icon: BiTargetLock,
    title: "80% Accuracy",
    description: "Backtested predictions with transparent track record",
    color: "text-sky-400",
    bgColor: "bg-sky-400/10",
  },
  {
    icon: HiShieldCheck,
    title: "SEBI Compliant",
    description: "Following all regulatory guidelines for market analysis",
    color: "text-purple-400",
    bgColor: "bg-purple-400/10",
  },
];

const stats = [
  { value: "80%+", label: "Accuracy Rate", icon: BiTargetLock },
  { value: "50K+", label: "Predictions Made", icon: RiStockLine },
  { value: "10K+", label: "Active Traders", icon: HiTrendingUp },
  { value: "24/7", label: "Market Coverage", icon: HiGlobe },
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
  const [mounted, setMounted] = useState(false);
  const [showSignInPrompt, setShowSignInPrompt] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!ticker) return;
    setShowLogic(true);
    const timer = setTimeout(() => setShowLogic(false), 2000);
    return () => clearTimeout(timer);
  }, [ticker]);

  const handleInputFocus = () => {
    setShowSignInPrompt(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Show sign-in prompt instead of allowing input
    setShowSignInPrompt(true);
    // Optionally clear any typed value
    setTicker("");
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-amber-500/20 blur-[200px] animate-float" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-emerald-500/20 blur-[200px] animate-float delay-500" />
        <div className="absolute left-1/3 bottom-0 h-96 w-96 rounded-full bg-sky-500/15 blur-[200px] animate-float delay-300" />
        <div className="absolute right-1/4 top-0 h-64 w-64 rounded-full bg-purple-500/10 blur-[150px] animate-float delay-700" />
      </div>

      <main className="relative mx-auto flex w-full max-w-7xl flex-col gap-24 px-6 py-8 md:px-10 lg:px-16">
        
        {/* Header */}
        <header className={`flex flex-wrap items-center justify-between gap-4 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-400/20 backdrop-blur-xl border border-white/20">
                <HiSparkles className="h-7 w-7 text-amber-300 animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-white/60 flex items-center gap-2">
                <RiPulseLine className="h-4 w-4 text-emerald-400 animate-pulse" />
                Market Crunch AI
              </p>
              <p className="text-xl font-bold bg-gradient-to-r from-white via-amber-200 to-emerald-200 bg-clip-text text-transparent">
                Premium Bharat-Tech
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-widest text-emerald-300 hover-scale cursor-default">
              <HiCheckCircle className="h-4 w-4" />
              Verified by Backtesting
            </span>
            <span className="flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs uppercase tracking-widest text-amber-300 hover-scale cursor-default">
              <HiShieldCheck className="h-4 w-4" />
              SEBI Compliant
            </span>
          </div>
        </header>

        {/* Hero Section */}
        <section className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className={`space-y-8 ${mounted ? 'animate-fade-in-left' : 'opacity-0'}`}>
            <div className="inline-flex items-center gap-3 text-sm text-white/70 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span>Alpha for your Demat</span>
              <span className="text-white/30">|</span>
              <span>Level up your SIP</span>
            </div>
            
            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              <span className="block">Predict the</span>
              <span className="block bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent animate-gradient">
                Nifty Pulse.
              </span>
            </h1>
            
            <p className="max-w-xl text-xl text-white/70 leading-relaxed">
              <span className="text-amber-300 font-semibold">80% Accuracy</span> for the Modern Indian Trader. 
              AI-powered insights layered with real market signals.
            </p>
            
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                onClick={() => window.location.href = "/login"} 
                className="group relative cursor-pointer rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 px-8 py-4 text-base font-bold text-[#0A1128] shadow-2xl shadow-amber-500/30 hover-lift animate-pulse-glow"
              >
                <span className="flex items-center gap-2">
                  <HiRocketLaunch className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  Start Predicting
                  <HiChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </span>
              </button>
              <button className="group flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-4 text-base font-medium text-white backdrop-blur-sm hover:bg-white/10 hover:border-white/30 transition-all">
                <HiPlay className="h-5 w-5 text-emerald-400" />
                Watch Demo
              </button>
            </div>
            
            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <div className="flex items-center gap-3 text-sm text-white/60 bg-white/5 rounded-full px-4 py-2 border border-white/10 hover-lift cursor-default">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-400/20">
                  <HiCurrencyRupee className="h-5 w-5 text-emerald-300" />
                </span>
                <span>Wealth Signals</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/60 bg-white/5 rounded-full px-4 py-2 border border-white/10 hover-lift cursor-default">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-400/20">
                  <TbChartCandle className="h-5 w-5 text-amber-300" />
                </span>
                <span>Technical Analysis</span>
              </div>
            </div>
          </div>

          {/* Hero Card */}
          <div className={`relative ${mounted ? 'animate-fade-in-right delay-200' : 'opacity-0'}`}>
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-amber-400/20 via-emerald-400/20 to-sky-400/20 blur-3xl animate-pulse" />
            <div className="relative rounded-3xl border border-white/20 bg-white/10 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl hover-lift">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/60 mb-6">
                <span className="flex items-center gap-2">
                  <HiSignal className="h-4 w-4 text-emerald-400 animate-pulse" />
                  Market Pulse
                </span>
                <span className="flex items-center gap-2 text-amber-300">
                  <RiStockLine className="h-4 w-4" />
                  $NIFTY50
                </span>
              </div>
              
              <div className="space-y-4">
                {/* Live Signal Card */}
                <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 to-transparent p-5 hover-lift">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-400/20">
                        <HiArrowTrendingUp className="h-6 w-6 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm text-white/70">Live Signal</p>
                        <p className="text-xl font-bold">$HDFCBANK</p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-400/20 px-4 py-2 text-sm font-bold text-emerald-300">
                      <HiBolt className="h-4 w-4" />
                      Buy
                    </span>
                  </div>
                  <div className="mt-5">
                    <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                      <span className="flex items-center gap-1">
                        <HiEye className="h-4 w-4" />
                        Sentiment Meter
                      </span>
                      <span className="text-emerald-300 font-semibold">82% Accuracy</span>
                    </div>
                    <div className="h-3 rounded-full bg-white/10 overflow-hidden">
                      <div className="h-3 w-[82%] rounded-full bg-gradient-to-r from-emerald-400 to-amber-300 animate-shimmer" />
                    </div>
                  </div>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover-scale cursor-default">
                    <HiArrowTrendingUp className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-emerald-300">+2.4%</p>
                    <p className="text-xs text-white/50">Today</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover-scale cursor-default">
                    <BiLineChart className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-amber-300">+8.7%</p>
                    <p className="text-xs text-white/50">Week</p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-center hover-scale cursor-default">
                    <HiChartBar className="h-5 w-5 text-sky-400 mx-auto mb-1" />
                    <p className="text-lg font-bold text-sky-300">+15.2%</p>
                    <p className="text-xs text-white/50">Month</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className={`${mounted ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div 
                key={stat.label} 
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover-lift cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-400/10 to-emerald-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <stat.icon className="h-8 w-8 text-amber-400 mb-3" />
                <p className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-white/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className={`space-y-12 ${mounted ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
          <div className="text-center space-y-4">
            <p className="text-xs uppercase tracking-[0.4em] text-amber-400 flex items-center justify-center gap-2">
              <HiLightningBolt className="h-4 w-4" />
              Why Choose Us
            </p>
            <h2 className="text-4xl font-bold">
              Powered by <span className="gradient-text">Next-Gen AI</span>
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              Our AI models analyze thousands of data points in real-time to give you the edge in the Indian stock market.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover-lift cursor-default"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-white/60">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sandbox Section */}
        <section className={`rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 md:p-10 backdrop-blur-xl ${mounted ? 'animate-fade-in-up delay-500' : 'opacity-0'}`}>
          <div className="grid gap-10 md:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-amber-400 bg-amber-400/10 rounded-full px-4 py-2">
                <HiPlay className="h-4 w-4" />
                The Sandbox Hero
              </div>
              <h2 className="text-3xl font-bold">Try the AI logic live.</h2>
              <p className="text-white/70 text-lg">
                Gen Z doesn&apos;t want hype. They want proof. Search any ticker and watch the logic stack light up.
              </p>
              
              <div className="relative space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                <label className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-white/50">
                  <HiSearch className="h-4 w-4" />
                  Search the markets
                </label>
                <div className="relative">
                  <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/40" />
                  <input
                    value={ticker}
                    onChange={handleInputChange}
                    onFocus={handleInputFocus}
                    placeholder="Search $TATASTEEL, $ZOMATO, or $NIFTY..."
                    className="w-full rounded-xl border border-white/10 bg-[#0A1128]/60 pl-12 pr-4 py-4 text-base text-white placeholder:text-white/40 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/40 transition-all cursor-pointer"
                  />
                  <HiLockClosed className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-amber-400/60" />
                </div>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                  </span>
                  <span>Aura&apos;s Outlook: <span className="text-emerald-300 font-semibold">Bullish (80% Confidence)</span></span>
                </div>
              </div>
              
              {/* Sign In Prompt Overlay */}
              {showSignInPrompt && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up">
                  <div className="relative w-full max-w-md rounded-3xl border border-white/20 bg-[#0A1128]/95 p-8 shadow-2xl backdrop-blur-xl animate-scale-in">
                    {/* Close Button */}
                    <button 
                      onClick={() => setShowSignInPrompt(false)}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                    >
                      <HiX className="h-5 w-5 text-white/60" />
                    </button>
                    
                    {/* Lock Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 to-emerald-400 blur-xl opacity-50" />
                        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/20 to-emerald-400/20 border border-white/20">
                          <HiLockClosed className="h-10 w-10 text-amber-400" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="text-center space-y-4">
                      <h3 className="text-2xl font-bold">Sign In Required</h3>
                      <p className="text-white/70">
                        Unlock AI-powered market predictions and real-time signals. Sign in to access the full power of Market Crunch AI.
                      </p>
                      
                      {/* Features List */}
                      <div className="flex flex-col gap-3 py-4 text-left">
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          <HiCheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          <span>Real-time stock predictions with 80%+ accuracy</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          <HiCheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          <span>AI-powered sentiment analysis</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-white/80">
                          <HiCheckCircle className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                          <span>Personalized trading insights</span>
                        </div>
                      </div>
                      
                      {/* CTA Buttons */}
                      <div className="flex flex-col gap-3 pt-2">
                        <button 
                          onClick={() => window.location.href = "/login"}
                          className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 px-6 py-4 text-base font-bold text-[#0A1128] shadow-lg shadow-amber-500/30 hover-lift"
                        >
                          <HiRocketLaunch className="h-5 w-5" />
                          Sign In to Continue
                        </button>
                        <button 
                          onClick={() => setShowSignInPrompt(false)}
                          className="w-full rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 hover:bg-white/10 transition-colors"
                        >
                          Maybe Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {showLogic && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/40 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-100 animate-fade-in-up">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-70" />
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                  </span>
                  <span className="flex items-center gap-3">
                    <TbMathFunction className="h-4 w-4" />
                    Crunching RSI
                    <IoFlash className="h-4 w-4 text-amber-400" />
                    MACD
                    <TbBrandTwitter className="h-4 w-4 text-sky-400" />
                    Twitter Sentiment
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover-lift">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
                  <HiSignal className="h-4 w-4 text-emerald-400" />
                  Live Signal
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/20">
                      <HiArrowTrendingUp className="h-6 w-6 text-amber-400" />
                    </div>
                    <div>
                      <p className="text-xl font-bold">$HDFCBANK</p>
                      <p className="text-sm text-white/60">Buy sentiment active</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-amber-400/20 px-4 py-2 text-sm font-bold text-amber-300">
                    82% Accuracy
                  </span>
                </div>
                <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-2 w-[74%] rounded-full bg-gradient-to-r from-amber-400 via-orange-300 to-emerald-300 animate-shimmer" />
                </div>
              </div>
              
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 hover-lift">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-white/50 mb-4">
                  <HiClock className="h-4 w-4 text-sky-400" />
                  Trading Hours
                </div>
                <p className="text-2xl font-bold flex items-center gap-2">
                  <span className="text-emerald-300">Market opens in</span>
                  <span className="bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text text-transparent">4h 20m</span>
                </p>
                <p className="text-sm text-white/60 mt-2">
                  Get your morning pre-set before the bell.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Market Heatmap Section */}
        <section className={`space-y-8 ${mounted ? 'animate-fade-in-up delay-600' : 'opacity-0'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-emerald-400">
                <HiPresentationChartLine className="h-4 w-4" />
                Market Heatmap
              </p>
              <h2 className="text-4xl font-bold">
                See the <span className="gradient-text">Sensex pulse</span> live.
              </h2>
            </div>
            <p className="flex items-center gap-2 text-sm text-white/60 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <HiEye className="h-4 w-4 text-emerald-400" />
              Sector-level sentiment, instantly.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 animated-border">
            <div className="h-[520px] w-full rounded-2xl overflow-hidden">
              <TradingViewWidget />
            </div>
          </div>
        </section>

        {/* Track Record Section */}
        <section className={`space-y-8 ${mounted ? 'animate-fade-in-up delay-700' : 'opacity-0'}`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-amber-400">
                <HiStar className="h-4 w-4" />
                Receipts
              </p>
              <h2 className="text-4xl font-bold">No Tips. Just Math.</h2>
            </div>
            <p className="flex items-center gap-2 text-sm text-white/60 bg-white/5 rounded-full px-4 py-2 border border-white/10">
              <HiCheckCircle className="h-4 w-4 text-emerald-400" />
              Transparent track record, even the misses.
            </p>
          </div>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-white/50">
                <tr>
                  <th className="px-6 py-5 flex items-center gap-2">
                    <RiStockLine className="h-4 w-4" />
                    Stock
                  </th>
                  <th className="px-6 py-5">Signal</th>
                  <th className="px-6 py-5">Accuracy</th>
                  <th className="px-6 py-5">Result</th>
                </tr>
              </thead>
              <tbody>
                {predictions.map((row, index) => (
                  <tr
                    key={row.stock}
                    className="border-t border-white/10 text-white/80 hover:bg-white/5 transition-colors"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="px-6 py-5 font-bold text-white flex items-center gap-2">
                      {row.signal === "Bullish" ? (
                        <HiArrowTrendingUp className="h-4 w-4 text-emerald-400" />
                      ) : row.signal === "Bearish" ? (
                        <HiArrowTrendingDown className="h-4 w-4 text-rose-400" />
                      ) : (
                        <BiLineChart className="h-4 w-4 text-amber-400" />
                      )}
                      {row.stock}
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1 ${
                        row.signal === "Bullish" ? "text-emerald-300" : 
                        row.signal === "Bearish" ? "text-rose-300" : "text-amber-300"
                      }`}>
                        {row.signal}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sky-300">{row.accuracy}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold ${
                          row.result === "Miss"
                            ? "bg-rose-400/20 text-rose-300"
                            : "bg-emerald-400/20 text-emerald-300"
                        }`}
                      >
                        {row.result === "Miss" ? (
                          <HiXCircle className="h-4 w-4" />
                        ) : (
                          <HiCheckCircle className="h-4 w-4" />
                        )}
                        {row.result}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Localization Section */}
        <section className={`grid gap-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-8 md:p-10 backdrop-blur-xl md:grid-cols-2 ${mounted ? 'animate-fade-in-up delay-800' : 'opacity-0'}`}>
          <div className="space-y-6">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-sky-400 bg-sky-400/10 rounded-full px-4 py-2">
              <HiGlobe className="h-4 w-4" />
              Localization
            </p>
            <h2 className="text-3xl font-bold">
              Built for <span className="gradient-text">Bharat&apos;s rhythm</span>.
            </h2>
            <p className="text-white/70 text-lg">
              From demat-ready insights to SIP-friendly cues, Market Crunch AI keeps your portfolio in sync with Indian market hours.
            </p>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20">
                  <HiChip className="h-5 w-5 text-amber-400" />
                </div>
                <p className="text-base font-bold">Aura Insight</p>
              </div>
              <p className="text-white/70">
                &quot;Hold the base until Nifty breaks 19,900.&quot;
              </p>
              <p className="text-xs text-white/50 mt-2">
                AI counsel that feels local, data that stays global.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover-lift">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/20">
                  <HiCurrencyRupee className="h-5 w-5 text-emerald-400" />
                </div>
                <p className="text-base font-bold">Alpha for your Demat</p>
              </div>
              <p className="text-white/70">
                Crisp signals your broker app can digest in seconds.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={`relative rounded-3xl overflow-hidden ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-emerald-500/20" />
          <div className="absolute inset-0 backdrop-blur-3xl" />
          <div className="relative p-10 md:p-16 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to predict the <span className="gradient-text">future</span>?
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Join thousands of Indian traders who trust Market Crunch AI for their daily market insights.
            </p>
            <button 
              onClick={() => window.location.href = "/login"} 
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 px-10 py-5 text-lg font-bold text-[#0A1128] shadow-2xl shadow-amber-500/30 hover-lift animate-pulse-glow"
            >
              <HiRocketLaunch className="h-6 w-6" />
              Get Started Free
              <HiChevronRight className="h-6 w-6 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-10 text-sm text-white/50">
          <div className="flex items-center gap-3">
            <HiSparkles className="h-5 w-5 text-amber-400" />
            <p>© 2024 Market Crunch AI India. SEBI Compliance ready.</p>
          </div>
          <p className="flex items-center gap-2">
            <HiShieldCheck className="h-4 w-4 text-emerald-400" />
            Risk Disclaimer: Markets involve risk. Past performance ≠ future.
          </p>
        </footer>
      </main>
    </div>
  );
}
