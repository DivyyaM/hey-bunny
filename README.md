# HeyBunny 🐰

HeyBunny is a modern, human-friendly AI content generator. It’s built with Next.js and React, and showcases real in-browser ML/NLP features for content creators, marketers, and anyone who wants to level up their social media game.

---

## What’s Inside?

- **Analytics Dashboard:**
  - Tracks logins, caption generations, and post publishing.
  - See daily activity and feature usage at `/dashboard/analytics`.

- **A/B Testing:**
  - Each user is randomly assigned to group A or B.
  - Dashboard UI and features adapt based on group, so you can experiment and learn what works best.

- **ML/NLP Features (All In-Browser):**
  - **Keyword Extraction:** Classic (compromise) and transformer-based (BERT) keyword/entity extraction.
  - **Caption Rewriting:** Instantly rewrite captions in different styles (Casual, SEO, Professional).
  - **Engagement Prediction:** Predicts if a caption will have low, medium, or high engagement.
  - **Tagging & Emoji Generation:** Assigns tags and emojis based on caption content.
  - **Sentiment Analysis:** See if your caption is positive, negative, or neutral.
  - **Semantic Search:** Find related captions by meaning, not just keywords.
  - **Multi-Label & Zero-Shot Classification:** Assigns multiple tags, or lets you define your own categories.
  - **Summarization & Toxicity Detection:** Summarize captions and check for safe content.

- **Model Playground:**
  - Try out and compare different ML models side-by-side at `/dashboard/playground`.

- **Feedback Loop:**
  - Thumbs up/down for captions and rewrites, with persistent feedback stats.

---

## Getting Started

```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deployment
- **Local:** Node.js required. Run `npm install && npm run dev`.
- **Production:** Deploy on [Vercel](https://vercel.com/) or your favorite platform. Set up environment variables and database connection as needed.

---

## How it Works
- All ML/NLP runs in the browser—no backend Python or API calls required.
- Code is clean, well-commented, and easy to extend.
- UI is friendly and clear, with no “AI demo” or vague outputs.

---

## Want to extend or contribute?
- Fork the repo, open an issue, or submit a PR. All feedback and ideas are welcome!

---

*Built by a human, for humans. Enjoy creating with HeyBunny!*
