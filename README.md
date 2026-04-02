# Filmatic

Filmatic is a cinematic movie social app built with React, Tailwind CSS, Firebase, Vercel, and TMDb.

## Features

- Trending movies from TMDb
- Movie search and detail pages
- Firebase Auth for sign up, login, and logout
- Firestore-backed reviews
- User profiles and follows
- Feed from followed users

## Tech Stack

- React
- Tailwind CSS
- Firebase Auth
- Firestore
- TMDb API
- Vite

## Getting Started

1. Install dependencies:

	```bash
	npm install
	```

2. Create a `.env.local` file in the project root.

3. Add your TMDb API key:

	```env
	VITE_TMDB_API_KEY=your_tmdb_key_here
	```

4. Start the development server:

	```bash
	npm run dev
	```

## Environment Variables

Required for movie data:

- `VITE_TMDB_API_KEY`

Optional for future social features:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

## Scripts

- `npm run dev` - start the local dev server
- `npm run build` - create a production build
- `npm run preview` - preview the production build

## Notes

- The app is configured to fall back to local preview content when TMDb is unavailable.
- Firebase features stay hidden until Firebase credentials are added.