# DrippyBanks

Next.js 16 app for the DrippyBanks site.

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- Firebase
- Radix UI + shadcn/ui

## Getting Started
1. Install deps
   - `npm install`
2. Run the dev server
   - `npm run dev`
3. Open `http://localhost:3000`

## Scripts
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Environment Variables
This project uses environment variables stored in `.env`. Make sure required values are set before running locally.

For server-side error monitoring, set `LOGIX_API_KEY`. The app reports unhandled
request errors to Logix at `LOGIX_ENDPOINT` (defaulting to
`https://api.chefu.co.za`). Keep this key server-only; do not prefix it with
`NEXT_PUBLIC_`.

Server-side code can use `lib/logix.ts` for every Logix track:

```ts
import { logixAudit, logixDebug, logixError, logixInfo, logixMetric, logixSuccess, logixWarning } from '@/lib/logix';

logixInfo('Catalog loaded');
logixWarning('Payment retry started');
logixError('Payment failed');
logixDebug('Checkout payload validated');
logixAudit('Admin updated a product');
logixMetric('Checkout latency measured', { metrics: { durationMs: 240 } });
logixSuccess('Order created');
```

Do not import this helper into client components. Browser events must be sent
through a protected server endpoint so `LOGIX_API_KEY` is never exposed.

## Project Structure
- `app/` - Next.js App Router routes and layouts
- `components/` - shared UI components
- `lib/` - utilities and helpers
- `public/` - static assets
- `config/` - project configuration

## Notes
- If you add new dependencies or environment keys, update this README.
