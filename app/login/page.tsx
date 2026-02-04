import { Suspense } from "react";

import LoginClient from "@/app/login/LoginClient";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0A1128] text-white">
          <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-16">
            <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="h-6 w-40 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-4 w-64 animate-pulse rounded bg-white/10" />
              <div className="mt-8 space-y-5">
                <div className="h-11 w-full animate-pulse rounded-xl bg-white/10" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-white/10" />
                <div className="h-11 w-full animate-pulse rounded-xl bg-white/10" />
              </div>
            </div>
          </div>
        </div>
      }
    >
      <LoginClient />
    </Suspense>
  );
}
