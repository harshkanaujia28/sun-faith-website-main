# Sun Faith Energy Solutions — Resend Backend

Express backend for the existing Vite/TanStack Router website enquiry form.

## Install

```bash
npm install
```

## Environment

Copy `.env.example` to `.env` and fill in the Resend API key and verified sender.

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL=website@sunfaithenergy.in
RESEND_FROM_NAME=Sun Faith Energy Solutions
CONTACT_TO_EMAIL=sunfaithenergysolutions@gmail.com
```

Do NOT put `RESEND_API_KEY` in the frontend.

## Run

```bash
npm run dev
```

Health:
`GET http://localhost:5000/api/health`

Contact:
`POST http://localhost:5000/api/contact`

## Frontend environment

In the Vite frontend `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Production:

```env
VITE_API_URL=https://api.yourdomain.com
```

Then POST the form to:

```text
${VITE_API_URL}/api/contact
```

## Security included

Helmet, strict CORS, request-size limit, rate limiting, server-side Zod validation, HTML escaping, honeypot spam protection, and server-only Resend API key.
