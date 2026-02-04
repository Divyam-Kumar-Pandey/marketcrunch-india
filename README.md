# MarketCrunch India

AI-powered Indian stock analysis and report generation. MarketCrunch India fetches public fundamentals from Screener.in, runs a Gemini-powered evaluation, and delivers a detailed prediction report for NSE/BSE-listed stocks. It includes Supabase authentication and a credit system to control report generation.

## Features

- Search by stock code and generate a fundamentals-based report
- Gemini-backed prediction engine with structured outputs
- Supabase auth for sign-in and gated access
- Credit system (default 10 credits, 1 credit per report)
- Report history with quick access to recent predictions

## Tech Stack

- Next.js 16 (App Router) + React 19
- Tailwind CSS + MUI
- Prisma + PostgreSQL
- Supabase Auth (SSR + browser clients)
- Google Gemini API (`@google/genai`)
- Cheerio for Screener.in data extraction

## Routes

- `/` marketing landing page
- `/login` email/password authentication
- `/search` generate new reports and view recent predictions
- `/reports/[stockCode]` view a report for a stock code

## API Endpoints

- `POST /api/v1/generate` generate a new report (auth + credits required)
- `GET /api/v1/predictions` fetch recent reports

## Environment Variables

Create a `.env` file with the following:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
GEMINI_API_KEY=your_google_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=your_supabase_anon_key
```

## Setup

```bash
npm install
npx prisma migrate dev
npm run dev
```

Open `http://localhost:3000`.

## Scripts

- `npm run dev` start the dev server
- `npm run build` build for production
- `npm start` run the production server
- `npm run lint` run ESLint
- `npm run prisma:generate` generate Prisma client

## Notes

- The analysis is a mathematical projection based on public fundamentals, not financial advice.
- Screener.in content can change; if scraping fails, verify stock codes and availability.

## License

MIT
