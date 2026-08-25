# Quest Dental Products — website

Full-stack site for Quest Dental Products: SteriFast device catalog, services,
Google + email sign-in, and a WhatsApp/email/quote-request contact flow.

## Stack
- Client: React + Vite + Tailwind CSS (black and white theme)
- Server: Node.js + Express
- Database: MongoDB (via Mongoose)
- Auth: Google Sign-In (@react-oauth/google + google-auth-library) and email/password (JWT)

## Setup

### 1. Server
```
cd server
cp .env.example .env    # fill in MONGODB_URI, JWT_SECRET, GOOGLE_CLIENT_ID, ADMIN_KEY
npm install
npm run seed             # loads sample products/services into MongoDB
npm run dev               # starts on http://localhost:5000
```

### 2. Client
```
cd client
cp .env.example .env.local   # fill in VITE_API_URL, VITE_GOOGLE_CLIENT_ID, VITE_WHATSAPP_NUMBER, VITE_CONTACT_EMAIL
npm install
npm run dev                    # starts on http://localhost:5173
```

## Google Sign-In setup
1. Go to Google Cloud Console → APIs & Services → Credentials.
2. Create an OAuth 2.0 Client ID (type: Web application).
3. Add `http://localhost:5173` to Authorized JavaScript origins (and your
   production domain later).
4. Use the same Client ID in both `server/.env` (GOOGLE_CLIENT_ID) and
   `client/.env.local` (VITE_GOOGLE_CLIENT_ID).

## MongoDB setup
1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Get the connection string and put it in `server/.env` as MONGODB_URI.
3. Run `npm run seed` from `server/` once to load sample products/services.

## WhatsApp and email contact
Set `VITE_WHATSAPP_NUMBER` (with country code, no + or spaces, e.g. 919999999999)
and `VITE_CONTACT_EMAIL` in `client/.env.local` — these power the WhatsApp and
email links in the footer and Contact page.

## Admin access to quote requests
`GET /api/quotes` and `PATCH /api/quotes/:id` are protected by a shared header
`x-admin-key` matching `ADMIN_KEY` in `server/.env`. There's no admin UI yet —
this is set up so an admin dashboard can be added later without changing the API.

## Folder structure
```
quest-dental-website/
├── client/    React frontend
└── server/    Express + MongoDB API
```
