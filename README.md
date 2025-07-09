# hey-bunny

## AI Content Generator App

HeyBunny is a modern AI-powered content generator built with Next.js, featuring:
- User analytics & dashboard for product insights
- A/B testing for feature validation
- Custom ML/NLP keyword extraction
- Clean, humanized code and architecture

---

## 🏗️ Architecture Overview

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Next.js API routes, Drizzle ORM (Postgres)
- **Auth:** Clerk
- **Analytics:** Custom event logging (logins, caption generation, post publishing)
- **A/B Testing:** Simple group assignment (localStorage)
- **ML/NLP:** JS-based keyword extraction using [compromise](https://github.com/spencermountain/compromise)
- **ML Training Placeholder:** See `ml_training/README.md` for custom model work

---

## 📊 Analytics & Dashboard
- All key user actions are logged to a simple analytics table.
- View product insights at `/dashboard/analytics` (logins, captions, posts by day).

## 🧪 A/B Testing
- Users are randomly assigned to group A or B on first login.
- Each group sees a different welcome message and button on the dashboard.
- All group assignments and button clicks are logged for analysis.

## 🤖 ML/NLP Features
- After generating a caption, HeyBunny extracts and displays top keywords using the open-source `compromise` library.
- Placeholder for custom ML model training in `ml_training/`.

---

## 🚀 Getting Started

First, run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

---

## 🛠️ Deployment

- **Local:**
  - Requires Node.js, Postgres, and environment variables (see `.env.example` if present)
  - `npm install && npm run dev`
- **Production:**
  - Deploy on [Vercel](https://vercel.com/) or your preferred platform
  - Set up environment variables and database connection

---

## 📂 Feature Highlights
- Analytics, A/B testing, and ML/NLP are implemented simply and can be extended easily.
- See `ml_training/README.md` for how to add your own ML scripts or notebooks.

---

*For questions or contributions, open an issue or PR!*
