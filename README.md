# 🛡️ AI Trust Checker

**Know what AI tools do with your data — in plain English, no legal speak.**

A free, open-source web app that helps everyday people understand the privacy practices of popular AI tools without having to read a 40-page legal document.

🔗 **Live:** [ai-trust-checker.vercel.app](https://ai-trust-checker.vercel.app)

---

## The Problem

Most people use AI tools every day without knowing whether their conversations are being sold, used to train models, or shared with advertisers. Privacy policies are written by lawyers for lawyers. AI Trust Checker translates them into something a human can actually act on.

---

## Features

### 📋 Directory
A hand-researched database of **50 popular AI tools** — ChatGPT, Gemini, Midjourney, Claude, Grammarly, Character.ai, DeepSeek, Meta AI, and more.

Each tool is scored across four dimensions (1–5):
- **Privacy Protection** — how well they protect your personal data
- **Data Use** — how ethically they use the data they collect
- **Transparency** — how clearly they explain their practices
- **Product Quality** — how good the tool actually is at its job

Every tool gets a **verdict** (Safe / Caution / Avoid) and a set of plain-English flags. Click any card for a full breakdown including a written explanation of the verdict and all findings.

Filter by category (Chat, Writing, Image, Video, Voice, Productivity) or by verdict.

### 🔍 Look Up a Tool
Paste any AI tool's URL — even ones not in the directory. The app fetches the page, strips the HTML, and uses Claude AI to generate a trust card on the spot.

### 📄 Policy Analyzer
Paste any privacy policy text (up to 8,000 characters) and get back:
- A **0–100 privacy score**
- A **one-sentence plain-English verdict**
- **Colour-coded findings** — red for serious concerns, yellow for moderate, green for positives

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS v3 |
| API (local dev) | Express.js |
| API (production) | Vercel Serverless Functions |
| AI model | Anthropic Claude Haiku (`claude-haiku-4-5-20251001`) |
| Deployment | Vercel |

---

## Privacy

The app practises what it preaches:

- ❌ No user accounts or login required
- ❌ No cookies or tracking scripts
- ❌ No data stored — inputs are processed in real time and immediately discarded
- ❌ No ads, no data selling
- ✅ Fully open source — read every line of code

When you analyse a policy or look up a URL, the text is sent to Anthropic's API and immediately discarded. [Anthropic's privacy policy](https://www.anthropic.com/privacy) governs that processing.

---

## Running Locally

### Prerequisites
- Node.js 18+
- An [Anthropic API key](https://console.anthropic.com)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/sangami2/Ai-Trust-Checker.git
cd Ai-Trust-Checker

# 2. Install dependencies
npm install

# 3. Add your API key
cp .env.example .env
# Open .env and set ANTHROPIC_API_KEY=your_key_here

# 4. Start the dev server
npm run dev
```

This runs:
- **Vite** on `http://localhost:5173` (frontend)
- **Express** on `http://localhost:3001` (API)

Vite proxies `/api/*` requests to Express automatically.

---

## Deploying to Vercel

1. Push the repo to GitHub
2. Import the repo at [vercel.com](https://vercel.com)
3. In Vercel → Project → Settings → Environment Variables, add:
   ```
   ANTHROPIC_API_KEY=your_key_here
   ```
4. Deploy — `vercel.json` handles everything automatically

The `/api` directory is auto-detected by Vercel as serverless functions.

---

## Project Structure

```
├── api/
│   ├── analyze.js        # POST /api/analyze — policy text → Claude analysis
│   └── lookup.js         # POST /api/lookup  — URL → fetch page → Claude analysis
├── public/
│   └── shield.svg        # Favicon
├── src/
│   ├── components/
│   │   ├── Directory.jsx       # Tool grid with filters
│   │   ├── FilterBar.jsx       # Category + verdict filter pills
│   │   ├── Footer.jsx          # Privacy statement + links
│   │   ├── Logo.jsx            # SVG shield logo component
│   │   ├── PolicyAnalyzer.jsx  # Paste policy → analysis UI
│   │   ├── ToolCard.jsx        # Individual tool card
│   │   ├── ToolLookup.jsx      # URL input → generated card
│   │   └── ToolModal.jsx       # Full-detail modal on card click
│   ├── data/
│   │   └── tools.json          # 50 researched AI tools
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── server.js             # Express wrapper for local dev
├── vercel.json           # Vercel deployment config
└── .env.example
```

---

## The Directory — Research Notes

Scores are not AI-generated. Each tool was researched based on its public privacy policy, documented data practices, and known incidents. A few notable verdicts:

| Tool | Verdict | Key reason |
|---|---|---|
| Claude | ✅ Safe | No training on conversations by default, no ads |
| Adobe Firefly | ✅ Safe | Trained on licensed content only, no training on user uploads |
| DeepSeek | 🔴 Avoid | Chinese company — data subject to government access under Chinese law |
| Meta AI | 🔴 Avoid | Conversations linked to Facebook/Instagram ad profile |
| Replika | 🔴 Avoid | History of selling user data; targets emotionally vulnerable users |
| Midjourney | 🔴 Avoid | All images public by default; no opt-out from training use |
| Grammarly | 🟡 Caution | Reads everything you type across all sites |
| Character.ai | 🔴 Avoid | All chats used for training; popular with teenagers |

---

## Contributing

Spotted an outdated score or missing tool? Open an issue or PR — the data lives in [`src/data/tools.json`](src/data/tools.json) and is easy to update.

---

## Built By

**Akash Sangami** — [LinkedIn](https://www.linkedin.com/in/akashsangami) · [sangami.akash@gmail.com](mailto:sangami.akash@gmail.com)

---

## License

MIT — free to use, fork, and build on.
