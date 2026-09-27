# 🤖 TIGER MARKET JARVIS INTELLIGENCE COMMAND CENTER

AI-powered social media intelligence system for Tiger Market. Built as a JARVIS-style command center with cinematic sci-fi UI.

## 🎯 Overview

This is NOT a generic SaaS dashboard. It's a custom-built JARVIS intelligence system for social media research, trend detection, and content strategy.

### Core Capabilities

- **Trend Discovery**: Research 8 platforms (TikTok, YouTube, Instagram, Reddit, X/Twitter, Google Trends, Roblox, News)
- **Intelligent Content Ideas**: Generate 3-5 high-quality daily content ideas using Z.ai GLM-4.7-Flash
- **Brand Comment Radar**: Visual radar interface for viral video opportunities
- **Competitor Intelligence**: Analyze competitors and extract winning patterns
- **Performance Analytics**: Buffer API sync + manual entry
- **What Works Learning**: Evidence-based insights from user feedback

## 🏗️ Architecture

### Tech Stack

- **Backend**: Node.js + TypeScript + Express
- **Database**: PostgreSQL with Prisma ORM
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **AI**: Z.ai GLM-4.7-Flash for TikTok research (NOT Gemini)
- **Research Providers**: Modular architecture with 8 providers

### Project Structure

```
tiger-market-jarvis/
├── src/
│   ├── server/
│   │   ├── index.ts              # Express server with all API routes
│   │   ├── aiService.ts          # Z.ai GLM-4.7-Flash integration
│   │   ├── tiktokService.ts      # TikTok Research API integration
│   │   ├── researchProvider.ts   # Base provider interface
│   │   └── providers/
│   │       ├── tiktokProvider.ts
│   │       ├── youtubeProvider.ts
│   │       ├── instagramProvider.ts
│   │       ├── redditProvider.ts
│   │       ├── xProvider.ts
│   │       ├── googleTrendsProvider.ts
│   │       ├── robloxProvider.ts
│   │       └── newsProvider.ts
│   └── client/
│       └── src/
│           ├── App.tsx           # Main JARVIS UI
│           ├── main.tsx          # Entry point
│           └── index.css         # Sci-fi styling
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Sample data
├── Dockerfile                    # Production build
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── .env                          # Environment variables
```

## 🚀 Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL
- Z.ai API Key (for AI research)

### Setup

1. **Clone and install dependencies**:
```bash
npm install
```

2. **Configure environment**:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
- `DATABASE_URL`: PostgreSQL connection string
- `ZAI_API_KEY`: Z.ai GLM-4.7-Flash API key
- `TIKTOK_API_KEY`: TikTok Research API key (optional)
- `BUFFER_CLIENT_ID`: Buffer API credentials (optional)

3. **Set up database**:
```bash
npx prisma migrate dev
```

4. **Seed database with sample data**:
```bash
npx prisma seed
```

5. **Start development server**:
```bash
npm run dev
```

6. **Build for production**:
```bash
npm run build
```

## 🎨 JARVIS UI Design

The UI follows the reference.jpg design:

### Layout

**LEFT PANEL** - Performance intelligence
- Follower counts
- Views/engagement stats
- Recent performance metrics
- Learning indicators

**CENTER PANEL** - JARVIS Core
- Large circular intelligence interface
- Animated radar sweep
- Live system status
- Current strongest signal

**RIGHT PANEL** - Current intelligence
- Trending topics
- Exploding trends
- Important alerts
- Recent discoveries

**LOWER AREA** - Detailed intelligence
- Top 3 content recommendations
- Trend strength metrics
- Growth indicators
- Tiger Market relevance

### Design Language

- **Colors**: Deep black (#020617) with cyan (#00f0ff) glow effects
- **Typography**: Monospace font for technical feel
- **Borders**: Sci-fi corner brackets and glowing edges
- **Animations**: Radar sweeps, pulses, and HUD scanning effects
- **Panels**: Floating glass panels with backdrop blur

## 🤖 AI Integration

### Z.ai GLM-4.7-Flash

Used for all TikTok/social-media research intelligence:
- Trend analysis
- Content idea generation
- Brand comment suggestions
- Competitor analysis
- Learning insights

### Architecture

```typescript
AIResearchService
├── researchTikTokTrends(keywords)
├── generateBrandComments(video, context)
├── analyzeCompetitors(accounts)
└── generateWhatWorksInsights(feedback, category)
```

## 🔍 Research Providers

Modular provider architecture allows independent research sources:

| Provider | Platform | Status |
|----------|----------|--------|
| TikTokResearchProvider | TikTok | ✅ Implemented |
| YouTubeResearchProvider | YouTube | ⚠️ Placeholder |
| InstagramResearchProvider | Instagram | ⚠️ Placeholder |
| RedditResearchProvider | Reddit | ⚠️ Placeholder |
| XResearchProvider | X/Twitter | ⚠️ Placeholder |
| GoogleTrendsProvider | Google Trends | ⚠️ Placeholder |
| RobloxResearchProvider | Roblox | ⚠️ Placeholder |
| NewsResearchProvider | News | ⚠️ Placeholder |

*To enable a provider, add API credentials to `.env`*

## 📊 Database Schema

### Core Entities

- **Trend**: Current trending topics, sounds, formats
- **ContentIdea**: Daily content recommendations
- **BrandCommentOpportunity**: Viral video detection
- **Competitor**: Monitored accounts for inspiration
- **UserIdea**: User-submitted ideas with AI improvements
- **WhatWorksInsight**: Evidence-based insights
- **BufferAnalytics**: Performance tracking

## 🔒 Security

- Environment variables for all secrets
- API keys never exposed in frontend
- No automatic publishing capabilities
- Proper CORS and authentication ready

## 🚢 Deployment (Render)

1. **Prepare production build**:
```bash
npm run build
```

2. **Deploy to Render**:
   - Push to GitHub
   - Render automatically builds and deploys

3. **Environment variables in Render**:
```
DATABASE_URL=postgresql://...
ZAI_API_KEY=your_key
TIKTOK_API_KEY=your_key
BUFFER_CLIENT_ID=your_id
BUFFER_CLIENT_SECRET=your_secret
BUFFER_ACCESS_TOKEN=your_token
```

## 📱 Features

### 11 Intelligence Modules

1. **Dashboard** - Main JARVIS interface with 3-column layout
2. **Daily Ideas** - Curated content ideas with German descriptions
3. **Trends Radar** - Real-time trend detection across platforms
4. **Brand Comment Radar** - Visual radar for viral opportunities
5. **Competitors** - Inspiration account monitoring
6. **My Ideas** - User idea submission with AI enhancement
7. **Content Calendar** - Schedule planned content
8. **Analytics** - TikTok performance tracking
9. **What Works** - Evidence-based learning
10. **Categories** - Content format classification
11. **Settings** - System configuration

### Key Features

- ✅ No automatic publishing (you control everything)
- ✅ Real research (no fake data)
- ✅ Multiple platform support
- ✅ Z.ai GLM-4.7-Flash for AI intelligence
- ✅ Modular research providers
- ✅ PostgreSQL database
- ✅ JARVIS-style sci-fi UI
- ✅ Responsive design
- ✅ Push notifications (14:00 daily ideas)

## 📝 API Endpoints

All endpoints under `/api/v1/`

| Endpoint | Description |
|----------|-------------|
| `/dashboard` | Main dashboard stats |
| `/trends` | List all trends |
| `/trends/top10` | Top 10 trends |
| `/content/daily` | Daily content ideas |
| `/content/:id/status` | Update idea status |
| `/brand-comment/opportunities` | Viral opportunities |
| `/brand-comment/:id/rate` | Rate comment suggestions |
| `/competitors` | Competitor list |
| `/competitors` (POST) | Add competitor |
| `/my-ideas` | User ideas |
| `/calendar` | Scheduled content |
| `/analytics` | Performance data |
| `/analytics/manual` | Manual entry |
| `/what-works` | Insights |
| `/categories` | Content categories |
| `/tiktok/research/videos` | Search TikTok videos |
| `/tiktok/research/comments` | Get TikTok comments |

## 🎯 Usage Workflow

1. **Daily Check (14:00)**: Get notified of 3 new content ideas
2. **Review Ideas**: Browse and approve/reject
3. **Explore Trends**: See what's trending across platforms
4. **Brand Opportunities**: Find viral videos with comment opportunities
5. **Analyze Competitors**: Learn from top accounts
6. **Schedule Content**: Add approved ideas to calendar
7. **Track Performance**: Sync Buffer or manual entry
8. **Learn Patterns**: See what works from feedback

## 📄 License

Private project for Tiger Market.

---

Built with ❤️ by JARVIS Intelligence System
