import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/middleware";

// Add path prefixes that should require authentication.
const PROTECTED_PATH_PREFIXES = ["/reports", "/search"];
const LOGIN_PATH = "/login";

const isProtectedPath = (pathname: string) =>
  PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

export async function proxy(request: NextRequest) {
  if (!isProtectedPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const { supabase, response } = createClient(request);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = LOGIN_PATH;
    redirectUrl.searchParams.set("redirectedFrom", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: ["/reports/:path*", "/search", "/login"],
};
