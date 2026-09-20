# Tiger Market AI Social Media Intelligence System - Implementation Plan

## 1. Project Overview
Building a web-based AI-powered social media intelligence dashboard for Tiger Market that:
- Discovers trends across multiple platforms (TikTok, YouTube, Instagram, Reddit, X, Google Trends)
- Generates exactly 3 high-quality daily content ideas (5-6 during major trends)
- Features Brand Comment Radar to find natural brand commenting opportunities
- Tracks competitor/inspiration accounts
- Learns from user feedback and performance data
- Provides browser push notifications for daily reports and alerts
- Runs automated research cycle daily at 14:00
- Presents JARVIS-style futuristic UI

## 2. Architecture & Tech Stack Decisions

### 2.1 Overall Architecture
**Monolithic Full-Stack Application** with separation of concerns:
- **Backend**: Node.js (Express) with TypeScript
- **Frontend**: React + TypeScript + Tailwind CSS
- **Database**: PostgreSQL (with Prisma ORM) for relational data + Redis for caching
- **AI/LLM Integration**: Anthropic API via OpenRouter (configured in environment)
- **Scheduling**: node-cron for daily research at 14:00
- **Real-time Features**: Socket.IO for live updates (optional, can start with polling)
- **Browser Push Notifications**: Service Workers + Push API
- **Web Scraping/APIs**: Mix of official APIs and responsible scraping with rate limiting
- **Deployment**: Docker containerizable for easy deployment

### 2.2 Rationale for Tech Choices
- **Node.js Backend**: 
  - Excellent for I/O-heavy operations (API calls, web scraping)
  - Rich ecosystem for web servers, scheduling, and real-time features
  - TypeScript provides type safety across frontend/backend boundary
  - Matches user's available skills and environment
  
- **React Frontend**:
  - Component-based architecture fits dashboard nature
  - Tailwind CSS enables rapid UI development with dark/JARVIS theme
  - Ecosystem includes libraries for charts, notifications, calendars
  - Can be PWA-ready for push notifications
  
- **PostgreSQL + Prisma**:
  - Robust relational storage for trends, ideas, competitors, feedback
  - Prisma provides type-safe database access
  - JSONB fields for flexible storage of API responses
  - Redis for caching API responses and rate limiting
  
- **Anthropic via OpenRouter**:
  - Already configured in environment (ANTHROPIC_API_KEY, OPENROUTER_API_KEY)
  - Access to latest Claude models for trend analysis and content generation
  - Cost-effective through OpenRouter routing
  
- **node-cron**:
  - Simple, reliable scheduling for daily 14:00 research
  - Can handle ad-hoc background checks for trend alerts
  
- **Service Workers**:
  - Standards-based approach for browser push notifications
  - Works across modern browsers
  - No external push service needed for basic implementation

### 2.3 What We're NOT Building (Yet)
- Micro-services architecture (overkill for initial version)
- Complex ML model training (using LLM via API instead)
- Real-time WebSocket dashboard updates (can start with polling)
- Native mobile apps (web-first approach)
- Enterprise auth/oAuth2 (simple session-based auth to start)

## 3. Core Components & Modules

### 3.1 Backend Modules (`src/server/`)
- `research/` - Trend discovery and analysis engines
- `content/` - Content idea generation and formatting
- `brandComment/` - Brand Comment Radar logic
- `competitor/` - Competitor tracking and analysis
- `learning/` - Feedback system and performance analysis
- `scheduler/` - Daily research jobs and background monitoring
- `notifications/` - Push notification handling
- `analytics/` - Buffer API integration and manual entry
- `api/` - REST API routes for frontend
- `middleware/` - Auth, rate limiting, logging
- `utils/` - HTTP clients, data processors, helpers
- `models/` - Prisma data models and migrations

### 3.2 Frontend Modules (`src/client/`)
- `components/` - Reusable UI components (cards, charts, modals)
- `pages/` - Dashboard views (Dashboard, DailyIdeas, Trends, etc.)
- `hooks/` - Custom React hooks for data fetching
- `services/` - API service layer
- `store/` - State management (Zustand or Context API)
- `styles/` - Tailwind configuration and custom CSS
- `utils/` - Date formatters, text helpers, etc.
- `notifications/` - Service worker and push notification logic
- `assets/` - Icons, logos, placeholder images

### 3.3 Shared Types (`src/shared/`)
- TypeScript interfaces for trends, content ideas, comments, etc.
- API request/response types
- Database model types
- Notification payload types

## 4. Data Models & Storage

### 4.1 Database Schema (Prisma)
```prisma
model Trend {
  id            String   @id @default(cuid())
  name          String
  type          String   // sound, meme, format, challenge, etc.
  status        String   // EXPLODING, RISING, ACTIVE, ESTABLISHED, DECLINING, DEAD
  platform      String   // tiktok, youtube, instagram, etc.
  growthSignal  Float    // 0-1 score
  viralityScore Float    // 0-1 score
  tigerRelevance Float   // 0-1 score
  competitionLevel Float // 0-1 score
  estimatedAge  Int      // hours
  expectedLifespan Int   // hours
  whyTrending   String
  currentUsage  String
  exampleVideos Json[]   // [{platform, url, views, likes}]
  soundLink     String?
  sourceLinks   Json[]   // [{platform, url}]
  detectedAt    DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model ContentIdea {
  id            String   @id @default(cuid())
  title         String
  contentType   String   // Meme, Promotion, Trend, etc.
  advertising   String   // Low, Medium, High
  trendScore    Int      // 0-100
  virality      Int      // 0-100
  tigerRelevance Int     // 0-100
  difficulty    String   // Easy, Medium, Hard
  duration      String   // e.g., "12-15 seconds"
  descriptionDe String   // German description
  whyNowDe      String   // German why it works now
  howToMakeDe   String   // German instructions
  onScreenConcept String // English
  captionEn     String   // English caption
  hashtagsEn    String   // English hashtags
  soundLink     String?
  inspirationLinks Json[] // [{description, url}]
  status        String   // NEW, APPROVED, REJECTED, POSTED, ARCHIVED
  trendId       String?  @relation("TrendIdea", fields: [trendId], references: [id])
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Competitor {
  id            String   @id @default(cuid())
  username      String
  platform      String
  displayName   String?
  bio           String?
  followerCount Int?
  isApproved    Boolean  @default(false)
  isPaused      Boolean  @default(false)
  discoveredAt  DateTime
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model BrandCommentOpportunity {
  id            String   @id @default(cuid())
  videoUrl      String
  platform      String
  title         String?
  description   String?
  viewCount     Int?
  likeCount     Int?
  commentCount  Int?
  shareCount    Int?
  brandAccounts Json[]   // [{username, platform, comment}]
  suggestedComments Json[] // [{text, style, rating}]
  detectedAt    DateTime
  createdAt     DateTime @default(now())
}

model UserFeedback {
  id            String   @id @default(cuid())
  type          String   // IDEA, COMMENT, TREND, CATEGORY, COMPETITOR
  entityId      String   // references the thing being feedback on
  entityType    String   // matches type
  action        String   // APPROVED, REJECTED, RATED (1-5), etc.
  notes         String?
  createdAt     DateTime @default(now())
}

model ContentCategory {
  id            String   @id @default(cuid())
  name          String   // e.g., "Fake Corporate Ads"
  description   String
  examples      Json[]
  tigerPotential String
  isApproved    Boolean  @default(false)
  discoveredAt  DateTime
  createdAt     DateTime @default(now())
}

model ScheduledContent {
  id            String   @id @default(cuid())
  contentIdeaId String   @relation("ScheduledIdea", fields: [contentIdeaId], references: [id])
  scheduledFor  DateTime
  postedAt      DateTime?
  platform      String?  // where it was posted (if applicable)
  status        String   // PLANNED, POSTED, SKIPPED
  createdAt     DateTime @default(now())
}

model BufferAnalytics {
  id            String   @id @default(cuid())
  platform      String   // tiktok
  postId        String
  views         Int?
  likes         Int?
  comments      Int?
  shares        Int?
  saves         Int?
  followersGained Int?
  watchTime     Int?     // seconds
  completionRate Float?   // 0-1
  postedAt      DateTime
  syncedAt      DateTime @default(now())
}
```

### 4.2 Redis Usage
- Cache API responses (Google Trends, platform APIs) with TTL
- Rate limiting counters per IP/API endpoint
- Temporary storage for background research jobs
- Pub/Sub for real-time updates (if implementing WebSockets)

## 5. API Endpoints & Services

### 5.1 REST API Routes (`/api/v1/`)
- **GET** `/health` - Health check
- **GET** `/trends` - Get trends with filtering (status, platform, limit)
- **GET** `/trends/:id` - Get specific trend
- **POST** `/research/daily` - Trigger manual daily research (admin)
- **GET** `/content/daily` - Get today's content ideas
- **GET** `/content` - Get content ideas with filtering
- **POST** `/content/:id/approve` - Approve an idea
- **POST** `/content/:id/reject` - Reject an idea
- **POST** `/content/:id/posted` - Mark as posted
- **GET** `/brand-comment/opportunities` - Get brand comment opportunities
- **POST** `/brand-comment/:id/rate` - Rate a suggested comment (👍/👎)
- **GET** `/competitors` - Get monitored competitor accounts
- **POST** `/competitors` - Add new competitor (requires approval)
- **DELETE** `/competitors/:id` - Remove competitor
- **GET** `/my-ideas` - Get user-submitted ideas
- **POST** `/my-ideas` - Submit new user idea
- **GET** `/calendar` - Get content calendar
- **POST** `/calendar` - Schedule content for posting
- **GET** `/analytics` - Get Buffer analytics
- **POST** `/analytics/sync` - Trigger manual Buffer sync
- **POST** `/analytics/manual` - Add manual analytics entry
- **GET** `/what-works` - Get learned insights
- **GET** `/categories` - Get content categories
- **POST** `/categories/approve` - Approve discovered category
- **POST** `/categories/reject` - Reject discovered category
- **GET** `/settings` - Get user settings
- **POST** `/settings` - Update user settings

### 5.2 Background Services
- **Daily Research Job**: Runs at 14:00 daily via node-cron
  - Fetches trends from all sources
  - Analyzes and scores trends
  - Generates 3 content ideas
  - Updates database
  - Sends browser notification when complete
  
- **Trend Monitoring Job**: Runs every 30 minutes
  - Checks for sudden trend explosions
  - Sends instant alerts if threshold passed
  
- **Buffer Sync Job**: Runs every 6 hours
  - Syncs performance data from Buffer API
  
- **Competitor Monitoring Job**: Runs daily
  - Checks approved competitors for high-performing posts
  
- **Learning Analysis Job**: Runs weekly
  - Analyzes user feedback and performance data
  - Updates "What Works" insights

## 6. Frontend Features & UI/UX

### 6.1 Overall Design (JARVIS/Futuristic)
- **Theme**: Very dark background (#0a0a0a or #000000)
- **Accent Colors**: Electric blue/cyan (#00ffff, #00bfff, #1e90ff)
- **Glow Effects**: CSS box-shadow and text-shadow for holographic feel
- **Circular/Radar Elements**: CSS borders, canvas, or SVG for radar sweeps
- **Data Visualizations**: Animated counters, progress bars, trend graphs
- **Typography**: Monospace or futuristic font for headers, clean sans-serif for body
- **Transitions**: Smooth fades, slides, and pulsating effects for active elements

### 6.2 Dashboard View (`/`)
- **Header**: Tiger Market logo (text), current time, status indicators
- **Today's Ideas Card**: Shows 3 content ideas with quick actions (approve/reject)
- **Trend Radar**: Circular visualization showing active trends by status
- **Brand Comment Alert**: Prominent alert if new brand commenting opportunity
- **Quick Stats**: Trends discovered today, ideas generated, notifications sent
- **Recent Activity**: Feed of latest trends, competitor moves, user actions
- **Navigation Sidebar**: Access to all sections

### 6.3 Daily Ideas View (`/daily`)
- **Today's Ideas**: Detailed view of the 3 generated ideas
  - Each idea in expandable card with all fields (title, scores, description, etc.)
  - Action buttons: Approve, Reject, Posted, Save to Calendar
  - "Regenerate Ideas" button (if user wants different options)
- **Trend Context**: Shows which trends influenced each idea
- **History**: View past days' ideas with their statuses
- **Export**: Option to download ideas as JSON/CSV

### 6.4 Trends View (`/trends`)
- **Filter Controls**: Platform, status, date range, sort by
- **Trend List/Card View**: Each trend shows:
  - Name, type, platform
  - Status badge (🔥 EXPLODING, 🟢 RISING, etc.)
  - Scores (virality, tiger relevance, competition)
  - Estimated age and expected lifespan
  - Why it's trending + current usage examples
  - Example videos (thumbnail grid)
  - Sound link (if applicable)
  - Source links
- **Trend Detail Modal**: Full-screen view with deeper analysis
- **Discover New**: Button to manually trigger trend research

### 6.5 Brand Comment Radar View (`/brand-comment`)
- **Two Tabs**: Viral Videos | Viral Videos with Brand Activity
- **Opportunity List**: Each video shows:
  - Thumbnail + title/platform
  - View/like/comment/share counts
  - List of brand accounts commenting
  - Suggested comments (with rating buttons 👍/👎)
  - "Video" button to open in new tab
  - "Copy Comment" button for each suggestion
- **Filters**: Minimum views, brand count, time range
- **Manual Search**: Input to search for specific videos/channels
- **Discovered Brands**: Panel showing newly found brand accounts (await approval)

### 6.6 Competitors View (`/competitors`)
- **List**: Monitored accounts with add/remove/pause controls
- **Each Competitor Shows**:
  - Username, platform, display name
  - Follower count, bio
  - Recent high-performing posts (last 7 days)
  - Engagement rate trend
  - Common content formats/hooks
- **Discovered Accounts**: Panel for newly found accounts (A/R)
- **Add Manual**: Form to add competitor by username/platform
- **Pause Monitoring**: Toggle to temporarily stop checking

### 6.7 My Ideas View (`/my-ideas`)
- **List**: User-submitted ideas with status
- **Each Idea Shows**:
  - Original submission
  - System improvements/suggestions
  - Related trends found
  - Generated variations
  - Approval/rejection history
  - "Use as Basis" button to generate new ideas from it
- **Submit New Idea**: Form at top
- **Learning Insights**: Shows which types of ideas user tends to approve/reject

### 6.8 Content Calendar View (`/calendar`)
- **Views**: Month, Week, Day, Agenda
- **Drag & Drop**: Reschedule content ideas
- **Content Cards**: Show idea title, type, scheduled time
- **Empty Slots**: Ability to manually add content
- **Trend Overlay**: highlights days with detected trends
- **Export**: iCal/Google Calendar export
- **Trend Override Warning**: If scheduling conflicts with major trend

### 6.9 Analytics View (`/analytics`)
- **Buffer Connection**: Status and sync button
- **Metrics Dashboard**: Views, likes, comments, shares, saves, followers
- **Time Series**: Performance over time (last 7/30 days)
- **Top Posts**: Ranking by engagement rate
- **Manual Entry Form**: For platforms not supported by Buffer
- **Correlation Analysis**: Shows which content types perform best (from learning)
- **Export**: CSV/JSON export

### 6.10 What Works View (`/what-works`)
- **Learned Insights**: Statements derived from actual performance data
  - Format: "POV videos under 15s generate 2.3x more reach than direct promotions"
  - Confidence level (based on sample size and p-value)
  - Supporting data points
- **Metric Definitions**: Clear explanations of what's measured
- **Weak Signals**: Clearly marked as preliminary observations
- **Recommendations**: Actionable suggestions based on insights
- **Refresh Button**: Trigger new learning analysis

### 6.11 Categories View (`/categories`)
- **Approved Categories**: List of user-approved content formats
- **Discovered Categories**: Weekly AI-generated suggestions (A/R)
- **Each Category Shows**:
  - Name and description
  - Examples (with links)
  - Tiger Market potential analysis
  - Approval/rejection buttons
  - Usage count (how many ideas used this category)
- **Discover New**: Button to trigger weekly category discovery

### 6.12 Settings View (`/settings`)
- **General**: Timezone, date format, language preferences
- **Notifications**: 
  - Browser push permission toggle
  - Daily report time (default 14:00)
  - Instant alert thresholds
  - Notification sound options
- **Sources**: Enable/disable specific platforms
- **AI Settings**: 
  - Model selection (Sonnet/Opus/Haiku via OpenRouter)
  - Temperature for creativity
  - Max tokens for responses
- **Buffer**: Connection status and re-auth
- **Data**: Export all data, delete account, GDPR controls
- **Appearance**: Theme density, animation intensity

## 7. Research & Trend Discovery Engine

### 7.1 Source Integration Strategy
For each platform, prioritize:
1. **Official APIs** (if available and sufficient)
2. **Public endpoints** (no auth required, stable)
3. **Responsible scraping** (with rate limiting, user-agent rotation, robots.txt respect)
4. **Search engines** (Google/Bing/DuckDuckGo for site-specific searches)
5. **Aggregators** (like Reddit's public JSON, Twitter's nitter instances)

### 7.2 Platform-Specific Approaches

#### TikTok
- **Primary**: TikTok API via RapidAPI or similar (research current availability)
- **Alternative**: TikTok's public share endpoints + oEmbed
- **Fallback**: Google site:tiktok.com search + scraping public profiles
- **Metrics**: Views, likes, comments, shares, saves (if available)
- **Sounds**: Extract sound information from videos

#### YouTube
- **Primary**: YouTube Data API v3 (quota-aware)
- **Alternative**: Invidious instances, oEmbed
- **Fallback**: Google site:youtube.com search
- **Metrics**: Views, likes, comments, shares, watch time (if available)
- **Trending**: YouTube trending API per region

#### Instagram
- **Primary**: Instagram Basic Display API (limited) or Graph API (requires review)
- **Alternative**: Public web scraping (careful with rate limits)
- **Fallback**: Google site:instagram.com search
- **Metrics**: Likes, comments, views (for Reels), saves
- **Note**: Instagram has strict anti-scraping measures

#### Reddit
- **Primary**: Reddit JSON API (no auth needed for public posts)
- **Alternative**: Pushshift.io (if available)
- **Fallback**: Google site:reddit.com search
- **Metrics**: Upvotes, comments, awards
- **Trending**: r/popular, r/all, subreddit-specific

#### X/Twitter
- **Primary**: Twitter API v2 (essential access for recent search)
- **Alternative**: Nitter instances, RSS feeds
- **Fallback**: Google site:twitter.com or site:x.com search
- **Metrics**: Likes, retweets, replies, quote tweets
- **Note**: Twitter API has strict limits; essential track may suffice

#### Google Trends
- **Primary**: Google Trends API (unofficial but stable pytrends or direct endpoints)
- **Alternative**: Google Trends RSS feeds
- **Fallback**: Scraping trends.google.com (careful)
- **Metrics**: Interest over time, related queries, regional interest

#### Roblox-Specific Sources
- **Roblox Developer Forum**: Public sections if available
- **Roblox Blog**: Official announcements
- **Roblox Twitter/X**: @Roblox, @RobloxDev
- **YouTube**: Search for "Roblox tutorial", "Roblox devlog"
- **Reddit**: r/Roblox, r/RobloxDev, r/RobloxGames
- **Twitch**: Roblox category streams

#### Gaming/Tech News
- **Sources**: IGN, Polygon, Kotaku, The Verge, TechCrunch, Ars Technica
- **Method**: RSS feeds + site-specific scraping (respectful)
- **Alternative**: Google News API

### 7.3 Trend Detection Algorithm
For each piece of content collected:
1. **Feature Extraction**:
   - Text: hashtags, captions, titles, audio transcriptions (if available)
   - Visual: objects, scenes, text on screen (basic via cloud vision APIs if budget allows)
   - Audio: music/sound identification (via services like Shazam API or audio fingerprinting)
   - Metadata: upload time, engagement velocity, geographic spread
   
2. **Velocity Calculation**:
   - Engagement rate over time (likes/views per hour)
   - Share velocity
   - Comment velocity
   - Unique user growth rate
   
3. **Clustering**:
   - Group similar content by:
     - Same sound/audio
     - Same hashtag/challenge
     - Same visual template/format
     - Same topic/keywords
     - Same editing style/transition
   
4. **Scoring**:
   - **Virality Score**: Weighted combination of engagement metrics normalized by follower count
   - **Growth Signal**: Rate of increase in virality score over time windows (1h, 6h, 24h)
   - **Tiger Market Relevance**: Keyword matching (Roblox, scripting, building, GFX, etc.) + semantic similarity
   - **Competition Level**: Number of large brands/accounts already using the trend
   - **Expected Lifespan**: Based on historical data of similar trend types
   
5. **Classification**:
   - **NEW**: First detected < 2h ago
   - **RISING**: Strong growth signal (>0.7) and age < 24h
   - **EXPLODING**: Virality > 0.8 and growth signal > 0.8
   - **ACTIVE**: Steady performance, age 1-7 days
   - **ESTABLISHED**: High virality but low growth, age > 7 days
   - **DECLINING**: Negative growth signal for 24h+
   - **DEAD**: Virality < 0.2 for 48h+

### 7.4 Trend Combination Engine
To generate content ideas:
1. Take top trending items from each category (sound, meme, format, topic)
2. Apply combinatorial rules:
   - Sound + Format + Topic = Content Idea
   - Meme + Topic + Tiger Market angle
   - Challenge + Editing Style + Platform-specific twist
3. Score combinations using:
   - Individual component scores
   - Novelty penalty (if seen recently)
   - Tiger Market fit boost
   - Difficulty assessment (production complexity)
4. Generate exactly 3 top-scoring combinations for normal days
5. For exploding trends (virality > 0.9), generate 5-6 ideas focusing on that trend

## 8. Content Idea Generation System

### 8.1 Idea Structure (as specified)
Each generated idea includes:
- **TITLE**: Catchy, concise
- **Content Type**: Meme, Promotion, Trend, Comparison, POV, Ragebait, Community
- **Advertising**: Low/Medium/High (subjective scale)
- **Scores**: Trend Score (0-100), Virality (0-100), Tiger Relevance (0-100)
- **Difficulty**: Easy/Medium/Hard (production complexity)
- **Duration**: Estimated video length
- **Beschreibung**: 1-2 German sentences explaining the concept
- **Warum jetzt**: German explanation of timeliness
- **How to make it**: German practical instructions
- **On-screen concept**: English text that would appear in video
- **Caption**: English caption for post
- **Hashtags**: English hashtags
- **Sound**: Direct link to TikTok sound/page (not just name)
- **Inspiration**: Links to example videos with explanation of what works and how to adapt

### 8.2 Generation Process
1. **Input**: Top trends from research engine (with scores and metadata)
2. **Prompt Engineering**: Construct detailed prompt for LLM including:
   - Current date/time and context
   - List of top trends with their attributes
   - Tiger Market context and audience
   - Content type goals (reach/balanced/conversion)
   - Style guidelines (avoid AI-sounding phrases)
   - Required output format (JSON matching idea structure)
3. **LLM Call**: Anthropic Claude via OpenRouter with:
   - Model: Sonnet (balanced) or Opus (for complex reasoning)
   - Temperature: 0.7-0.8 for creativity with coherence
   - Max tokens: Sufficient for detailed idea (2000-3000)
4. **Output Parsing**: Validate JSON structure, fill missing fields, translate to German/English as needed
5. **Scoring Adjustment**: Apply internal scoring to LLM output for final ranking
6. **Selection**: Pick top 3 ideas (or 5-6 for exploding trends)
7. **Storage**: Save to database with status NEW
8. **Notification**: Trigger "ideas ready" browser notification

### 8.3 Prompt Templates
Different templates for:
- Normal day (3 ideas)
- Exploding trend day (5-6 ideas)
- User idea enhancement
- Combining competitor inspiration
- Category-based ideas

### 8.4 Avoiding AI-Generated Sound
Post-processing steps:
- Remove banned phrases: "revolutionize", "unlock", "seamlessly", "game-changing", etc.
- Add human imperfections: contractions, colloquialisms, intentional typos (if appropriate)
- Vary sentence structure: mix short and long sentences
- Add platform-specific slang and meme references
- Ensure captions feel native to each platform's culture

## 9. Brand Comment Radar Module

### 9.1 Core Purpose
Find videos where Tiger Market can leave a funny, natural brand comment that feels like a real person.

### 9.2 Two Separate Tracks (as specified)
**Track A: Viral Videos**
- High velocity content regardless of brand presence
- Focus: Is this video blowing up? Could we add value with a comment?

**Track B: Viral Videos with Brand Activity**
- Same viral threshold PLUS detectable brand engagement
- Focus: Brands are already playing here, let's join naturally

### 9.3 Detection Algorithm
For each viral video (from trend engine):
1. **Extract Comments**: Get recent comments (last 1-2 hours for fresh videos)
2. **Identify Brand Accounts**:
   - Check against known brand/company lists
   - Look for verification badges
   - Analyze username patterns (contains brand names, official-sounding)
   - Check bio for company descriptions, websites
   - Cross-reference with competitor/discovered brand lists
3. **Brand Engagement Signals**:
   - Count of unique brand accounts commenting
   - Brand-to-brand replies (brand A replying to brand B)
   - Comment velocity from brand accounts
   - Sentiment of brand comments (positive, humorous, engaged)
   - Ratio of brand comments to total comments
4. **Scoring**:
   - **Virality Score**: From trend engine
   - **Brand Activity Score**: Based on signals above
   - **Comment Opportunity Score**: How natural/funny a Tiger Market comment would be
   - **Risk Score**: Potential for negative brand safety issues
5. **Classification**:
   - Track A: High virality, low/medium brand activity
   - Track B: High virality, high brand activity (≥3 unique brands commenting OR brand-to-brand interaction)

### 9.4 Comment Generation
For each opportunity:
1. **Context Analysis**:
   - Video title/description
   - Top comments (what's the conversation about?)
   - Current trend/joke being referenced
   - Video's emotional tone (funny, angry, celebratory, etc.)
   - Brand accounts present and their typical tone
2. **LLM Prompt**: Generate 3-5 comment suggestions that are:
   - Specifically adapted to the video (not generic)
   - In styles: sarcastic, funny, reaction, one-liner, meme, short, playful, observational
   - Length: Twitter/X style (under 280 chars, ideally <100)
   - Avoid: forced product placement, generic praise, off-topic
3. **Style Learning**: Over time, prioritize comment styles that user rates highly (👍)
4. **Output**: Each suggestion includes:
   - Comment text
   - Style classification
   - Reasoning (why it fits the video)
   - Expected reaction (based on similar historical comments)

### 9.5 User Interaction & Learning
- **Rating**: 👍/👎 on each suggested comment
- **Learning**: 
  - Track which styles/user approves
  - Learn preferred humor style (sarcastic vs playful vs observational)
  - Learn acceptable edginess level
  - Learn which types of references work (memes, current events, self-deprecating)
- **Brand Discovery**: 
  - New brand accounts found must be approved before permanent monitoring
  - Show why relevant, content style, typical comment tone
- **Video Interaction**: 
  - Click to open video in new tab
  - "Copy Comment" button for easy use
  - Option to dismiss irrelevant opportunities

## 10. Competitor Intelligence System

### 10.1 Manual Management
- **ADD ACCOUNT**: Form for username/platform
- **REMOVE ACCOUNT**: Delete from monitoring
- **PAUSE MONITORING**: Toggle to temporarily stop checks
- **APPROVE/REJECT DISCOVERED**: For auto-found accounts

### 10.2 Automatic Discovery
- **Sources**: 
  - Hashtag analysis (who's using relevant tags?)
  - Trend participation (who's jumping on emerging trends?)
  - Mention mining (who mentions Tiger Market or competitors?)
  - Look-alike modeling (similar to existing competitors)
  - Platform recommendations ("users who followed X also followed...")
- **Process**: 
  - Run weekly
  - Score accounts on relevance, activity, engagement quality
  - Present top 5 for user approval/rejection
  - Only approved accounts added to permanent monitoring

### 10.3 Analysis Per Approved Account
- **Content Analysis**:
  - Recent posts (last 30 days)
  - Viral outliers (>2x average engagement)
  - Format distribution (what types of content do they post?)
  - Hook analysis (how do they grab attention in first 3 seconds?)
  - Caption patterns (length, tone, hashtag usage, CTA)
  - Posting schedule (times/days of most engagement)
- **Engagement Analysis**:
  - Like-to-view ratio
  - Comment quality (are comments engaging or spammy?)
  - Share rate (indicates content resonance)
  - Follower growth correlation with posts
- **Competitor Insights Extraction**:
  - "What works here": Specific elements driving engagement
  - "How Tiger Market could adapt": Concrete suggestions avoiding direct copy
  - Format-to-opportunity mapping (e.g., "Their Q&A format → Tiger Market could do 'Ask a Dev'")
  - Hook adaptation (e.g., "Their surprised reaction → Tiger Market could use confused dev face")

### 10.4 Integration with Content Generation
- Competitor insights feed into idea generation prompts
- High-performing competitor formats suggested as bases for new ideas
- Brand comment opportunities identified from competitor comment sections

## 11. Learning & Feedback System

### 11.1 Data Collection
- **Explicit Feedback**: 
  - Idea status changes (NEW → APPROVED/REJECTED/POSTED)
  - Comment ratings (👍/👎)
  - Category approvals/rejections
  - Competitor approvals/rejections
  - Trend relevance feedback (if implemented)
- **Implicit Feedback** (if Tiger Market connects via Buffer):
  - Post performance metrics (views, engagement rate, etc.)
  - Correlation with content type, timing, trend usage
- **Manual Entry**: Option to add performance data for non-Buffer posts

### 11.2 Analysis Pipeline
Weekly job that:
1. **Collects Data**: 
   - All posted content with metrics
   - User feedback on ideas/comments/categories
   - Trend performance data
2. **Performs Analysis**:
   - **Content Type Performance**: Average metrics by type (Meme vs Promotion vs etc.)
   - **Timing Analysis**: Best days/times to post
   - **Trend Correlation**: Does using X trend improve performance?
   - **Advertising Level**: Does Low/Medium/High advertising affect reach/conversion?
   - **Duration Impact**: Correlation between video length and completion rate
   - **Comment Style Performance**: Which comment styles get engaged with?
   - **Category Usage**: How do approved categories perform?
   - **Competitor Learning**: Which competitor tactics correlate with success?
3. **Generates Insights**:
   - Only presents findings with statistical significance (p < 0.05)
   - Clearly labels weak signals (p < 0.1 but > 0.05, or small sample size)
   - Distinguishes correlation from causation
   - Provides actionable recommendations
4. **Storage**: 
   - Saves insights to `WhatWorks` table
   - Updates internal weighting for future idea generation
   - Example insight: "POV videos under 15 seconds with Low advertising generate 2.1x more profile visits than direct promotions"

### 11.3 Influence on Recommendations
- **Idea Generation**: 
  - Boost scoring for content types/times that perform well
  - Reduce frequency of consistently underperforming formats
  - Adjust difficulty expectations based on actual production time
- **Comment Generation**: 
  - Prioritize comment styles with high approval rates
  - Learn optimal humor density and edginess
- **Trend Scoring**: 
  - Adjust Tiger Market relevance based on actual performance with similar trends
- **Scheduler**: 
  - Suggest optimal posting times based on historical engagement

## 12. Scheduler & Automation

### 12.1 Daily Research (14:00)
- **Trigger**: node-cron schedule "0 14 * * *"
- **Process**:
  1. Run trend discovery across all enabled sources
  2. Analyze and score new trends
  3. Generate 3 content ideas (or 5-6 if exploding trend detected)
  4. Save ideas to database with status NEW
  5. Send browser notification: "🐯 Today's 3 content ideas are ready."
  6. Update dashboard caches
- **Idempotency**: Safe to run multiple times (uses date-based deduplication)

### 12.2 Background Trend Monitoring
- **Frequency**: Every 30 minutes (cron: "*/30 * * * *")
- **Purpose**: Detect sudden trend explosions between daily reports
- **Alert Threshold**: Only notify if:
  - Virality score > 0.9 AND
  - Growth signal > 0.85 AND
  - Detected within last 3 hours AND
  - Not already alerted for this trend in last 6 hours
- **Notification**: "🔥 New trend detected\nThis trend is exploding right now.\nOpen Tiger Marketing."

### 12.3 Other Scheduled Jobs
- **Buffer Sync**: Every 6 hours (0 */6 * * *)
- **Competitor Check**: Daily at 02:00 (0 2 * * *)
- **Learning Analysis**: Weekly Sundays at 03:00 (0 3 * * 0)
- **Category Discovery**: Weekly Mondays at 04:00 (0 4 * * 1)
- **Data Cleanup**: Daily at 04:00 (archive old trends, compress logs)

### 12.4 Error Handling & Resilience
- **Retry Logic**: Failed API calls retry with exponential backoff
- **Circuit Breaker**: Temporarily disable failing sources
- **Fallback Data**: Use cached data if primary source fails
- **Logging**: Comprehensive error logging to file and console
- **Health Checks**: /api/v1/health endpoint monitors job statuses

## 13. Notification System

### 13.1 Browser Push Notifications
- **Permission Flow**: 
  - On first visit, prompt for notification permission (explained)
  - Respect user's choice; don't reprompt unless blocked/denied
- **Service Worker**: 
  - Registers on first visit
  - Handles push events and displays notifications
  - Caches static assets for offline capability (basic)
- **Notification Types**:
  - **Daily Ready**: "🐯 Today's 3 content ideas are ready." (14:00)
  - **Trend Alert**: "🔥 New trend detected\nThis trend is exploding right now." (threshold-based)
  - **Comment Opportunity**: "💬 New brand commenting opportunity" (optional, configurable)
  - **System**: Error/recovery notifications (rare)
- **Payload**: Includes deep-link URL to open relevant section when clicked
- **Appearance**: Browser-native notification UI (title, body, icon, actions)

### 13.2 In-App Notifications
- **Bell Icon**: In header shows unread count
- **Feed**: Dropdown or page showing recent notifications
- **Types**: Same as push + in-app only (e.g., "New comment on your idea")
- **Persistence**: Stored in browser IndexedDB or backend database
- **Actions**: Mark as read, jump to source, delete

### 13.3 Configuration
- **User Controls**: 
  - Master toggle for all notifications
  - Per-type toggles (daily ideas, trend alerts, etc.)
  - Quiet hours (do not disturb)
  - Notification sound selection
  - Volume/vibration settings
- **Defaults**: 
  - Daily ideas: ON
  - Trend alerts: ON (high threshold only)
  - Comment opportunities: OFF (user can enable)
  - Quiet hours: None

## 14. Analytics Integration (Buffer API)

### 14.1 Current Buffer API Research
Based on available documentation (as of 2024):
- **Endpoints**: 
  - `GET /profiles/{profile_id}/updates` - Get posts with metrics
  - `GET /profiles/{profile_id}/updates/{update_id}` - Single post analytics
  - `POST /profiles/{profile_id}/updates` - Create/update post (if needed)
  - `GET /analytics` - Aggregate metrics
- **Authentication**: OAuth 2.0 (requires user to connect account)
- **Rate Limits**: Reasonable for periodic polling (not real-time)
- **TikTok Support**: 
  - Confirmed: Basic metrics (views, likes, comments, shares)
  - Possible: Saves, watch time, completion rate (need to verify current support)
  - Missing: Some advanced metrics may require Business account
- **Limitations**: 
  - Historical data limits (typically 30-90 days)
  - No real-time streaming
  - Some metrics may require specific account types

### 14.2 Implementation Plan
- **Connection Flow**:
  - User clicks "Connect Buffer" in Settings
  - Redirects to Buffer OAuth flow
  - Returns auth token stored securely (encrypted in DB)
  - Fetch user's TikTok profiles
  - User selects which profile to sync
- **Sync Process** (every 6 hours):
  1. Fetch recent posts (last 7 days) from Buffer API
  2. For each post, get detailed analytics
  3. Upsert to BufferAnalytics table (avoid duplicates)
  4. Trigger learning analysis if new significant data
- **Fallback for Missing Metrics**:
  - If Buffer doesn't provide a metric (e.g., saves):
    - Show "Data not available via Buffer"
    - Enable manual entry form for that metric
    - Allow user to paste values from TikTok native analytics
- **Manual Entry**:
  - Form matching available Buffer metrics
  - Per-post entry with date/platform
  - Bulk import via CSV (template provided)
- **Dashboard Integration**:
  - Analytics page shows synced data
  - Correlation with content ideas (if posted idea ID is known)
  - Export options (CSV, JSON)
  - Disclaimer about Buffer data limitations

### 14.3 Alternatives if Buffer Fails
- **TikTok API Direct**: If user provides developer account (more complex auth)
- **Scraping Fallback**: Responsible scraping of public TikTok profiles (last resort)
- **Manual-Only**: Rely entirely on manual entry with helpful import tools
- **Analytics Lite**: Basic view counting via embedded pixels (if Tiger Market has website)

## 15. Security & Deployment Considerations

### 15.1 Security
- **Environment Variables**: 
  - Never commit secrets; use .env.example
  - ANTHROPIC_API_KEY, OPENROUTER_API_KEY, DATABASE_URL, etc.
- **Database**: 
  - Connection string encryption
  - Regular backups (automated via cron or hosting)
  - SQL injection prevented by Prisma/ORM
- **APIs**: 
  - Rate limiting on all public endpoints
  - Input validation and sanitization
  - CORS restricted to trusted domains
  - Helmet.js for security headers
- **Authentication** (if adding user accounts later):
  - Sessions: HTTP-only, secure cookies
  - Password: bcrypt hashing if needed
  - OAuth: For Buffer/other integrations
- **Data Privacy**: 
  - GDPR compliance: export/delete capabilities
  - Anonymization options for analytics
  - Clear privacy policy

### 15.2 Deployment
- **Development**: 
  - Docker Compose for local dev (postgres, redis, app)
  - Hot reloading with nodemon/webpack-dev-server
  - Environment-specific configs
- **Production**:
  - Docker container (multi-stage build)
  - Reverse proxy (NGINX) for SSL, static assets, rate limiting
  - Process manager (PM2) for Node.js cluster mode
  - Database hosted separately (managed PostgreSQL preferred)
  - Redis for caching and session store
  - CDN for static assets (Cloudflare, AWS CloudFront)
  - Monitoring: Health checks, error tracking (Sentry), metrics (Prometheus/Grafana optional)
- **Environment Variables**: 
  - Separate .env for dev/staging/prod
  - Secrets managed via Docker secrets or cloud provider secrets manager

### 15.3 Scalability Considerations
- **Horizontal Scaling**: 
  - Stateless API servers behind load balancer
  - Redis for shared state (sessions, rate limiting, caching)
  - Database read replicas for analytics queries
- **Caching Strategy**: 
  - API responses: Redis with smart TTL (5min-1hr based on volatility)
  - Trend data: Cache expensive computations
  - Frontend: CDN + service worker caching
- **Background Jobs**: 
  - Separate worker processes or scheduled instances
  - Queue system (BullMQ/RabbitMQ) for retryable jobs if scale increases
  - Current cron-based approach sufficient for MVP

## 16. Development Roadmap & Milestones

### Phase 0: Foundation (Week 1)
- [ ] Project setup: repo, docker-compose, basic Express/TS server
- [ ] Database schema design and migrations
- [ ] Basic auth middleware (placeholder)
- [ ] Health check endpoint
- [ ] Initial commit to GitHub

### Phase 1: Core Research Engine (Weeks 2-3)
- [ ] Trend detection framework (pluggable sources)
- [ ] Implement 2-3 priority sources (e.g., Google Trends, Reddit, YouTube)
- [ ] Velocity scoring and trend classification
- [ ] Basic trend storage and API endpoints
- [ ] Manual trigger endpoint for testing

### Phase 2: Content Idea Generation (Weeks 4-5)
- [ ] LLM integration (Anthropic via OpenRouter)
- [ ] Prompt engineering for content ideas
- [ ] Idea generation pipeline (trends → ideas)
- [ ] Database model for ContentIdea
- [ ] API endpoints for idea management (approve/reject/posted)
- [ ] Daily research job at 14:00 (cron)

### Phase 3: Frontend MVP (Weeks 6-7)
- [ ] React + TypeScript + Tailwind setup
- [ ] Basic layout with dark/JARVIS theme
- [ ] Dashboard view with today's ideas
- [ ] Trends view with list/detail
- [ ] API service layer
- [ ] State management (Zustand or Context)
- [ ] Routing (React Router v6)

### Phase 4: Brand Comment Radar (Weeks 8-9)
- [ ] Brand detection algorithm
- [ ] Comment generation via LLM
- [ ] UI for opportunities (two tabs)
- [ ] Rating system (👍/👎)
- [ ] Brand discovery and approval workflow
- [ ] Notification for high-opportunity videos

### Phase 5: Competitor & Learning Systems (Weeks 10-11)
- [ ] Competitor tracking (manual add/remove/pause)
- [ ] Competitor analysis engine
- [ ] Discovery and approval workflow for new competitors
- [ ] Learning system framework
- [ ] Weekly analysis job
- [ ] "What Works" view
- [ ] Feedback collection on ideas/comments

### Phase 6: Calendar, Analytics & Notifications (Weeks 12-13)
- [ ] Content calendar view (month/week/day)
- [ ] Drag & drop rescheduling
- [ ] Buffer API integration
- [ ] Manual analytics entry form
- [ ] Browser push notifications (service worker)
- [ ] Daily ready and trend alert notifications
- [ ] Settings page

### Phase 7: Categories & Polish (Week 14)
- [ ] Weekly category discovery system
- [ ] Category approval/rejection workflow
- [ ] UI/UX polish across all views
- [ ] Performance optimization
- [ ] Error handling and logging improvements
- [ ] Documentation and help tooltips

### Phase 8: Testing & Deployment (Week 15)
- [ ] End-to-end testing of core flows
- [ ] Load testing (simulate 100 concurrent users)
- [ ] Security audit (OWASP basics)
- [ ] Docker production image build
- [ ] Deployment checklist and documentation
- [ ] Final review and release

### Ongoing:
- [ ] Source expansion (add more platforms as time permits)
- [ ] LLM prompt refinement based on results
- [ ] UI/UX iterations based on user feedback
- [ ] Feature flags for experimental systems
- [ ] Accessibility improvements (WCAG 2.1 AA)

## 17. Open Questions for User Approval

Before proceeding with implementation, I need your approval on these key decisions:

### 17.1 Architecture Choices
1. **Backend Language**: Node.js/TypeScript (chosen for I/O strength and ecosystem) vs Python/FastAPI (better for ML/AI but heavier for web serving)?
2. **Database**: PostgreSQL + Prisma (chosen for reliability and ORM) vs SQLite (simpler for initial dev) vs MongoDB (flexible JSON)?
3. **Frontend Framework**: React + TypeScript (chosen for ecosystem and performance) vs Vue 3 vs Svelte vs vanilla web components?

### 17.2 Feature Prioritization
1. **MPC Scope**: Should we build all 25 specified features for MVP, or prioritize a core subset first?
   - **Core**: Daily ideas, trend discovery, Brand Comment Radar, competitor tracking, learning system
   - **Phase 2**: Content calendar, analytics, categories, user ideas, advanced notifications
2. **Notification Strategy**: Start with browser push only, or also implement in-app notification center?
3. **Analytics Depth**: Implement full Buffer API integration first, or start with manual entry only?

### 17.3 Technical Details
1. **AI Model Usage**: 
   - Use Sonnet for most tasks (balanced cost/performance)
   - Use Opus for complex reasoning (trend analysis, comment generation)
   - Or always use Sonnet for simplicity?
2. **Scraping Ethics**: 
   - Implement responsible scraping with rate limits, user-agent rotation, robots.txt respect
   - Or rely solely on official APIs and search engines?
3. **Real-time Features**: 
   - Start with polling-based updates (simple, reliable)
   - Or implement WebSocket/Socket.IO for live updates from start?
4. **Deployment Target**: 
   - Docker container (recommended for consistency)
   - Or traditional Node.js/postgres server setup?

### 17.4 Design & UX
1. **JARVIS Theme Implementation**: 
   - Go all-in on dark holographic UI with glowing elements
   - Or start with clean dark theme and add futuristic elements iteratively?
2. **Mobile Responsiveness**: 
   - Prioritize desktop-first (assumed primary use case)
   - Or build responsive from start for tablet/phone use?
3. **Accessibility**: 
   - Meet WCAG 2.1 AA standards
   - Or start with basic accessibility and improve later?

### 17.5 Data & Sources
1. **Initial Source Set**: 
   - Start with 3-4 high-yield sources (Google Trends, Reddit, YouTube, TikTok via scraping/search)
   - Or implement all desired sources from beginning?
2. **Rate Limiting Strategy**: 
   - Conservative limits to avoid blocking
   - Or aggressive limits with backoff and retry?
3. **Data Freshness**: 
   - Accept slightly stale data (cached 15-60min) for better reliability
   - Or insist on near-real-time despite complexity?

## Next Steps
Once you approve the architecture and prioritize features, I will:
1. Create the repository structure
2. Implement the database schema
3. Set up the basic server and API routes
4. Begin work on the highest priority approved features

Please review this plan and provide your feedback/approval on the open questions so we can proceed with confidence.