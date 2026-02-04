import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";

export const runtime = "nodejs";

type Company = {
  name: string;
  code: string;
};

let cachedCompanies: Company[] | null = null;

async function loadCompanies(): Promise<Company[]> {
  if (cachedCompanies) return cachedCompanies;

  const filePath = path.join(
    process.cwd(),
    "app",
    "api",
    "v1",
    "companies",
    "companies.json"
  );
  const raw = await readFile(filePath, "utf8");
  const parsed = JSON.parse(raw) as unknown;

  if (!Array.isArray(parsed)) {
    cachedCompanies = [];
    return cachedCompanies;
  }

  cachedCompanies = parsed
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const maybe = item as Partial<Company>;
      if (typeof maybe.name !== "string" || typeof maybe.code !== "string") return null;
      return { name: maybe.name, code: maybe.code };
    })
    .filter((x): x is Company => Boolean(x));

  return cachedCompanies;
}

function compactUpper(value: string) {
  return value.toUpperCase().replace(/\s+/g, "");
}

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q")?.trim() ?? "";
    if (!q) {
      return NextResponse.json({ success: true, data: [], error: null });
    }

    const companies = await loadCompanies();
    const qUpper = q.toUpperCase();
    const qCompact = compactUpper(q);

    const scored: Array<{ score: number; company: Company }> = [];

    for (const company of companies) {
      const codeUpper = company.code.toUpperCase();
      const nameUpper = company.name.toUpperCase();

      const codeStarts = codeUpper.startsWith(qUpper);
      const codeIncludes = codeUpper.includes(qUpper);
      const nameStarts = nameUpper.startsWith(qUpper);
      const nameIncludes = nameUpper.includes(qUpper);

      // Also allow matching against a compacted query (helps with "I O C" style names/codes).
      const codeCompactIncludes = compactUpper(codeUpper).includes(qCompact);
      const nameCompactIncludes = compactUpper(nameUpper).includes(qCompact);

      const matches =
        codeStarts ||
        codeIncludes ||
        nameStarts ||
        nameIncludes ||
        codeCompactIncludes ||
        nameCompactIncludes;

      if (!matches) continue;

      // Lower score is better.
      const score = codeStarts
        ? 0
        : codeIncludes
          ? 1
          : nameStarts
            ? 2
            : 3;

      scored.push({ score, company });
    }

    scored.sort((a, b) => {
      if (a.score !== b.score) return a.score - b.score;
      // Tie-breaker: prefer shorter codes, then alphabetical.
      const codeLen = a.company.code.length - b.company.code.length;
      if (codeLen !== 0) return codeLen;
      return a.company.code.localeCompare(b.company.code);
    });

    const data = scored.slice(0, 15).map((x) => x.company);

    return NextResponse.json({ success: true, data, error: null });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, data: null, error: error?.message ?? "Failed to search companies." },
      { status: 500 }
    );
  }
}

