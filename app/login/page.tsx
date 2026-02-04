"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

const isSafeRedirect = (path: string | null) =>
  Boolean(path && path.startsWith("/"));

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const redirectTo = isSafeRedirect(searchParams.get("redirectedFrom"))
    ? searchParams.get("redirectedFrom")!
    : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let isMounted = true;
    const checkSession = async () => {
      const { data } = await supabase.auth.getUser();
      if (isMounted && data.user) {
        router.replace(redirectTo);
      }
    };
    checkSession();
    return () => {
      isMounted = false;
    };
  }, [redirectTo, router, supabase]);

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.replace(redirectTo);
  };

  const handleSignUp = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email || !password) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    setIsLoading(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setSuccessMessage(
      "Check your inbox to confirm your email, then sign in.",
    );
  };

  return (
    <div className="min-h-screen bg-[#0A1128] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-xl items-center px-6 py-16">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/40 backdrop-blur">
          <h1 className="text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-sm text-white/70">
            Sign in or create an account to continue.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
            <div>
              <label className="text-sm text-white/70" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0A1128] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div>
              <label className="text-sm text-white/70" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="mt-2 w-full rounded-xl border border-white/10 bg-[#0A1128] px-4 py-3 text-sm text-white outline-none transition focus:border-amber-300"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {(errorMessage || successMessage) && (
              <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
                {errorMessage && (
                  <p className="text-amber-200">{errorMessage}</p>
                )}
                {successMessage && (
                  <p className="text-emerald-200">{successMessage}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-[#0A1128] shadow-lg shadow-amber-500/20 transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-between text-sm text-white/60">
            <span>New here?</span>
            <button
              type="button"
              onClick={handleSignUp}
              disabled={isLoading}
              className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? "Creating..." : "Create account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
