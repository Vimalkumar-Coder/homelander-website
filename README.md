# Protector Broadcast

Protector Broadcast is a fictional fan-made parody propaganda site inspired by
Homelander from The Boys universe. It uses a React and Tailwind CSS frontend,
an Express submission API, and Supabase storage for the two civic registry
forms.

## Folder structure

```text
.
|-- api/
|   `-- index.js                 # Vercel Express function entry
|-- public/
|   `-- assets/
|       `-- homelander-hero.png  # Generated cinematic hero asset
|-- server/
|   |-- app.js                   # Express API routes and error handling
|   |-- app.test.js              # API validation tests
|   |-- local.js                 # Local Express listener
|   |-- submissions.js           # Supabase table inserts
|   |-- supabase.js              # Backend-only Supabase client
|   `-- validation.js            # Zod schemas
|-- src/
|   |-- App.jsx                  # Cinematic React experience and forms
|   |-- index.css                # Tailwind import and custom motion styling
|   `-- main.jsx
|-- supabase/
|   `-- schema.sql               # Table creation SQL
|-- .env.example
|-- index.html
|-- package.json
|-- vercel.json
`-- vite.config.js
```

## Install and run

```bash
npm install
npm run dev
```

The Vite frontend runs on its printed local URL and proxies `/api` to the local
Express server on port `8787`.

Run verification commands with:

```bash
npm test
npm run build
```

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor.
3. Copy `.env.example` to `.env`.
4. Set `SUPABASE_URL` and the backend-only `SUPABASE_SECRET_KEY`.

The frontend does not need a Supabase key. Browser submissions go to Express,
and Express writes to these tables:

- `church_members`
- `citizen_complaints`

Older Supabase projects can use `SUPABASE_SERVICE_ROLE_KEY` as a server-only
fallback because the Express client checks it when `SUPABASE_SECRET_KEY` is not
set.

## API routes

### `POST /api/church-members`

```json
{
  "fullName": "Jane Citizen",
  "email": "jane@example.com",
  "country": "United States",
  "loyaltyMessage": "I stand ready for the next broadcast."
}
```

### `POST /api/citizen-complaints`

```json
{
  "fullName": "John Witness",
  "email": "john@example.com",
  "location": "Brooklyn, New York",
  "complaintDescription": "A hostile drone crossed the avenue and endangered the morning commute."
}
```

Both routes validate body fields before the Supabase insert and return field
errors with HTTP `422` when a submission is incomplete.

## Vercel deployment

1. Push the project to a Git repository and import it into Vercel, or run the
   Vercel CLI from the repository root.
2. Keep the build command as `npm run build` and output directory as `dist`.
3. Add `SUPABASE_URL` and `SUPABASE_SECRET_KEY` to the Vercel project
   environment variables.
4. Deploy. `vercel.json` sends `/api/*` requests to the Express function in
   `api/index.js` and sends other deep links back to the React app.

For a CLI preview deployment:

```bash
vercel
```

For a production deployment:

```bash
vercel --prod
```

