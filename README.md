# 🌙 Baby Sleep Trainer

A playful and light-hearted one-page app for tracking baby sleep training sessions. Features a beautiful timer with start, pause, and reset functionality, all wrapped in a fun and mobile-responsive design.

## Features

- ⏱️ Timer with start, pause, and reset controls
- 📱 Fully mobile responsive
- 🎨 Playful and light-hearted design
- 🌈 Beautiful gradient backgrounds
- 💤 Sleep-themed visuals and messages

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Build for Production

```bash
npm run build
npm start
```

## Deployment to Webflow Cloud

This app is built with Next.js and is ready to be deployed to Webflow Cloud. 

### Prerequisites

1. Make sure you're authenticated with Webflow:
   ```bash
   webflow auth login
   ```
   (This will open a browser for authentication)

2. Initialize the project (if not already done):
   ```bash
   webflow cloud init --project-name "baby-sleep-trainer" --framework "nextjs" --site-id "YOUR_SITE_ID" --mount "/app"
   ```

### Deploy

Once authenticated and initialized:

```bash
npm run build
webflow cloud deploy
```

Or deploy with specific options:
```bash
webflow cloud deploy --environment production --auto-publish
```

### Environment Variables

Make sure your `.env.local` file contains:
- `OPENAI_API_KEY` - Your OpenAI API key for generating inspirational messages

Note: The `.env.local` file should not be committed to git. For production deployment, set environment variables in your Webflow Cloud project settings.

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling and responsive design
- **React Hooks** - State management

## License

MIT

